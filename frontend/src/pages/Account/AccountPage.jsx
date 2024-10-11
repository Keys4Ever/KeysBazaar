import { useState } from "react";
import AccountOverview from "../../components/AccountOverview/AccountOverview.jsx"; 
import AccountSidebar from "../../components/AccountSidebar/AccountSidebar.jsx";
import OrderHistory from "../../components/OrderHistory/OrderHistory.jsx";
import PersonalInfo from "../../components/PersonalInfo/PersonalInfo.jsx";
import PaymentMethods from "../../components/PaymentMethods/PaymentMethods.jsx";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar.jsx";
import AddProduct from "../../components/AddProduct/AddProduct.jsx";
import EditProduct from "../../components/EditProduct/EditProduct.jsx";
import DeleteProduct from "../../components/DeleteProduct/DeleteProduct.jsx";
import "./AccountPage.css";

const AccountPage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    //Here should be data base logic
    const isAdmin = true;

    const renderAdminTabContent = () => {
        switch(activeTab) {
            case "overview":
                return <AccountOverview />;
            //Maybe most of this can be in the same tab xdd
            case "add-product":
                return <AddProduct />;
            case "edit-product":
                return <EditProduct />;
            case "delete-product":
                return <DeleteProduct />;
           /* case "orders": show all orders
                return <Orders />; */
            default:
                return <AccountOverview />;
        }
    }
    const renderUserTabContent = () => {
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
            {isAdmin ? <AdminSidebar setActiveTab={setActiveTab} activeTab={activeTab} /> :
            <AccountSidebar setActiveTab={setActiveTab} activeTab={activeTab} /> }
   
            <div className="account-content">{isAdmin ? renderAdminTabContent() : renderUserTabContent()}</div>
        </div>
    );
};

export default AccountPage;
