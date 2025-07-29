import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const dataQuery = search.get("data");
  const { backendUrl, token } = useContext(AppContext);

  useEffect(() => {
    if (!dataQuery) return;

    const handlePaymentSuccess = async () => {
      try {
        // Decode the base64-encoded eSewa response
        const resData = atob(dataQuery);
        const resObject = JSON.parse(resData);

        console.log("Payment Response:", resObject);

        // If payment is not complete, don't proceed
        if (resObject.status?.toUpperCase() !== "COMPLETE") {
          console.log("Payment status is not COMPLETE:", resObject.status);
          return;
        }

        const transactionId = resObject.transaction_uuid;
        if (!transactionId) {
          console.error("Transaction UUID missing");
          return;
        }

        // Update the appointment payment status using the transaction UUID
        await axios.post(
          `${backendUrl}/api/user/payment-status-update`,
          { transaction_uuid: transactionId },
          { headers: { token } }
        );

        console.log("Payment status updated successfully");

        // Redirect to myappointment after short delay
        setTimeout(() => navigate("/myappointment"), 3000);
      } catch (error) {
        console.error("Error handling payment success:", error);
      }
    };

    handlePaymentSuccess();
  }, [dataQuery, backendUrl, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
        <p className="text-gray-700">Your appointment payment was successful.</p>
        <p className="mt-2 text-sm text-gray-500">Redirecting to your appointments...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
