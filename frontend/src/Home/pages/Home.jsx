import { Section, SectionSeparator, Banner, useMostPopularProduct } from '../index.js'
import { ProductGrid } from '@utils/Utils.js';
import { useState, useEffect } from 'react';
import '../styles/Home.css';

function Home() {
    const { popularProducts, error } = useMostPopularProduct(5);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (popularProducts) {
            setProducts(popularProducts);
        }
    }, [popularProducts]);

    return (
        <div className="App">
            <Banner />

            <Section title="Most Popular Games">
                {error ? (
                    <p>Error loading products: {error}</p>
                ) : (
                    <ProductGrid currentProducts={products} gridName="product" />
                )}
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

export default Home;
