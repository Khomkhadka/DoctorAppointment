import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
  import emailjs from 'emailjs-com';
import { assets } from '../assets/assets';
const Contact = () => {


const sendEmail = (e) => {
  e.preventDefault();

  emailjs.sendForm('service_id', 'template_id', e.target, 'user_api_key')
    .then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
};

  return (
     <div className="min-h-screen bg-blue-50 py-10 px-6 flex flex-col items-center gap-50">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8 md:p-12">

        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4 text-center">
          Contact DocTime Support
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Have questions or need help with booking appointments? Our support team is available to assist you.
          Reach out via phone, email, or visit us at our office location.
        </p>

        {/* Team Members */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {[
            { name: "Khemraj Thapa", role: "CEO & Founder", image: assets.khem },
            { name: "Khom Khadka", role: "Chief Technology Officer",image:assets.khom },
            { name: "Lochan Paudel", role: "Operations Head" ,image: assets.lochan},
          ].map((member, idx) => (
            <div key={idx} className="bg-blue-50 rounded-xl shadow p-6 flex flex-col items-center w-64 ">
              {/* This div is for image */}
              
              
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500">
                {/* Image Placeholder */}
              <img src={member.image} className='w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500' alt="" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
              <p className="text-sm text-blue-600">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Location and Map */}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600">Office Location</h2>
            <p className="text-gray-700">
              DocTime Pvt. Ltd.<br />
              Bhairahawa, Rupandehi, Nepal
            </p>
            <p className="text-gray-700">
              Phone: +977-980000000<br />
              Email: support@doctime.com
            </p>
          </div>

          <div className="overflow-hidden rounded-xl shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d226484.25278052074!2d83.20057402499998!3d27.506083299999993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39969a339eb1bae7%3A0xf0366eebfe16f3b7!2sBhairahawa%20Bahumukhi%20Campus!5e0!3m2!1sen!2snp!4v1752588628680!5m2!1sen!2snp"
              width="100%"
              height="350"
              allowFullScreen
              loading="lazy"
              title="DocTime Office Location"
              className="w-full h-full border-0"
            ></iframe>
            
          </div>
        </div>

       

      </div>
    </div>
  );
};

export default Contact;
