import React, { useEffect, useState } from "react";
import SectionHeading from "./SectionsHeading/SectionHeading";
import Card from "../Card/Card";
import Jeans from "../../assets/img/jeans.jpg";
import Shirts from "../../assets/img/shirts.jpg";
import Tshirt from "../../assets/img/tshirts.jpeg";
import dresses from "../../assets/img/dresses.jpg";
import Carousel from "react-multi-carousel";
import { responsive } from "../../utils/Section.constants";
import "./NewArrivals.css";

const TodayDeals = () => {
  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/order1/products")
      .then((res) => res.json())
      .then((data) => {
        const slicedData = data.slice(0, 8); // Get first 2 products
        setProducts(slicedData);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <SectionHeading title={"Hot Sellers"} />
      <div className="w-full grid grid-cols-6 gap-4 justify-items-center p-5">
        {products.map((product) => (
          <Card
            key={product.product_id}
            id={product.product_id}
            imagePath={product.imagePath}
            title={product.name}
            category={product.category}
            Price={product.price}
            inStock={product.stock_status}
          />
        ))}
      </div>
    </>
  );
};

export default TodayDeals;
