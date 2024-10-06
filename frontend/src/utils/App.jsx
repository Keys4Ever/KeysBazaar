import ProductCard from '../components/ProductCard/ProductCard.jsx';
import './App.css';
import mockProduct from '../utils/mockup.json'
import Footer from '../components/Footer/Footer.jsx';

function App() {
  return (
    <div className="App">
      <div className="product-grid">
        {mockProduct.map((product) => (
          <ProductCard
            key={product.productId} 
            banner={product.banner}
            name={product.name}
            price={product.price}
            productId={product.productId}
            trailer={product.trailer}
          />
        ))}
      </div>
    </div>
  );
}

export default App;