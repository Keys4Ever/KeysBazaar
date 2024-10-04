import ProductCard from '../components/ProductCard/ProductCard.jsx';
import './App.css';

function App() {
  const mockProduct = {
    banner: 'https://gaming-cdn.com/images/products/7678/380x218/black-myth-wukong-pc-game-steam-europe-and-us-and-canada-cover.jpg?v=1728068400',
    name: 'Black Myth: Wukong',
    price: '23.54',
    productId: '123',
    trailer: 'https://gaming-cdn.com/videos/products/7678/800x450/black-myth-wukong-pc-game-steam-europe-and-us-and-canada-preview.webm?v=1724184288'
  };

  return (
    <div className="App">
      <h1>Test</h1>
      <ProductCard
        banner={mockProduct.banner}
        name={mockProduct.name}
        price={mockProduct.price}
        productId={mockProduct.productId}
        trailer={mockProduct.trailer}
      />
    </div>
  );
}

export default App;