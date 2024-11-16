import resend from '../config/resend.js'

/**
 * Envía un email con las claves asignadas.
 * 
 * @param {Object} result - Detalles del email y transacción.
 * @param {string} result.email - Dirección de correo del destinatario.
 * @param {string} result.orderId - ID de la orden.
 * @param {Array<{ product_id: number, key: string }>} result.assignedKeys - Claves asignadas por producto.
 * @param {string} result.transactionId - ID de la transacción.
 * @returns {Promise<Object>} - Datos de respuesta del servicio Resend.
 */
const sendAssignedKey = async (result) => {
  const { email, orderId, assignedKeys, transactionId } = result;

  if (!email || !orderId || !transactionId || !Array.isArray(assignedKeys) || assignedKeys.length === 0) {
    throw new Error("Faltan parámetros requeridos o no hay claves asignadas.");
  }

  // Construimos el contenido HTML dinámicamente
  const keysListHtml = assignedKeys
    .map(keyItem => `<li>Producto ${keyItem.product_id}: ${keyItem.key}</li>`)
    .join("");

  const emailHtml = `
    <strong>¡Gracias por tu compra!</strong>
    <p>Aquí están las claves asignadas para tu pedido <strong>#${orderId}</strong>:</p>
    <ul>
      ${keysListHtml}
    </ul>
    <p>ID de la transacción: ${transactionId}</p>
    <p>Si tienes alguna duda, contáctanos.</p>
  `;

  const { data, error } = await resend.emails.send({
    from: "KeysBazaar <onboarding@keys4ever.dev>",
    to: [email],
    subject: "Tus claves asignadas",
    html: emailHtml,
  });

  if (error) {
    console.error('Error en services: ', error)
    throw new Error("Error al enviar el email.");
  }

  return data;
};

export default sendAssignedKey;
