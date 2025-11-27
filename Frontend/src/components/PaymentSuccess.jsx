import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../stores/usePayment";
import Loading from "../layout/Loading";

export default function PaymentProcessing() { 
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (!sessionId) {
            console.error("Session ID missing in URL.");
            navigate("/error", { state: { message: "Payment ID missing. Please check the URL." } });
            return;
        }

        const handleVerification = async () => {
            try {
                const result = await verifyPayment(sessionId);
                if (result.success) {
                    navigate("/premium-feature");
                } else {
                    navigate("/error", {
                        state: {
                            message: result.message || "Payment verification failed."
                        }
                    });
                }
            } catch (error) {
                console.error("Error verifying payment (Network/Server Error):", error);
                navigate("/error", {
                    state: {
                        message: "A server error occurred during verification. Please contact support."
                    }
                });
            }
        };
        
        handleVerification();
    }, [sessionId, navigate]);

    return (
        <Loading />
    );
}