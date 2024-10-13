import { useState, useEffect } from "react";
import mockup from '../../../utils/mockup.json';

const Form = ({ populateForm = false, id }) => {

    const [product, setProduct] = useState({
        name: '',
        imageUrl: '',
        trailerUrl: '',
        price: '',
        description: ''
    });

    
    useEffect(() => {
        if (populateForm && id) {
            setTimeout(() => {
                fetch(`http://localhost:3000/api/products/${id}`)
                    .then(res => res.json())
                    .then(data => {
                        setProduct({
                            name: data.title,
                            imageUrl: data.imageUrl,
                            trailerUrl: data.trailerUrl,
                            price: data.price,
                            description: data.description
                        });
                    })
                    .catch(error => {
                        console.error("Error fetching product:", error);
                    });
            }, 200);
        }
    }, [populateForm, id]);

    const handleAdd = async(e) => {
        e.preventDefault();
        console.log(product);
        const result = await addProduct(product);

        if (result.success) {
            alert("Product added successfully:", result.data);
        } else {
            console.error("Error adding product:", result.error);
        }
    };

    const handleEdit = async(e) =>{
        e.preventDefault();

        //backend shit
    }

    const addProduct = async (product) => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: product.name,
                    imageUrl: product.imageUrl,
                    trailerUrl: product.trailerUrl,
                    price: product.price,
                    description: product.description
                })
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
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    return (
        <form onSubmit={populateForm ? handleEdit : handleAdd}>
            <div>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
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
}

export default Form;
