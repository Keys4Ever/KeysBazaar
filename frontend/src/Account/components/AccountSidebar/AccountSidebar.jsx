import "./AccountSidebar.css";

const AccountSidebar = ({ activeTab, setActiveTab }) => {
    return (
        <div className="account-sidebar">
            <ul>
                <li
                    className={activeTab === "overview" ? "active" : ""}
                    onClick={() => setActiveTab("overview")}
                >
                    Overview
                </li>
                <li
                    className={activeTab === "orders" ? "active" : ""}
                    onClick={() => setActiveTab("orders")}
                >
                    Order History
                </li>
                <li
                    className={activeTab === "personal-info" ? "active" : ""}
                    onClick={() => setActiveTab("personal-info")}
                >
                    Personal Information
                </li>
                <li
                    className={activeTab === "payment-methods" ? "active" : ""}
                    onClick={() => setActiveTab("payment-methods")}
                >
                    Payment Methods
                </li>
            </ul>
        </div>
    );
};

export default AccountSidebar;
