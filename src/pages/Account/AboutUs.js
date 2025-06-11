import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Our Shoe Shop in Karapitiya!</h2>
          <p className="text-lg text-gray-600 mb-6">
            We are located in the heart of Karapitiya, offering a wide range of quality shoes for all occasions. From casual wear to formal and athletic shoes, we have it all. Explore and shop with us online!
          </p>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h3>
            <ul className="space-y-4 text-left text-gray-700">
              <li>
                <strong>Convenient Online Shopping:</strong> Easily browse our collections and place orders directly from your home.
              </li>
              <li>
                <strong>Secure Online Payments:</strong> Pay securely online using various payment methods, including credit cards and digital wallets.
              </li>
              <li>
                <strong>Fast Delivery:</strong> Get your shoes delivered quickly to your doorstep, with hassle-free service.
              </li>
              <li>
                <strong>Excellent Customer Service:</strong> Our dedicated team is here to assist you with any inquiries, ensuring a smooth and enjoyable shopping experience.
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Location</h3>
          <p className="text-lg text-gray-600 mb-6">
            Visit us in Karapitiya for a personalized shopping experience or enjoy the convenience of shopping from home. Either way, we are committed to providing you with the best products and service !
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
