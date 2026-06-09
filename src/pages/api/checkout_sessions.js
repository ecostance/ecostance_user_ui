import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Handler = async (req, res) => {
  try {
    const { paymentMode, email, customerEmail, items, metadata } = req.body;

    // Use customerEmail if provided, otherwise fall back to email
    const resolvedEmail = customerEmail || email;

    console.log("=== CHECKOUT SESSIONS API DEBUG ===");
    console.log("Payment mode:", paymentMode);
    console.log("Email:", resolvedEmail);
    console.log("Items:", items);
    console.log("Metadata:", metadata);

    // Resolve base URL for success/cancel redirects
    const inferredOrigin = req?.headers?.origin;
    const envUiUrl = process.env.NEXT_PUBLIC_UI_URL;
    const baseUrl =
      (envUiUrl && envUiUrl.trim()) ||
      inferredOrigin ||
      "https://ecostance.com";

    // Base checkout session payload
    const incomingDiscounts = req?.body?.discounts;
    const checkoutSessionPayload = {
      line_items: items || [],
      ...(Array.isArray(incomingDiscounts) && incomingDiscounts.length > 0
        ? { discounts: incomingDiscounts }
        : {}),
      payment_method_types: ["card"],
      customer_email: resolvedEmail,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
      metadata: metadata || {},
    };

    // Handle different payment modes
    if (paymentMode === "subscription") {
      // Subscription mode: create recurring payment for 12 months
      checkoutSessionPayload.mode = "subscription";

      // Calculate cancel_at timestamp (12 months from now) - will be applied after checkout
      const now = Math.floor(Date.now() / 1000);
      const twelveMonthsInSeconds = 12 * 30 * 24 * 60 * 60;
      const cancelAt = now + twelveMonthsInSeconds;

      checkoutSessionPayload.subscription_data = {
        metadata: {
          paymentType: "subscription",
          totalInstallments: "12",
          cancelAfterTimestamp: cancelAt.toString(), // Store for webhook to use
          ...metadata,
        },
      };

      // Transform line_items to include recurring interval for subscription
      checkoutSessionPayload.line_items = (items || []).map((item) => {
        // If item has price_data, add recurring interval
        if (item.price_data) {
          return {
            ...item,
            price_data: {
              ...item.price_data,
              recurring: {
                interval: "month",
                interval_count: 1,
              },
            },
          };
        }
        return item;
      });

      console.log("Creating subscription checkout session");
    } else if (paymentMode === "module") {
      // Module payment: one-time payment with metadata for future subscription setup
      checkoutSessionPayload.mode = "payment";
      checkoutSessionPayload.invoice_creation = { enabled: true };

      // Add metadata to track this is a module payment
      checkoutSessionPayload.metadata = {
        paymentType: "module",
        requiresSubscriptionSetup: "true",
        ...metadata,
      };
      checkoutSessionPayload.success_url = `${baseUrl}/checkout/success?moduleOrder=true&session_id={CHECKOUT_SESSION_ID}`;

      console.log("Creating module payment checkout session");
    } else {
      // One-time payment (default)
      checkoutSessionPayload.mode = "payment";
      checkoutSessionPayload.invoice_creation = { enabled: true };

      // Add metadata for one-time payments
      checkoutSessionPayload.metadata = {
        paymentType: "one-time",
        ...metadata,
      };

      console.log("Creating one-time payment checkout session");
    }

    console.log("Final checkout session payload:", checkoutSessionPayload);

    const session = await stripe.checkout.sessions.create(
      checkoutSessionPayload,
    );

    console.log("Stripe session created successfully:", session.id);

    // Return url at top-level for frontend compatibility
    res.json({ url: session.url, id: session.id, session });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(err.statusCode || 500).json({
      error: err.message,
      details: "Failed to create checkout session",
    });
  }
};

export default Handler;
