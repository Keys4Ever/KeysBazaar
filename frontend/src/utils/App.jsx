import React from 'react';
import './App.css';
import mockProduct from '../utils/mockup.json';
import Section from '../components/Section/Section.jsx';
import SectionSeparator from '../components/SectionSeparator/SectionSeparator.jsx';
import ProductGrid from '../components/ProductGrid/ProductGrid.jsx';

function App() {
    return (
        <div className="App">

            <Section title="Most Popular Games">
                <ProductGrid currentProducts={mockProduct} classname="product"/>
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
            //ماذا يجب أن أفعل في الفئات؟
export default App;