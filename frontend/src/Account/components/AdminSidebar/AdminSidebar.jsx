import "./AdminSidebar.css";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
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
                    className={activeTab === "add-product" ? "active" : ""}
                    onClick={() => setActiveTab("add-product")}
                >
                    Add Product
                </li>
                <li
                    className={activeTab === "edit-product" ? "active" : ""}
                    onClick={() => setActiveTab("edit-product")}
                >
                    Edit Product
                </li>
                <li
                    className={activeTab === "delete-product" ? "active" : ""}
                    onClick={() => setActiveTab("delete-product")}
                >
                    Delete Product
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
