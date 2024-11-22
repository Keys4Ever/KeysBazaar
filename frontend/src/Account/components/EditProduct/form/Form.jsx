import { useState, useEffect } from "react";

const Form = ({ populateForm = false, id }) => {
    const [product, setProduct] = useState({
        title: '',
        trailerUrl: '',
        price: '',
        description: '',
        categoryIds: [],
    });

    const [originalProduct, setOriginalProduct] = useState({});
    const [file, setFile] = useState(null);
    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/categories")
            .then(res => res.json())
            .then(data => setAllCategories(data))
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    useEffect(() => {
        if (populateForm && id) {
            fetch(`http://localhost:3000/api/products/${id}`)
                .then(res => res.json())
                .then(data => {
                    const productData = {
                        title: data.title,
                        trailerUrl: data.trailerUrl || '',
                        price: data.price,
                        description: data.description,
                        categoryIds: data.categories.map(cat => cat.id),
                    };
                    setProduct(productData);
                    setOriginalProduct(productData);
                })
                .catch(error => console.error("Error fetching product:", error));
        }
    }, [populateForm, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", product.title);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("trailerUrl", product.trailerUrl);

        if (file) {
            formData.append("file", file);
        }

        product.categoryIds.forEach(id => formData.append("categoryIds", id));
        try {
            const url = `http://localhost:3000/api/products/${populateForm ? id : ''}`;
            const method = populateForm ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData);
                return;
            }

            alert(`${populateForm ? "Product updated" : "Product added"} successfully`);
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        let somethingHasChanged = false;
        const bodyData = {};

        for (let key in product) {
            if (product[key] !== originalProduct[key]) {
                somethingHasChanged = true;
                if (key === "categoryIds") {
                    bodyData[key] = product[key];
                } else {
                    bodyData[key] = product[key];
                }
            }
        }

        if (file) {
            somethingHasChanged = true;
        }

        if (!somethingHasChanged) {
            alert("Nothing has changed.");
            return;
        }

        handleSubmit(e);
    };

    const handleChange = (e) => {
        const { name, value, checked, files } = e.target;

        if (name === "categoryIds") {
            const categoryId = parseInt(value, 10);
            const updatedCategories = checked
                ? [...product.categoryIds, categoryId]
                : product.categoryIds.filter(id => id !== categoryId);
            setProduct({ ...product, categoryIds: updatedCategories });
        } else if (name === "file") {
            setFile(files[0]);
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    return (
        <form onSubmit={populateForm ? handleEdit : handleSubmit} encType="multipart/form-data">
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
                <label htmlFor="file">Image</label>
                <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleChange}
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
                                checked={product.categoryIds.includes(category.id)}
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
                    type="number"
                    id="price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea
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
