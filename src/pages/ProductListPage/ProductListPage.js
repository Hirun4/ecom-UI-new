import React, { useEffect, useMemo, useState } from "react";
import FilterIcon from "../../components/common/FilterIcon";
import Navigation from "../../components/Navigation/Navigation";
import Card from "../../components/Card/Card";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./PriceFilter.css";

const ProductListPage = () => {
  // Product state
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [range, setRange] = useState({ min: 0, max: 0 });
  const [search, setSearch] = useState("");

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Unique categories
  const uniqueCategoryNames = [
    ...new Set(products.map((product) => product.category)),
  ];
  const uniqueCategories = uniqueCategoryNames.map((name, index) => ({
    code: index + 1,
    name,
  }));

  // Price range
  const prices = products.map((product) => product.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  // Set initial price range when products load
  useEffect(() => {
    setRange({
      min: minPrice,
      max: maxPrice,
    });
  }, [minPrice, maxPrice]);

  // Handlers
  const handleCategoryChange = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleInStockChange = () => {
    setInStockOnly((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      // Price filter
      const priceMatch =
        product.price >= range.min && product.price <= range.max;

      // In-stock filter
      const inStockMatch =
        !inStockOnly || product.stock_status === "In Stock";

      // Search filter
      const searchMatch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      return categoryMatch && priceMatch && inStockMatch && searchMatch;
    });
  }, [products, selectedCategories, range, inStockOnly, search]);

  return (
    <div>
      <div className="w-full py-2 px-9">
        <Navigation />
      </div>

      <div className="flex py-5 px-10">
        <div className="w-full flex flex-col gap-4">
          {/* Search */}
          <div className="mx-auto rounded-full w-[30%] flex overflow-hidden">
            <input
              type="text"
              className="px-4 py-2 bg-[#CAF0F8] w-full outline-none"
              placeholder="Search anything ..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          {/* Filters Bar */}
          <div className="w-full flex flex-row items-center gap-8 px-4 border rounded-lg bg-white shadow-sm">
            {/* Filters Title & Icon */}
            <div className="flex items-center gap-2">
              <p className="text-[16px] text-gray-600 font-semibold">Filter</p>
              <FilterIcon />
            </div>

            {/* Product Types (Categories) */}
            <div className="flex items-start">
              <div className="flex">
                {uniqueCategories.map((type) => (
                  <div className="flex items-center p-1" key={type.code}>
                    <label
                      htmlFor={type.code}
                      className="px-2 text-[14px] text-gray-600"
                    >
                      {type.name}
                    </label>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(type.name)}
                      onChange={() => handleCategoryChange(type.name)}
                      className="border rounded-xl w-4 h-4 accent-black text-black"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-8 w-[1px] bg-gray-200 mx-4" />

            {/* Price */}
            <div className="flex flex-col items-start">
              <div className="flex flex-row items-center gap-5 py-2 w-full">
                <p className="text-[16px] text-black whitespace-nowrap">
                  Price :
                </p>

                <div className="border rounded-lg h-8 max-w-[100px] w-[100px] flex items-center ">
                  <span className="pl-2 text-gray-600">$</span>
                  <input
                    type="number"
                    value={range.min}
                    className="outline-none px-2 text-gray-600 bg-transparent w-full"
                    disabled
                    placeholder="min"
                  />
                </div>

                <div className="flex-1 w-[200px] ">
                  {typeof minPrice === "number" && typeof maxPrice === "number" && (
                    <RangeSlider
                      className={"custom-range-slider"}
                      min={minPrice}
                      max={maxPrice}
                      value={[range.min, range.max]}
                      onInput={(values) =>
                        setRange({
                          min: values[0],
                          max: values[1],
                        })
                      }
                    />
                  )}
                </div>

                <div className="border rounded-lg h-8 max-w-[100px] w-[100px] flex items-center">
                  <span className="pl-2 text-gray-600">$</span>
                  <input
                    type="number"
                    value={range.max}
                    className="outline-none px-2 text-gray-600 bg-transparent w-full"
                    disabled
                    placeholder="max"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-8 w-[1px] bg-gray-200 mx-4" />

            {/* In Stock */}
            <div className="flex flex-col items-start">
              <div className="flex items-center p-1">
                <label
                  htmlFor="instock"
                  className="px-2 text-[14px] text-gray-600"
                >
                  InStock
                </label>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={handleInStockChange}
                  className="border rounded-xl w-4 h-4 accent-black text-black"
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-6 md:grid-cols-2 gap-8 px-2">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No products found.
              </div>
            ) : (
              filteredProducts.map((product) => (
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
    </div>
  );
};

export default ProductListPage;
