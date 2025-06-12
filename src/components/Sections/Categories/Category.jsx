import React, { useEffect, useState } from "react";
import Card from "../../Card/Card";
import SectionHeading from "../SectionsHeading/SectionHeading";

const Category = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [GentsProducts, setGentsProducts] = useState([]);
  const [LadiesProducts, setLadiesProducts] = useState([]);
  const [KidsProducts, setKidsProducts] = useState([]);
  const [OtherProducts, setOtherProducts] = useState([]);
  const [AllProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error(err));
  }, []);
  console.log(products);
  

  useEffect(() => {
    const gents = products.filter((product) => product.category === "Gents");
    const ladies = products.filter((product) => product.category === "Ladies");
    const kids = products.filter((product) => product.category === "Kids");
    const others = products.filter(
      (product) =>
        product.category !== "Gents" &&
        product.category !== "Ladies" &&
        product.category !== "Kids"
    );
    const all = products.filter(
      (product) =>
        product.category == "Gents" ||
        product.category == "Ladies" ||
        product.category == "Kids"
    );

    setGentsProducts(gents);
    setLadiesProducts(ladies);
    setKidsProducts(kids);
    setOtherProducts(others);
    setAllProducts(all);
  }, [products]);

  // console.log(products);

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="flex w-full px-10  items-start mb-6">
        <h1 className="text-3xl font-bold text-black">Explore Collection</h1>
      </div>
      {/* Category Buttons */}
      <div className="w-full flex justify-center items-center gap-10 mb-6">
        {["All", "Gents", "Ladeis", "Kids"].map((tab) => (
          <p
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer font-semibold ${
              activeTab === tab
                ? "text-black font-semibold border-b-4 border-[#00B4D8]"
                : "text-gray-600"
            }`}
          >
            {tab}
          </p>
        ))}
      </div>
      <div className="flex w-full justify-start">
        <SectionHeading title={activeTab + " Products"} />
      </div>
      {/* Tab Content */}
      {activeTab === "All" && (
        <div
          id="All"
          className="w-full grid grid-cols-6 gap-4 justify-items-center p-5"
        >
          {AllProducts.map((product) => (
            <Card
              key={product.product_id}
              id={product.product_id}
              imagePath={product.image_url}
              title={product.name}
              category={product.category}
              Price={product.price}
              inStock={product.stock_status}
            />
          ))}
          
        </div>
      )}
      
      {activeTab === "Gents" && (
        <div
          id="Gents"
          className="w-full grid grid-cols-6 gap-4 justify-items-center p-5"
        >
          {GentsProducts.length > 0 ? (
            GentsProducts.map((product) => (
              <Card
                key={product.product_id}
                id={product.product_id}
                imagePath={product.image_url}
                title={product.name}
                category={product.category}
                Price={product.price}
                inStock={product.stock_status}
              />
            ))
          ) : (
            <div className="col-span-6">
              <p className="w-full text-center text-gray-500 text-lg mt-4 py-4 ">
                No Gents products available.
              </p>
            </div>
          )}
        </div>
      )}
      {activeTab === "Ladeis" && (
        <div
          id="Ladeis"
          className="w-full grid grid-cols-6 gap-4 justify-items-center p-5"
        >
          {LadiesProducts.length > 0 ? (
            LadiesProducts.map((product) => (
              <Card
                key={product.product_id}
                id={product.product_id}
                imagePath={product.image_url}
                title={product.name}
                category={product.category}
                Price={product.price}
                inStock={product.stock_status}
              />
            ))
          ) : (
            <div className="col-span-6">
              <p className="w-full text-center text-gray-500 text-lg mt-4 py-4 ">
                No Ladies products available.
              </p>
            </div>
          )}
        </div>
      )}
      {activeTab === "Kids" && (
        <div
          id="Kids"
          className="w-full grid grid-cols-6 gap-4 justify-items-center p-5"
        >
          {KidsProducts.length > 0 ? (
            KidsProducts.map((product) => (
              <Card
                key={product.product_id}
                id={product.product_id}
                imagePath={product.image_url}
                title={product.name}
                category={product.category}
                Price={product.price}
                inStock={product.stock_status}
              />
            ))
          ) : (
            <div className="col-span-6">
              <p className="w-full text-center text-gray-500 text-lg mt-4 py-4 ">
                No Kids products available.
              </p>
            </div>
          )}
        </div>
      )}
      <div className="flex w-full justify-start">
        <SectionHeading title={"Other Collection"} />
      </div>
      <div
        id="Ladeis"
        className="w-full grid grid-cols-6 gap-4 justify-items-center p-5"
      >
        {OtherProducts.length > 0 ? (
          OtherProducts.map((product) => (
            <Card
              key={product.product_id}
              id={product.product_id}
              imagePath={product.image_url}
              title={product.name}
              category={product.category}
              Price={product.price}
              inStock={product.stock_status}
            />
          ))
        ) : (
          <div className="col-span-6">
            <p className="w-full text-center text-gray-500 text-lg mt-4 py-4 ">
              No Other products available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
