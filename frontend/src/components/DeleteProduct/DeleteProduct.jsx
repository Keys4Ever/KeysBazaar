import React, { useState } from 'react';
import mockup from '../../utils/mockup.json';
import './DeleteProduct.css'; // Importamos el archivo CSS

const DeleteProduct = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = () => {
        //Here should be backend shit
        alert('Product has been deleted');
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const filteredProducts = mockup.filter((product) =>
        product.productId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="product-list">
            <input
                type="text"
                placeholder="Search by Product ID"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />

            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                    <div key={product.productId} className="delete-product-card">
                        <img src={product.banner} alt={product.name} className="delete-product-banner" />
                        <div className="product-info">
                            <h2 className="delete-product-name">{product.name}</h2>
                            <p className="product-id">Product ID: {product.productId}</p>
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
}

export default DeleteProduct;
