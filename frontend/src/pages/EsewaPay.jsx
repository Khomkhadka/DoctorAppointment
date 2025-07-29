import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";


const EsewaPay = () => {
  const { state } = useLocation();
  const appointment = state?.appointment;
  const amount = appointment.amount;
  const id = appointment._id;

  const formRef = useRef(null);
  const secret = "8gBm/:&EnhH.1/q"; // Your secret key for HMAC

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Prepare payment data
    const tax_amount = parseFloat((amount * 0.1).toFixed(2));
    const product_service_charge = 0;
    const product_delivery_charge = 0;

    // Calculate total amount
    const total_amount = amount + tax_amount + product_service_charge + product_delivery_charge;

    const product_code = "EPAYTEST";
    const transaction_uuid = id; // safe alphanumeric + hyphen only

    // Prepare string for signature (only these fields included)
    const signed_field_names = "total_amount,transaction_uuid,product_code";

    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    // Generate HMAC SHA256 signature & encode base64
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    setFormData({
      amount,
      tax_amount,
      total_amount,
      product_code,
      product_service_charge,
      product_delivery_charge,
      transaction_uuid,
      success_url: "http://localhost:5173/payment-success",
      failure_url: "https://developer.esewa.com.np/failure",
      signed_field_names,
      signature,
    });
  }, [amount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  if (!formData) return <p>Loading payment data...</p>;

  return (
    <>
    <div className="min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mt-8 border border-blue-200">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
          Doctor Appointment Payment Summary
        </h2>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={appointment.userData.image}
            alt={appointment.userData.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
          />
          <p className="text-blue-700 font-semibold text-lg">
            Patient: {appointment.userData.name}
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={appointment.docData.image}
            alt={appointment.docData.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
          />
          <p className="text-blue-700 font-semibold text-lg">
            Doctor: {appointment.docData.name}
          </p>
        </div>

        <form
          ref={formRef}
          action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
          method="POST"
        >
          <div className="mb-3 flex justify-between border-b border-blue-100 py-1">
            <span className="text-blue-700 font-medium">Doctor Fee:</span>
            <span className="text-gray-800 font-semibold">
              Rs. {formData.amount}
            </span>
          </div>
          <input type="hidden" name="amount" value={formData.amount} readOnly />

          <div className="mb-3 flex justify-between border-b border-blue-100 py-1">
            <span className="text-blue-700 font-medium">Tax Amount:</span>
            <span className="text-gray-800 font-semibold">
              Rs. {formData.tax_amount}
            </span>
          </div>
          <input
            type="hidden"
            name="tax_amount"
            value={formData.tax_amount}
            readOnly
          />

          <div className="mb-3 flex justify-between border-b border-blue-200 py-1">
            <span className="text-blue-900 font-semibold text-lg">
              Total Amount:
            </span>
            <span className="text-blue-900 font-bold text-lg">
              Rs. {formData.total_amount}
            </span>
          </div>
          <input
            type="hidden"
            name="total_amount"
            value={formData.total_amount}
            readOnly
          />

          <div className="mb-3 flex justify-between border-b border-blue-100 py-1">
            <span className="text-blue-700 font-medium">Transaction ID:</span>
            <span className="text-gray-700">{formData.transaction_uuid}</span>
          </div>
          <input
            type="hidden"
            name="transaction_uuid"
            value={formData.transaction_uuid}
            readOnly
          />
          <input
            className="hidden"
            type="text"
            name="product_service_charge"
            value={formData.product_service_charge}
            readOnly
          />
          <input
            className="hidden"
            type="text"
            name="product_delivery_charge"
            value={formData.product_delivery_charge}
            readOnly
          />

          <div className="mb-6 flex justify-between">
            <span className="text-blue-700 font-medium">Product Code:</span>
            <span className="text-gray-700">{formData.product_code}</span>
          </div>
          <input
            type="hidden"
            name="product_code"
            value={formData.product_code}
            readOnly
          />

          <input
            type="hidden"
            name="success_url"
            value={formData.success_url}
            readOnly
          />
          <input
            type="hidden"
            name="failure_url"
            value={formData.failure_url}
            readOnly
          />
          <input
            type="hidden"
            name="signed_field_names"
            value={formData.signed_field_names}
            readOnly
          />
          <input
            type="hidden"
            name="signature"
            value={formData.signature}
            readOnly
          />

          <button
            onClick={handleSubmit}
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition duration-300"
          >
            Pay with eSewa (Test)
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default EsewaPay;