import client from "../config/turso";

// Utility functions
const validateDate = (date) => {
    const dateTime = new Date(date);
    const currentDate = new Date();

    if (isNaN(dateTime.getTime())) {
        throw new Error("Invalid date format. Please use a valid ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)");
    }

    if (dateTime <= currentDate) {
        throw new Error("End date must be in the future");
    }

    return dateTime;
};

const validateDiscountPercentage = (percentage) => {
    if (percentage <= 0 || percentage > 100) {
        throw new Error("Discount percentage must be between 0 and 100");
    }
    return percentage;
};

const getCurrentDate = () => new Date().toISOString();

const checkProductExists = async (transaction, productId) => {
    const productCheck = await transaction.execute({
        sql: "SELECT id FROM products WHERE id = ?",
        args: [productId]
    });

    if (!productCheck.rows || productCheck.rows.length === 0) {
        throw new Error('Product not found');
    }
    return true;
};

const checkActiveDiscount = async (transaction, discountId) => {
    const currentDate = getCurrentDate();
    const discountCheck = await transaction.execute({
        sql: `
            SELECT id, end_date 
            FROM discounts 
            WHERE id = ? 
            AND start_date <= ? 
            AND end_date > ?
        `,
        args: [discountId, currentDate, currentDate]
    });

    if (!discountCheck.rows || discountCheck.rows.length === 0) {
        throw new Error('Discount not found or has expired');
    }
    return discountCheck.rows[0];
};

const checkExistingProductDiscount = async (transaction, productId) => {
    const currentDate = getCurrentDate();
    const existingDiscount = await transaction.execute({
        sql: `
            SELECT d.id, d.end_date 
            FROM product_discounts pd
            JOIN discounts d ON pd.discount_id = d.id
            WHERE pd.product_id = ?
            AND d.end_date > ?
        `,
        args: [productId, currentDate]
    });

    if (existingDiscount.rows && existingDiscount.rows.length > 0) {
        throw new Error('Product already has an active discount');
    }
};

// Controller functions
const createDiscount = async(req, res) => {
    const { discountPercentage, endDate } = req.body;

    if(!discountPercentage || !endDate){
        return res.status(400).json({ message: "Discount percentage and end date are required"});
    }

    try {
        const validatedEndDate = validateDate(endDate);
        validateDiscountPercentage(discountPercentage);

        const transaction = await client.transaction('write');
        try {
            const response = await transaction.execute({
                sql: "INSERT INTO discounts (discount_percentage, end_date) VALUES (?, ?)",
                args: [discountPercentage, validatedEndDate.toISOString()]
            });

            if (!response.rowsAffected){
                throw new Error('Error adding discount');
            }

            await transaction.commit();
            res.status(200).json({
                message: "Discount created successfully",
                discount: {
                    discount_percentage: discountPercentage,
                    end_date: validatedEndDate.toISOString()
                }
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const addProductToDiscount = async(req, res) => {
    const { discountId, productId } = req.body;

    if(!productId || !discountId){
        return res.status(400).json({message: 'Missing required fields'});
    }

    const transaction = await client.transaction('write');
    try {
        await checkProductExists(transaction, productId);
        const discount = await checkActiveDiscount(transaction, discountId);
        await checkExistingProductDiscount(transaction, productId);

        const response = await transaction.execute({
            sql: "INSERT INTO product_discounts (discount_id, product_id) VALUES (?, ?)",
            args: [discountId, productId]
        });

        if (!response.rowsAffected){
            throw new Error('Error adding product to discount');
        }

        await transaction.commit();
        res.status(200).json({
            message: 'Product added to the discount successfully',
            discountEndDate: discount.end_date
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(error.message.includes('not found') ? 404 : 400).json({
            message: error.message
        });
    }
};

const updateDiscount = async(req, res) =>{
    const { discountId, newDiscountPercentage, newEndDate } = req.body;
    
    if(!discountId){
        return res.status(400).json({message: 'Missing required fields'});
    }

    if(!newDiscountPercentage && !newEndDate){
        return res.status(400).json({message: 'At least one field to update is required'});
    }

    try {
        const updates = [];
        const args = [];

        if (newDiscountPercentage !== undefined) {
            validateDiscountPercentage(newDiscountPercentage);
            updates.push('discount_percentage = ?');
            args.push(newDiscountPercentage);
        }

        if (newEndDate !== undefined) {
            const validatedEndDate = validateDate(newEndDate);
            updates.push('end_date = ?');
            args.push(validatedEndDate.toISOString());
        }

        const transaction = await client.transaction('write');
        try {
            const sql = `UPDATE discounts SET ${updates.join(',')} WHERE id = ?`;
            args.push(discountId);

            const response = await transaction.execute({ sql, args });
            
            if (!response.rowsAffected){
                throw new Error('Error updating discount');
            }

            await transaction.commit();
            res.status(200).json({
                message: 'Discount updated successfully',
                updatedFields: {
                    ...(newDiscountPercentage !== undefined && { discount_percentage: newDiscountPercentage }),
                    ...(newEndDate !== undefined && { end_date: newEndDate })
                }
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const getDiscountedProductsId = async(req, res) => {
    const { discountId } = req.params;
    if(!discountId){
        return res.status(400).json({message: 'Missing required fields'});
    }

    try {
        const response = await client.execute({
            sql: `
                SELECT 
                    p.id,
                    p.title,
                    p.price,
                    d.discount_percentage,
                    (p.price * (1 - d.discount_percentage/100)) as discounted_price
                FROM product_discounts pd
                JOIN products p ON pd.product_id = p.id
                JOIN discounts d ON pd.discount_id = d.id
                WHERE pd.discount_id = ? 
                AND d.start_date <= ?
                AND d.end_date >= ?
            `,
            args: [discountId, getCurrentDate(), getCurrentDate()]
        });
        
        if (!response.rows){
            throw new Error('Error fetching products');
        }

        return res.status(200).json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};

const getDiscountForProduct = async(req, res) => {
    const { productId } = req.params;

    if(!productId) {
        return res.status(400).json({message: 'Product ID is required'});
    }

    try {
        const response = await client.execute({
            sql: `
                SELECT d.* 
                FROM discounts d
                JOIN product_discounts pd ON d.id = pd.discount_id
                WHERE pd.product_id = ? 
                AND d.start_date <= ?
                AND d.end_date >= ?
                ORDER BY d.discount_percentage DESC
                LIMIT 1
            `,
            args: [productId, getCurrentDate(), getCurrentDate()]
        });

        if (!response.rows || response.rows.length === 0) {
            return res.status(404).json({message: 'No active discount found for this product'});
        }

        return res.status(200).json(response.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};

const getDiscounts = async(req, res) => {
    try {
        const response = await client.execute({
            sql: `
                SELECT 
                    d.id,
                    d.discount_percentage,
                    d.start_date,
                    d.end_date,
                    COUNT(pd.product_id) as total_products
                FROM discounts d
                LEFT JOIN product_discounts pd ON d.id = pd.discount_id
                WHERE d.end_date >= ?
                GROUP BY d.id
                ORDER BY d.end_date ASC
            `,
            args: [getCurrentDate()]
        });

        if (!response.rows) {
            throw new Error('Error fetching discounts');
        }

        return res.status(200).json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};

export {
    createDiscount,
    addProductToDiscount,
    deleteDiscount,
    updateDiscount,
    getDiscountedProductsId,
    getDiscountForProduct,
    getDiscounts
};