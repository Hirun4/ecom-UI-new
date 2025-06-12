import React, { useContext } from "react";
import { Wishlist } from "../common/Wishlist";
import { AccountIcon } from "../common/AccountIcon";
import { CartIcon } from "../common/CartIcon";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector } from "react-redux";
import { countCartItems } from "../../store/features/cart";
import { Button } from "react-admin";
import { AuthContext } from "../../context/authContext";
import { IoCart, IoPersonCircleSharp } from "react-icons/io5";

const Navigation = ({ variant = "default" }) => {
  const { authState, logout } = useContext(AuthContext);
  const cartLength = useSelector(countCartItems);
  const navigate = useNavigate();
  const location = useLocation();
  var currentpath = location.pathname;

  const Logout = () => {
    logout();
  };

  return (
    <nav className="flex bg-transparent items-center  justify-between gap-20 ">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <a className="text-3xl text-black font-bold gap-8" href="/">
          ShopEase
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-10">
        {/* Nav items */}
        <ul className="flex gap-14 text-gray-600 ">
          <li>
            {currentpath == "/" ? (
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${isActive ? "active-link" : ""} hover:text-black`
                }
              >
                Home
              </NavLink>
            ) : (
              <div></div>
            )}
          </li>
          <li>
            {currentpath == "/" ? (
              <NavLink
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({
                    top: document.body.scrollHeight * 0.56,
                    behavior: "smooth",
                  });
                }}
                className=" hover:text-black"
              >
                Categories
              </NavLink>
            ) : (
              <div></div>
            )}
          </li>
          <li>
            {currentpath == "/" ? (
              <NavLink
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({
                    top: document.body.scrollHeight * 1,
                    behavior: "smooth",
                  });
                }}
                className=" hover:text-black"
              >
                About Us
              </NavLink>
            ) : (
              <div></div>
            )}
          </li>
          <li>
            {currentpath == "/" ? (
              <NavLink
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({
                    top: document.body.scrollHeight * 1,
                    behavior: "smooth",
                  });
                }}
                className=" hover:text-black"
              >
                Contact Us
              </NavLink>
            ) : (
              <div></div>
            )}
          </li>
        </ul>
      </div>

      <div>
        {authState.user ? (
          <div className="flex items-center gap-5">
            <NavLink to="/cart-items">
              <IoCart size={40} />
            </NavLink>

            <NavLink to="/account-details/profile">
              <IoPersonCircleSharp size={40} />
            </NavLink>
            {currentpath == "/" ? (
              <NavLink
                onClick={Logout}
                className="py-2 px-4 cursor-pointer rounded-full text-white border-2 border-white hover:bg-white hover:text-black transition duration-300"
              >
                Logout
              </NavLink>
            ) : (
              <div></div>
            )}
          </div>
        ) : (
          <NavLink
            to="/v1/login"
            className="py-2 px-4 cursor-pointer rounded-full text-white border-2 border-white hover:bg-white hover:text-black transition duration-300"
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
