import { useParams } from 'react-router-dom';
import './ProductPage.css';
import ProductSlider from '@components/ProductSlider/ProductSlider';
import { useEffect, useState } from 'react';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/products/${id}`);
                if (!response.ok) {
                    throw new Error(`Can't find product with id ${id}`);
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error(error);
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    function handleAddCartButton() {
        if (product) {
            //Kaypi chayanchis hukchasqayta karuta yapaypaq.
            alert(`Has agregado el producto "${product.title}" al carrito`);
        }
    }

    window.scrollTo(0, 0);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!product) {
        return <div>No se encontró el producto.</div>;
    }

    return (
        <>
            <div className='product-page' id='asd'>
                <img className='product-image' src={product.imageUrl} alt={product.title} />
                <div className='product-info'>
                    <h1 className='product-title'>{product.title}</h1>
                    <p className='product-price'>Precio: ${product.price}</p>
                    <button className='product-button' onClick={handleAddCartButton}>Agregar al carrito</button>
                    <p className='product-details'>{product.description}</p>
                </div>
            </div>
            <hr/>
            <ProductSlider />
        </>
    );
};

export default ProductPage;
