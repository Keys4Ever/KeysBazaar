import { useEffect, useState } from "react";
import AccountOverview from "@components/AccountOverview/AccountOverview.jsx"; 
import AccountSidebar from "@components/AccountSidebar/AccountSidebar.jsx";
import OrderHistory from "@components/OrderHistory/OrderHistory.jsx";
import PersonalInfo from "@components/PersonalInfo/PersonalInfo.jsx";
import PaymentMethods from "@components/PaymentMethods/PaymentMethods.jsx";
import AdminSidebar from "@components/AdminSidebar/AdminSidebar.jsx";
import AddProduct from "@components/AddProduct/AddProduct.jsx";
import EditProduct from "@components/EditProduct/EditProduct.jsx";
import DeleteProduct from "@components/DeleteProduct/DeleteProduct.jsx";
import "./AccountPage.css";
import { useAuth } from "../../context/authContext";

const AccountPage = () => {

    const [activeTab, setActiveTab] = useState("overview");
    const [isAdmin, setIsAdmin] = useState(false);
    const { auth } = useAuth();
    
    useEffect(()=>{
        if(!auth.authenticated){
            window.location.href = "http://localhost:3000/login";
        }
    });
    useEffect(()=>{
        console.log(auth);
        const userId = auth.user.sub.split('|')[1];
        fetch(`http://localhost:3000/api/users/${userId}`)
            .then((response) => response.json())
            .then((data) => setIsAdmin(data.role == "admin" ? true : false))
            .catch((error) =>
                console.error("Error fetching the most popular product:", error)
            );
    },[])

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
