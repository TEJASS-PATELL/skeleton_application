import React, { useEffect } from "react";
import "../style/Services.css";
import { Link, useNavigate } from "react-router-dom";
import { createCheckoutSession, PremiumAccess } from "../stores/usePayment";
import toast from "react-hot-toast";

export default function Services() {
  const navigate = useNavigate();
  const handleBuy = async () => {
    try {
      const result = await PremiumAccess();

      if (result && result.success) {
        toast.success("You already have Premium Access!");
        navigate("/premium-feature");
        return;
      }

      // 2. Agar Premium Access nahi hai, toh Payment initiate karo
      await createCheckoutSession();

    } catch (error) {
      console.error("Error initiating payment/checking access:", error);
      toast.error(error.message || "Failed to initiate payment or check status.");
    }
  };

  return (
    <section id="pricing-section">
      <div className="cards-wrapper">
        <div className="pricing-cards">
          <div className="pricing-card free-card">
            <h3>Free Plan</h3>
            <p>Get access to basic features and start exploring.</p>
            <ul>
              <li>✔ Basic Dashboard</li>
              <li>✔ Email Login</li>
              <li>❌ No Premium Features</li>
            </ul>
            <Link to="/free-feature" className="plan-btn">
              Get Started
            </Link>
          </div>

          <div className="pricing-card paid-card">
            <h3>Pro Plan - ₹50</h3> 
            <p>Unlock all premium tools and exclusive access.</p>
            <ul>
              <li>✔ All Free Features</li>
              <li>✔ Priority Support</li>
              <li>✔ Premium Dashboard</li>
            </ul>
            <button className="plan-btn paid" onClick={handleBuy}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
