import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Handler = async (req, res) => {
  try {
    const response = await stripe.checkout.sessions.retrieve(req.body.id);

    if (req.body.cancel) {
      return res.json({ sub_id: response.customer });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: response.customer,
      return_url: `${process.env.NEXT_PUBLIC_UI_URL}/other/my-account`,
    });
    return res.json({ session });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json(err.message);
  }
};

export default Handler;
