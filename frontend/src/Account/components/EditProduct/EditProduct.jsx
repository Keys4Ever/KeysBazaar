import { useState } from "react";
import Form from "./form/Form.jsx";

const EditProduct = () => {
    const [id, setId] = useState("");

    const handleInputChange = (event) =>{
        setId(event.target.value);
    }

    return (
        <>
            <label htmlFor="product-id">ID</label>
            <input
            type="text"
            id="product-id"
            value={id}
            onChange={handleInputChange}
            placeholder="ID"
            />
            <Form populateForm={true} id={id} />
        </>
    );
};

export default EditProduct;
