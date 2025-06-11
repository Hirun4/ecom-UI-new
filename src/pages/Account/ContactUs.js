import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600 mb-6">
            We would love to hear from you! Feel free to reach out to us through the contact details below.
          </p>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h3>
            <ul className="space-y-4 text-left text-gray-700">
              <li>
                <strong>Phone:</strong> 
                <a href="tel:+94765576129" className="text-blue-600 hover:text-blue-800">
                  +94 765576129
                </a>
              </li>
              <li>
                <strong>Email:</strong> 
                <a href="mailto:abhishek@gmail.com" className="text-blue-600 hover:text-blue-800">
                  abhishek@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
