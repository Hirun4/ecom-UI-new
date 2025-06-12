import React, { useEffect, useMemo, useState } from "react";
import FilterIcon from "../../components/common/FilterIcon";
import Navigation from "../../components/Navigation/Navigation";
import Card from "../../components/Card/Card";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./PriceFilter.css";

const NewArrivals = () => {
  // Product state
  const [products, setProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error(err));
  }, []);
  const currentDate = new Date();
  const newArrivals = products.filter((product) => {
    if (!product.created_at) return false;
    const createdAt = new Date(product.created_at);
    return (
      createdAt.getFullYear() === currentDate.getFullYear() &&
      createdAt.getMonth() === currentDate.getMonth()
    );
  });
  console.log(newArrivals);
  

  return (
    <div>
      <div className="w-full py-2 px-9">
        <Navigation />
      </div>

      <div className="flex flex-col gap-4 py-5 px-10">
        <p className='text-lg text-black mt-5'>New Arrivals</p>
        <div className="pt-4 grid grid-cols-1 lg:grid-cols-6 md:grid-cols-2 gap-8 px-2">
            {newArrivals.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No products found.
              </div>
            ) : (
              newArrivals.map((product) => (
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
            )}
          </div>
      </div>
    </div>
  );
};

export default NewArrivals;
