import React from "react";
import Navigation from "../components/Navigation/Navigation";
import { Outlet } from "react-router-dom";
import BckgImage from "../assets/img/bg-1.png";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner/Spinner";

const AuthenticationWrapper = () => {
  const isLoading = useSelector((state) => state?.commonState?.loading);
  return (
    <div>
      <div className="flex w-full h-screen overflow-y-hidden">
        <div className="w-1/2  bg-slate-700  hidden md:inline">
          <img
            src={BckgImage}
            className="bg-cover w-full bg-center"
            alt="shoppingimage"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-slate-100">
          <Outlet />
        </div>
        {isLoading && <Spinner />}
      </div>
    </div>
  );
};

export default AuthenticationWrapper;
