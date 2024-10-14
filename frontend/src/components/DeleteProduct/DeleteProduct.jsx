import React, { useEffect, useState } from 'react';
import './DeleteProduct.css';

const DeleteProduct = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/products')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch products');
                }
                return res.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [products]);

    const handleDelete = (e) => {
        const productCard = e.target.closest('.pid');
        if (productCard) {
            const productId = productCard.getAttribute('data-productid');
            if (productId) {
                fetch(`http://localhost:3000/api/products/${productId}`, {
                    method: 'DELETE',
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to delete the product');
                    }
                    return res.json();
                })
                .then(data => {
                    alert('Product deleted successfully');
                    setProducts(products.filter(product => product.productId !== productId));
                })
                .catch(error => {
                    alert(`Error: ${error.message}`);
                });
            }
        }
    };
    
    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        const filteredProducts = products.filter((product) => {
            return product.id && product.id.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setProducts(filteredProducts);
    };

    if (loading) {
        return <p>Loading products...</p>;
    }
    if (error) {
        return <p>Error fetching products: {error}</p>;
    }
    return (
        <div className="product-list">
            <input
                type="text"
                placeholder="Search by Product ID"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />

            {products.length > 0 ? (
                products.map((product) => (
                    <div 
                        key={product.id} 
                        className="delete-product-card pid" 
                        data-productid={product.id}
                    >
                        <img src={product.imageUrl} alt={product.title} className="delete-product-banner" />
                        <div className="product-info">
                            <h2 className="delete-product-name">{product.title}</h2>
                            <p className="product-id">Product ID: {product.id}</p>
                        </div>
                        <button className="delete-button" onClick={handleDelete}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler-trash">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M4 7l16 0" />
                                <path d="M10 11l0 6" />
                                <path d="M14 11l0 6" />
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                        </button>
                    </div>
                ))
            ) : (
                <p>No products found</p> 
            )}
        </div>
    );
};

export default DeleteProduct;
