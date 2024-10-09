import { useState } from "react";
import AccountOverview from "../../components/AccountOverview/AccountOverview.jsx"; 
import AccountSidebar from "../../components/AccountSidebar/AccountSidebar.jsx";
import OrderHistory from "../../components/OrderHistory/OrderHistory.jsx";
import PersonalInfo from "../../components/PersonalInfo/PersonalInfo.jsx";
import PaymentMethods from "../../components/PaymentMethods/PaymentMethods.jsx";
import "./AccountPage.css";

const AccountPage = () => {
    const [activeTab, setActiveTab] = useState("overview");

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return <AccountOverview />;
            case "orders":
                return <OrderHistory />;
            case "personal-info":
                return <PersonalInfo />;
            case "payment-methods":
                return <PaymentMethods />;
            default:
                return <AccountOverview />;
        }
    };

    return (
        <div className="account-page">
            <AccountSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
            <div className="account-content">{renderTabContent()}</div>
        </div>
    );
};

export default AccountPage;
