import React, { useCallback, useContext } from "react";
import { logOut } from "../../utils/jwt-helper";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const onLogOut = useCallback(() => {
    logOut();
    logout();
    navigate("/");
  }, [navigate]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <button
        onClick={onLogOut}
        className="w-[180px] h-[48px] bg-black border-2 border-black rounded-xl mt-4 text-white font-semibold hover:bg-gray-900 hover:border-gray-800 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;
