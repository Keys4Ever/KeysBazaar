const API_URL = 'http://localhost:3000/api/carts';
const localCartKey = 'localCart';

export const getCartItems = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch cart items");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addToCart = async (userId, productId, quantity, product = null) => {
    // If userId is available, use the API to add the item to the cart
    if (userId) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, productId, quantity }),
            });
            if (!response.ok) {
                throw new Error("Failed to add item to cart");
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    } else {
        const localCart = JSON.parse(localStorage.getItem(localCartKey)) || [];
        
        const existingProductIndex = localCart.findIndex(item => item.product_id === productId);
        if (existingProductIndex >= 0) {
            localCart[existingProductIndex].quantity += quantity;
        } else if (product) {
            localCart.push({ 
                product_id: productId, 
                title: product.title, 
                price: product.price, 
                quantity 
            });
        }

        localStorage.setItem(localCartKey, JSON.stringify(localCart));
        return { ok: true };
    }
};

export const removeFromCart = async (userId, productId) => {
    try {
        const response = await fetch(`${API_URL}/${userId}/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error("Failed to remove item from cart");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const replaceCart = async (userId, items) => {
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, items }),
        });
        if (!response.ok) {
            throw new Error("Failed to replace cart");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
