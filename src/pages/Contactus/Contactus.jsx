import React from "react";
import { Link } from "react-router-dom";

const ContactUs = () => {
  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa] min-h-screen py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-16 shadow-none">
        <Link
          to="/"
          className="inline-block mb-6 px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Contact Us</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Whether you have a question, concern, or feedback — we’re here to help.
          Reach out to us anytime and we’ll get back to you as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-2">Email: <a href="mailto:support@shopease.com" className="text-blue-700 underline">support@shopease.com</a></p>
            <p className="text-gray-600 mb-2">Phone: <span className="text-gray-800 font-medium">+1 (800) 123-4567</span></p>
            <p className="text-gray-600">Address: 123 Market Street, E-commerce City, EC 45678</p>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Message</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Type your message here..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="text-center text-gray-600">
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
