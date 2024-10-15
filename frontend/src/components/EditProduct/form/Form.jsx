import { useState, useEffect } from "react";
import mockup from '../../../utils/mockup.json';

const Form = ({ populateForm = false, id }) => {

    const [product, setProduct] = useState({
        name: '',
        imageUrl: '',
        trailerUrl: '',
        price: '',
        description: '',
        categoryIds: []
    });

    const [originalProduct, setOriginalProduct] = useState({
        name: '',
        imageUrl: '',
        trailerUrl: '',
        price: '',
        description: '',
        categoryIds: []
    })
    
    
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
                            description: data.description,
                            categoryIds: data.categoryIds || []
                        });
                        setOriginalProduct({
                            name: data.title,
                            imageUrl: data.imageUrl,
                            trailerUrl: data.trailerUrl,
                            price: data.price,
                            description: data.description,
                            categoryIds: data.categoryIds || []
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
        console.log('Product: ', product, " Original product: ", originalProduct);
        const result = await editProduct(product, originalProduct);

        if (result.success) {
            alert("Product updated successfully:", result.data);
        } else {
            console.error("Error adding product:", result.error);
        }
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
                    description: product.description,
                    categoryIds: product.categoryIds
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

    const editProduct = async(product, originalProduct) => {
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
            
            if(somethingHasChanged){
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
            }else{
                alert("Nothing has changed");
                return { success: false, error: 'Nothing changed.' };

            }
            
        } catch (e) {
            console.error(e);
            return { success: false, error: e.message };

        }
    };
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "categoryIds") {
            setProduct({ ...product, categoryIds: value.split(',').map(id => parseInt(id.trim(), 10)) });
        } else {
            setProduct({ ...product, [name]: value });
        }
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
            {!populateForm && (
                <div>
                <label htmlFor="categoryIds">Category IDs</label>
                <input
                    type="text"
                    id="categoryIds"
                    name="categoryIds"
                    value={product.categoryIds.join(', ')}
                    onChange={handleChange}
                    required
                />
               </div>
            )}
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
