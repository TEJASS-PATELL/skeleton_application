import { axiosInstance } from "../lib/axios";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";

export const createCheckoutSession = async () => {
  try {
    const { data } = await axiosInstance.post("/payment/create-checkout-session", {}, { withCredentials: true });

    if (data.checkoutUrl) {
      toast.success("Redirecting to Stripe checkout...");
      window.location.href = data.checkoutUrl; 
    } else {
      toast.error("Failed to generate checkout URL.");
      console.error("Backend response missing checkoutUrl:", data);
    }
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    toast.error(error.response?.data?.message || "Failed to initiate payment.");
  }
};

export const verifyPayment = async (sessionId) => {
  if (!sessionId) {
    toast.error("Missing session ID for verification.");
    return;
  }

  try {
    const { data } = await axiosInstance.get(
      `/payment/verify-session?session_id=${sessionId}`,
      { withCredentials: true }
    );

    if (data.success) {
      toast.success("Payment verified! Premium access granted.");
    } else {
      toast.error("Payment verification failed: " + data.message);
    }

    return data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    toast.error(error.response?.data?.message || "Payment verification failed.");
    throw error;
  }
};

export const PremiumAccess = async () => {
  try {
    const { data } = await axiosInstance.post("/payment/premium-access", {}, { withCredentials: true });
    return data;
  } catch (error) {
    console.error("Error granting premium access:", error);
    toast.error("Failed to grant premium access. Please contact support.");
  }
};