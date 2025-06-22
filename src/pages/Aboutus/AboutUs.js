import React from "react";
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigation/Navigation";

const AboutUs = () => {
  const latitude = 6.06306;
  const longitude = 80.23484;

  return (
    <>
    <div className="bg-[#CAF0F8] py-3 px-9">
        <Navigation />
      </div>
    <div className="bg-[#F9FAFB] min-h-screen py-16 px-6 sm:px-10 text-gray-800">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-[#03045E] mb-6">About Us</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
          Welcome to <strong>CLEONE</strong> – your go-to destination for stylish and high-quality
          shoes. At CLEONE, we believe footwear is more than fashion – it’s a
          statement. With a wide range of modern, durable, and comfortable
          footwear, we are committed to delivering both elegance and performance
          in every step. Whether you’re walking the streets, hitting the gym, or
          attending a special occasion, CLEONE has the perfect pair for you.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-[#03045E] mb-4">Our Journey</h2>
          <p className="text-gray-700 leading-7">
            Our journey began in <strong>September 2023</strong> right from our home in <strong>Galle</strong>. What started as <em>"Cleona"</em> – a venture of reselling and carefully reinvesting every commission – soon grew into building our own stock.
            <br /><br />
            With incredible support from my father and brother, we expanded our vision, and along the way, our name evolved to <strong>Cleone</strong>. We transitioned from a home-based business to opening our own shop, and we’re thrilled to be known as Cleone today.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-[#03045E] mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-7">
            Our unwavering vision is to deliver the <strong>best quality products</strong> at the <strong>most affordable prices</strong> directly to your hands. 
            <br /><br />
            We’re committed to building a brand that not only provides fashion but also builds trust and community.
          </p>
        </div>
      </div>

      <div className="text-center mt-20">
        <h2 className="text-3xl font-semibold text-[#03045E] mb-6">Our Location</h2>
        <div
          style={{
            height: "300px",
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          <iframe
            title="Google Map"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&output=embed`}
          ></iframe>
        </div>

        <button
          onClick={() =>
            window.open(
              `https://maps.app.goo.gl/kKoBtW1cxdkwhJHo7`,
              "_blank"
            )
          }
          className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-full shadow-md font-medium hover:bg-green-700 transition duration-300"
        >
          Open in Google Maps
        </button>
      </div>
      

    </div>
      <div className="bg-[#CAF0F8] ">
        <Footer />
      </div>
   </>
  );
};

export default AboutUs;
