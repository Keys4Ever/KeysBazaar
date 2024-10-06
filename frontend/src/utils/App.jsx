import React from 'react';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import './App.css';
import mockProduct from '../utils/mockup.json';
import Footer from '../components/Footer/Footer.jsx';
import Section from '../components/Section/Section.jsx';
import SectionSeparator from '../components/SectionSeparator/SectionSeparator.jsx';

function App() {
    return (
        <div className="App">

            <Section title="Most Popular Games">
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
            </Section>

            <SectionSeparator>
                <div className="separator-info">
                    <div className="separator-item">
                        <span role="img" aria-label="heart">❤️</span> Reliable and Safe
                    </div>
                    <div className="separator-item">
                        <span role="img" aria-label="users">👤</span> Over 10,000 users
                    </div>
                    <div className="separator-item">
                        <span role="img" aria-label="delivery">📦</span> Instant Purchase & Delivery
                    </div>
                </div>
            </SectionSeparator>

            <Section title="Categories">
                <p>Category 1, Category 2, Category 3...</p>
            </Section>
        </div>
    );
}

export default App;