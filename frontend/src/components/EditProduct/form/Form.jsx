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
        if (populateForm) {
            const thing = mockup.find(product => product.productId == id);
            if (thing) {
                setProduct({
                    name: thing.name,
                    imageUrl: thing.banner,
                    trailerUrl: thing.trailer,
                    price: thing.price,
                    description: thing.description
                });
            }
        }
    }, [populateForm, id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(product);
        //Here should be some backend shit
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    return (
        <form onSubmit={handleSubmit}>
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
            <button type="submit">Add Product</button>
        </form>
    );
}

export default Form;
