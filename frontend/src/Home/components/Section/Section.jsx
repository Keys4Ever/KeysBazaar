import './Section.css';

const Section = ({ title, children }) => {
    return (
        <div className="section">
            <h2 className="section-title">{title}</h2>
            <div className="section-content">
                {children}
            </div>
        </div>
    );
};

export default Section;