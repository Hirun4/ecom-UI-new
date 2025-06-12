import React, { useCallback, useEffect } from "react";
import { logOut } from "../../utils/jwt-helper";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { fetchUserDetails } from "../../api/userInfo";
import {
  loadUserInfo,
  selectIsUserAdmin,
  selectUserInfo,
} from "../../store/features/user";
import Navigation from "../../components/Navigation/Navigation";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const isUserAdmin = useSelector(selectIsUserAdmin);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchUserDetails()
      .then((res) => {
        dispatch(loadUserInfo(res));
      })
      .catch((err) => {})
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, []);

  return (
    <>
      <div className="absolute w-full bg-[#CAF0F8] py-3 px-9">
        <Navigation />
      </div>
      <div className="p-8 overflow-hidden pt-20 min-h-screen h-screen bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc]">
        {isUserAdmin && (
          <div className="text-right mb-4">
            <Link
              to={"/admin"}
              className="text-lg text-blue-900 underline hover:text-blue-700 transition"
            >
              Manage Admin
            </Link>
          </div>
        )}
        {userInfo?.email && (
          <>
            {/* <div className="mb-6">
              <p className="text-2xl font-bold text-gray-900">
                Hello {userInfo?.firstName}
              </p>
              <p className="text-gray-600">Welcome to your account</p>
            </div> */}
            <div className="md:flex gap-8 h-screen">
              <ul className="flex md:flex-col h-[650px] flex-row gap-2 md:gap-4 bg-white rounded-2xl shadow p-4 md:w-64 w-full mb-6 md:mb-0">
                <li>
                  <NavLink
                    to={"/account-details/profile"}
                    className={({ isActive }) =>
                      [
                        isActive
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-black hover:text-white",
                        "inline-flex items-center px-5 py-3 rounded-xl font-semibold transition w-full",
                      ].join(" ")
                    }
                  >
                    <svg className="w-5 h-5 mr-2" /* ... */ />
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/account-details/orders"}
                    className={({ isActive }) =>
                      [
                        isActive
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-black hover:text-white",
                        "inline-flex items-center px-5 py-3 rounded-xl font-semibold transition w-full",
                      ].join(" ")
                    }
                  >
                    <svg className="w-5 h-5 mr-2" /* ... */ />
                    Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/account-details/settings"}
                    className={({ isActive }) =>
                      [
                        isActive
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-black hover:text-white",
                        "inline-flex items-center px-5 py-3 rounded-xl font-semibold transition w-full",
                      ].join(" ")
                    }
                  >
                    <svg className="w-5 h-5 mr-2" /* ... */ />
                    Settings
                  </NavLink>
                </li>
              </ul>
              <div className="flex-1 bg-white max-h-[650px] overflow-y-auto  rounded-2xl shadow p-8">
                <Outlet />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Account;
