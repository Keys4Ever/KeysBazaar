import ProductCard from '../components/ProductCard/ProductCard.jsx';
import './App.css';
import mockProduct from '../utils/mockup.json'

function App() {
  return (
    <div className="App">
      <h1>Test</h1>
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