import { useParams } from 'react-router-dom';
import mockupProduct from '../../utils/mockup.json';
import './ProductPage.css';
import ProductSlider from '../../components/ProductSlider/ProductSlider';

const ProductPage = () => {
    const { id } = useParams();
    const product = mockupProduct.find((p) => p.productId === id);
    function handleAddCartButton() {
        //Kaypi chayanchis hukchasqayta karuta yapaypaq.
        alert(`Has agregado el producto "${product.name}" al carrito`);
    }
    window.scrollTo(0,0);
    return (
        <>
            <div className='product-page' id='asd'>
                <img className='product-image' src={product.banner} alt={product.name} />
                <div className='product-info'>
                    <h1 className='product-title'>{product.name}</h1>
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
