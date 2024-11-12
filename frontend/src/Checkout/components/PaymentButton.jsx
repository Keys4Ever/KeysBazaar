const PaymentButton = ({ text, action }) => {
    return (
        <button className="payment-button" onClick={action}>
            {text}
        </button>
    )
}

export default PaymentButton;