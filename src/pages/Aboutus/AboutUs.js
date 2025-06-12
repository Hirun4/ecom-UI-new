import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e0f7fa] min-h-screen py-12">
    <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-16 shadow-none">
      <Link
        to="/"
        className="inline-block mb-6 px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition"
      >
        ← Back to Home
      </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">About ShopEase</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          ShopEase is dedicated to making online shopping simple, joyful, and accessible for everyone.
          We believe in quality, transparency, and a customer-first approach.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <img
            src="https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=crop&w=400&q=80"
            alt="Our Team"
            className="w-full md:w-1/3 rounded-xl object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Story</h2>
            <p className="text-gray-600">
              Founded in 2023, ShopEase started as a small team passionate about making shopping better.
              Today, we offer a wide range of products, fast delivery, and friendly support—serving thousands of happy customers.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
          <div className="bg-[#CAF0F8] rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Products</h3>
            <p className="text-gray-600">We carefully curate every item for quality and value.</p>
          </div>
          <div className="bg-[#CAF0F8] rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Get your orders quickly, wherever you are.</p>
          </div>
          <div className="bg-[#CAF0F8] rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Care</h3>
            <p className="text-gray-600">Our support team is here for you 24/7.</p>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact Us</h2>
          <p className="text-gray-600 mb-2">Have questions or feedback? We’d love to hear from you!</p>
          <a
            href="mailto:support@shopease.com"
            className="text-blue-700 underline font-medium"
          >
            support@shopease.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
