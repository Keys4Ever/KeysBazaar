import './SectionSeparator.css';

const SectionSeparator = ({ children }) => {
    return (
        <div className="section-separator">
            <div className="separator-content">
                {children}
            </div>
        </div>
    );
};

export default SectionSeparator;