import resend from '../config/resend.js'

/**
 * Sends an email with the assigned keys.
 * 
 * @param {Object} result - Details of the email and transaction.
 * @param {string} result.email - Recipient's email address.
 * @param {string} result.orderId - Order ID.
 * @param {Array<{ product_id: number, key: string }>} result.assignedKeys - Assigned keys by product.
 * @param {string} result.transactionId - Transaction ID.
 * @returns {Promise<Object>} - Response data from the Resend service.
 */
const sendAssignedKey = async (result) => {
  const { email, orderId, assignedKeys, transactionId } = result;

  if (!email || !orderId || !transactionId || !Array.isArray(assignedKeys) || assignedKeys.length === 0) {
    throw new Error("Missing bullshit.");
  }

  const keysListHtml = assignedKeys
    .map(keyItem => `<li>Product ${keyItem.product_id}: ${keyItem.key}</li>`)
    .join("");

    //#TODO: Add the title for each product. 
  const emailHtml = `
    <strong>No inbox direction, don't reply</strong>
    <p>Keys for your order: <strong>#${orderId}</strong>:</p>
    <ul>
      ${keysListHtml}
    </ul>
    <p>Transaction id: ${transactionId}</p>
    <p>If you have any problem, contact us.</p>
  `;

  const { data, error } = await resend.emails.send({
    from: "KeysBazaar <onboarding@keys4ever.dev>",
    to: [email],
    subject: "Thanks for puchase!",
    html: emailHtml,
  });

  if (error) {
    console.error('Error en services: ', error)
    throw new Error("Error al enviar el email.");
  }

  return data;
};

export default sendAssignedKey;
