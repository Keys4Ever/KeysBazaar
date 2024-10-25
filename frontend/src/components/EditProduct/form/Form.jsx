import { useState, useEffect } from "react";

const Form = ({ populateForm = false, id }) => {
    const [product, setProduct] = useState({
        title: '',
        imageUrl: '',
        trailerUrl: '',
        price: '',
        description: '',
        categoryIds: []
    });

    const [originalProduct, setOriginalProduct] = useState({
        title: '',
        imageUrl: '',
        trailerUrl: '',
        price: '',
        description: '',
        categoryIds: []
    });

    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/categories")
            .then(res => res.json())
            .then(data => setAllCategories(data))
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    useEffect(() => {
        if (populateForm && id) {
            setTimeout(() => {
                fetch(`http://localhost:3000/api/products/${id}`)
                    .then(res => res.json())
                    .then(data => {
                        setProduct({
                            title: data.title,
                            imageUrl: data.imageUrl || '',
                            trailerUrl: data.trailerUrl || '',
                            price: data.price,
                            description: data.description,
                            categoryIds: data.categories.map(cat => cat.id)
                        });
                        setOriginalProduct({
                            title: data.title,
                            imageUrl: data.imageUrl || '',
                            trailerUrl: data.trailerUrl || '',
                            price: data.price,
                            description: data.description,
                            categoryIds: data.categories.map(cat => cat.id)
                        });
                    })
                    .catch(error => console.error("Error fetching product:", error));
            }, 200);
        }
    }, [populateForm, id]);

    const handleAdd = async (e) => {
        e.preventDefault();
        console.log(product);
        const result = await addProduct(product);

        if (result.success) {
            alert("Product added successfully:", result.data);
        } else {
            console.error("Error adding product:", result.error);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const result = await editProduct(product, originalProduct);

        if (result.success) {
            alert("Product updated successfully:", result.data);
        } else {
            console.error("Error editing product:", result.error);
        }
    };

    const addProduct = async (product) => {
        console.log(product);
        try {
            const response = await fetch(`http://localhost:3000/api/products/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData };
            }
    
            const data = await response.json();
            return { success: true, data: data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const editProduct = async (product, originalProduct) => {
        try {
            let bodyData = {};
            let somethingHasChanged = false;

            for (let key in product) {
                if (product[key] !== originalProduct[key]) {
                    bodyData[key] = product[key];
                    if(!somethingHasChanged){
                        somethingHasChanged = true;
                    }                
                }
            }

            if (somethingHasChanged) {
                const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyData),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    return { success: false, error: errorData };
                }

                const data = await response.json();
                return { success: true, data: data };
            } else {
                alert("Nothing has changed.");
                return { success: false, error: "Nothing changed." };
            }
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
    
        if (name === "categoryIds") {
            const categoryId = parseInt(value, 10);
            
            const updatedCategories = checked
                ? [...product.categoryIds, categoryId] 
                : product.categoryIds.filter(id => id !== categoryId);
    
            setProduct({ ...product, categoryIds: updatedCategories });
        } else {
            setProduct({ ...product, [name]: value });
        }
    };
    

    return (
        <form onSubmit={populateForm ? handleEdit : handleAdd}>
            <div>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={product.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="imageUrl">Image URL</label>
                <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={product.imageUrl}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="trailerUrl">Trailer URL</label>
                <input
                    type="url"
                    id="trailerUrl"
                    name="trailerUrl"
                    value={product.trailerUrl}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Categories</label>
                {allCategories.map(category => (
                    <div key={category.id}>
                        <label>
                            <input
                                type="checkbox"
                                name="categoryIds"
                                value={category.id}
                                checked={product.categoryIds.includes(category.id)}  // Correctly track selected state
                                onChange={handleChange}
                            />
                            {category.name}
                        </label>
                    </div>
                ))}
            </div>

            <div>
                <label htmlFor="price">Price</label>
                <input
                    type="text"
                    id="price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">{populateForm ? "Edit" : "Add"} Product</button>
        </form>
    );
};

export default Form;
