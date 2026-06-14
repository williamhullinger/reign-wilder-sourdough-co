const crypto = require("crypto");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;

    if (!accessToken || !locationId) {
      throw new Error("Square environment variables are missing.");
    }

    const body = JSON.parse(event.body || "{}");

    const {
      items = [],
      customer = {},
      fulfillment = {},
      notes = "",
    } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Cart is empty." }),
      };
    }

    const lineItems = items.map((item) => {
      const name = String(item.name || "Reign & Wilder Item").slice(0, 255);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const price = Number(item.price);

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(`Invalid price for ${name}`);
      }

      return {
        name,
        quantity: String(quantity),
        base_price_money: {
          amount: Math.round(price * 100),
          currency: "USD",
        },
        note: [item.id ? `Item ID: ${item.id}` : "", item.details || ""]
          .filter(Boolean)
          .join(" | ")
          .slice(0, 500),
      };
    });

    const subtotalCents = lineItems.reduce((total, item) => {
      return total + item.base_price_money.amount * Number(item.quantity);
    }, 0);

    const orderNoteParts = [
      customer.name ? `Customer: ${customer.name}` : "",
      customer.email ? `Email: ${customer.email}` : "",
      customer.phone ? `Phone: ${customer.phone}` : "",
      fulfillment.type ? `Fulfillment: ${fulfillment.type}` : "",
      fulfillment.date ? `Preferred date: ${fulfillment.date}` : "",
      fulfillment.time ? `Preferred time: ${fulfillment.time}` : "",
      notes ? `Notes: ${notes}` : "",
    ].filter(Boolean);

    const idempotencyKey =
      crypto.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const squareResponse = await fetch(
      "https://connect.squareup.com/v2/online-checkout/payment-links",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Square-Version": "2025-01-23",
        },
        body: JSON.stringify({
          idempotency_key: idempotencyKey,
          checkout_options: {
            redirect_url: "https://reignandwilder.com/thank-you.html",
            ask_for_shipping_address: false,
          },
          order: {
            location_id: locationId,
            reference_id: `RW-${Date.now()}`,
            line_items: lineItems,
            taxes: [
              {
                name: "Estimated Sales Tax",
                percentage: "8.25",
                scope: "ORDER",
              },
            ],
            metadata: {
              customer_name: String(customer.name || ""),
              customer_email: String(customer.email || ""),
              customer_phone: String(customer.phone || ""),
              fulfillment_type: String(fulfillment.type || ""),
              preferred_date: String(fulfillment.date || ""),
              preferred_time: String(fulfillment.time || ""),
            },
            note: orderNoteParts.join(" | ").slice(0, 500),
          },
        }),
      }
    );

    const data = await squareResponse.json();

    if (!squareResponse.ok) {
      console.error("Square error:", data);

      return {
        statusCode: squareResponse.status,
        body: JSON.stringify({
          error: "Square checkout failed.",
          details: data,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        checkoutUrl: data.payment_link.url,
        orderId: data.payment_link.order_id,
        subtotalCents,
      }),
    };
  } catch (error) {
    console.error("Checkout function error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Checkout failed.",
      }),
    };
  }
};