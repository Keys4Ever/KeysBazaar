import { AccountSidebar, AccountOverview, OrderHistory, PersonalInfo, PaymentMethods, AdminSidebar, AddProduct, EditProduct, DeleteProduct } from "../index.js";
import { useEffect, useState } from "react";
import { useAuth } from '@utils/Utils.js';
import "../styles/AccountPage.css";

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
            .then((data) => setIsAdmin(data.role === "admin"))
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
