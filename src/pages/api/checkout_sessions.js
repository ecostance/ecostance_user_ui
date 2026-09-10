import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe rejects metadata values longer than 500 characters.
const STRIPE_METADATA_VALUE_LIMIT = 500;

/**
 * The checkout form stores the address under its own field names
 * (streetAddressOne / mailcode / phoneInfo). Translate it to the shape the
 * order APIs and the order-success page read (addressLine1 / pincode / phone).
 */
const normalizeBillingAddress = (address) => {
  if (!address || typeof address !== "object") return null;

  const phone = typeof address.phone === "object" ? address.phone : {};
  const phoneInfo =
    typeof address.phoneInfo === "object" ? address.phoneInfo : {};

  const normalized = {
    firstName: address.firstName || "",
    lastName: address.lastName || "",
    email: address.email || "",
    companyName: address.companyName || "",
    addressLine1: address.addressLine1 || address.streetAddressOne || "",
    addressLine2: address.addressLine2 || address.streetAddressTwo || "",
    city: address.city || "",
    state: address.state || "",
    country: address.country || "",
    pincode: address.pincode || address.mailcode || "",
    countryCode: address.countryCode || "",
    stateCode: address.stateCode || "",
    phone: {
      number: phone.number || phoneInfo.number || "",
      countryCode: phone.countryCode || phoneInfo.countryCode || "",
      numericCode: `${phone.numericCode || phoneInfo.numericCode || ""}`,
    },
  };

  const hasContent = normalized.addressLine1 || normalized.city;
  return hasContent ? normalized : null;
};

/**
 * Serialize the address for Stripe metadata so the `checkout.session.completed`
 * webhook can persist it. Guest (dynamic pricing) checkouts have no session on
 * the API side, so metadata is the only channel that survives the redirect.
 */
const serializeBillingAddress = (address) => {
  const normalized = normalizeBillingAddress(address);
  if (!normalized) return null;

  let serialized = JSON.stringify(normalized);
  if (serialized.length > STRIPE_METADATA_VALUE_LIMIT) {
    serialized = JSON.stringify({ ...normalized, addressLine2: "" });
  }
  if (serialized.length > STRIPE_METADATA_VALUE_LIMIT) {
    console.warn(
      "Billing address too large for Stripe metadata; sending trimmed address",
    );
    serialized = JSON.stringify({
      firstName: normalized.firstName,
      lastName: normalized.lastName,
      addressLine1: normalized.addressLine1,
      city: normalized.city,
      state: normalized.state,
      country: normalized.country,
      pincode: normalized.pincode,
      phone: normalized.phone,
    });
  }
  return serialized.length > STRIPE_METADATA_VALUE_LIMIT ? null : serialized;
};

const Handler = async (req, res) => {
  try {
    const { paymentMode, email, customerEmail, items, metadata, address } =
      req.body;

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

    // The address collected on our checkout page is the only address in the
    // flow — Stripe is not asked to collect one — so it has to ride along in
    // metadata for the webhook to store it on the order.
    const serializedBillingAddress = serializeBillingAddress(address);
    const baseMetadata = {
      ...(metadata || {}),
      ...(serializedBillingAddress
        ? { billingAddress: serializedBillingAddress }
        : {}),
    };

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
      metadata: baseMetadata,
    };

    const isModuleCheckout =
      baseMetadata.isModulePurchase === "true" ||
      baseMetadata.isDynamicPricing === "true" ||
      baseMetadata.guestCheckout === "true" ||
      !!(baseMetadata.linkId && String(baseMetadata.linkId).trim()) ||
      !!(baseMetadata.pricingLinkId && String(baseMetadata.pricingLinkId).trim());

    const moduleSuccessUrl = `${baseUrl}/checkout/success?moduleOrder=true&session_id={CHECKOUT_SESSION_ID}`;

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
          ...baseMetadata,
        },
      };

      const SUBSCRIPTION_INSTALLMENTS = 12;
      const pricesAreMonthly =
        baseMetadata.priceInterval === "monthly" ||
        baseMetadata.pricesAreMonthly === "true";

      // Transform line_items to include recurring interval for subscription.
      // Legacy clients sent the full 12-month total; newer clients send monthly.
      checkoutSessionPayload.line_items = (items || []).map((item) => {
        if (item.price_data) {
          const unitAmount = item.price_data.unit_amount || 0;
          const monthlyUnitAmount =
            !isModuleCheckout && !pricesAreMonthly
              ? Math.round(unitAmount / SUBSCRIPTION_INSTALLMENTS)
              : unitAmount;

          return {
            ...item,
            price_data: {
              ...item.price_data,
              unit_amount: monthlyUnitAmount,
              recurring: {
                interval: "month",
                interval_count: 1,
              },
            },
          };
        }
        return item;
      });

      if (isModuleCheckout) {
        checkoutSessionPayload.success_url = moduleSuccessUrl;
      }

      console.log("Creating subscription checkout session");
    } else if (paymentMode === "module") {
      // Module payment: one-time payment with metadata for future subscription setup
      checkoutSessionPayload.mode = "payment";
      checkoutSessionPayload.invoice_creation = { enabled: true };

      // Add metadata to track this is a module payment
      checkoutSessionPayload.metadata = {
        paymentType: "module",
        requiresSubscriptionSetup: "true",
        ...baseMetadata,
      };
      checkoutSessionPayload.success_url = moduleSuccessUrl;

      console.log("Creating module payment checkout session");
    } else {
      // One-time payment (default)
      checkoutSessionPayload.mode = "payment";
      checkoutSessionPayload.invoice_creation = { enabled: true };

      // Add metadata for one-time payments
      checkoutSessionPayload.metadata = {
        paymentType: "one-time",
        ...baseMetadata,
      };

      // Dynamic-pricing module checkouts use paymentMode "payment" but still
      // need moduleOrder=true on the success redirect for the receipt page.
      if (isModuleCheckout) {
        checkoutSessionPayload.success_url = moduleSuccessUrl;
      }

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
