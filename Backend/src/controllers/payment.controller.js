import prisma from "../config/prisma.js";
import transporter from "../config/nodemailer.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const payment = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "User not authenticated" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Premium Access" },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      metadata: { userId: String(req.user.userId) },
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/failed`,
    });

    return res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Stripe payment error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const verifyPaymentSession = async (req, res) => {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ success: false, message: "Missing session ID" });

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== "paid") {
            return res.status(400).json({ success: false, message: "Payment not completed." });
        }

        const userId = session.metadata?.userId;
        if (!userId) {
            console.error("User ID missing in Stripe session metadata!");
            return res.status(400).json({ success: false, message: "User ID missing in session metadata" });
        }
     
        const existingPaymentRecord = await prisma.paymentHistory.findUnique({
             where: { transactionId: session.id }, 
        });

        if (existingPaymentRecord) {
            return res.json({ success: true, message: "Payment already verified & access granted" });
        }
       
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } }); 
        if (!user) return res.status(404).json({ success: false, message: "User not found!" });

        await prisma.user.update({
            where: { id: Number(userId) },
            data: { premiumAccess: true },
        });

        await prisma.paymentHistory.create({
            data: {
                amount: session.amount_total / 100,
                currency: session.currency.toUpperCase(),
                paymentStatus: "PAID",
                transactionId: session.id, // This is the unique field
                method: session.payment_method_types[0] || "card",
                userId: Number(userId),
            },
        });

        await transporter.sendMail({
            to: user.email,
            subject: "Payment Successful",
            text: "Congrats! You now have premium access.",
        });

        return res.json({ success: true, message: "Payment verified & access granted" });
    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({ success: false, message: "Internal server error during verification." });
    }
};

export const premiumAccess = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "User not authenticated" });
    const user = await prisma.user.findUnique({ where: { id: Number(req.user.userId) } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.premiumAccess) {
      return res.json({ access: "granted", msg: "You have premium access.", success: true });
    } else {
      return res.json({ access: "denied", msg: "You do not have premium access.", success: false });
    }
  } catch (error) {
    console.error("Premium access error:", error);
    return res.status(500).json({ error: error.message });
  }
};