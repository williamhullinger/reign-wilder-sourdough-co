exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;

    if (!resendApiKey || !squareAccessToken) {
      throw new Error("Missing RESEND_API_KEY or SQUARE_ACCESS_TOKEN");
    }

    const payload = JSON.parse(event.body || "{}");
    const payment = payload?.data?.object?.payment;

    if (!payment || payment.status !== "COMPLETED") {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Ignored non-completed payment." }),
      };
    }

    const orderId = payment.order_id;
    let orderDetails = null;

    if (orderId) {
      const orderResponse = await fetch(`https://connect.squareup.com/v2/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${squareAccessToken}`,
          "Content-Type": "application/json",
          "Square-Version": "2025-01-23",
        },
      });

      orderDetails = await orderResponse.json();
    }

    const order = orderDetails?.order || {};
    const lineItems = order.line_items || [];

    const itemList = lineItems
      .map((item) => {
        return `${item.quantity} x ${item.name} - ${item.variation_total_price_money?.amount ? `$${(item.variation_total_price_money.amount / 100).toFixed(2)}` : ""}`;
      })
      .join("<br>");

    const total = payment.total_money?.amount
      ? `$${(payment.total_money.amount / 100).toFixed(2)}`
      : "Unknown";

    const metadata = order.metadata || {};

    const emailHtml = `
      <h2>New Reign & Wilder Order</h2>

      <h3>Customer</h3>
      <p>
        <strong>Name:</strong> ${metadata.customer_name || "Not provided"}<br>
        <strong>Email:</strong> ${metadata.customer_email || "Not provided"}<br>
        <strong>Phone:</strong> ${metadata.customer_phone || "Not provided"}
      </p>

      <h3>Order</h3>
      <p>
        <strong>Total Paid:</strong> ${total}<br>
        <strong>Square Order ID:</strong> ${orderId || "Not available"}<br>
        <strong>Order Type:</strong> ${metadata.order_type || "Not provided"}<br>
        <strong>Fulfillment:</strong> ${metadata.fulfillment_type || "Not provided"}<br>
        <strong>Standard Pickup:</strong> ${metadata.standard_pickup_date || "Not provided"}<br>
        <strong>Requested Date:</strong> ${metadata.preferred_date || "Not provided"}<br>
        <strong>Preferred Time:</strong> ${metadata.preferred_time || "Not provided"}
      </p>

      <h3>Items</h3>
      <p>${itemList || "No item details found."}</p>

      <h3>Notes</h3>
      <p>${order.note || "No notes."}</p>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Reign & Wilder Orders <onboarding@resend.dev>",
        to: ["hello@reignandwilder.com"],
        subject: `New Reign & Wilder Order - ${total}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend error:", emailData);
      throw new Error("Email notification failed.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Order notification sent." }),
    };
  } catch (error) {
    console.error("Webhook error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Webhook failed." }),
    };
  }
};