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
import logoImg from "../../upload/logo.jpeg"; // import logo from uploads folder

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
      <div className="flex items-center gap-3">
        {/* Logo image and CLEONE in beautiful font */}
        <a
          className="flex flex-col items-center group"
          href="/"
          style={{ textDecoration: "none" }}
        >
          <img
            src={logoImg}
            alt="CLEONE Logo"
            className="w-16 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:brightness-125 group-hover:drop-shadow-bloom"
            style={{
              transition: "transform 0.3s, filter 0.3s, box-shadow 0.3s",
              filter: "brightness(1)",
            }}
          />
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.4rem",
              letterSpacing: "2px",
              color: "#222",
              marginTop: "0.3rem",
              textAlign: "center",
            }}
          >
            CLEONE
          </span>
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

/* Add this to Navigation.css or your global CSS for the bloom effect */

// .drop-shadow-bloom {
//   filter: drop-shadow(0 0 16px #ffe082) drop-shadow(0 0 32px #fffde7);
// }
