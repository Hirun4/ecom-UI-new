import React, { useCallback, useContext, useState } from "react";
import GoogleSignIn from "../../components/Buttons/GoogleSignIn";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common";
import { loginAPI } from "../../api/authentication";
import { saveToken } from "../../utils/jwt-helper";
import { AuthContext } from "../../context/authContext";

const Login = () => {
  const { login, authState } = useContext(AuthContext);
  const [values, setValues] = useState({
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError("");
      dispatch(setLoading(true));
      loginAPI(values)
        .then((res) => {
          if (res?.token) {
            saveToken(res?.token);
            navigate("/");
            login(res.token, res.user);
          } else {
            setError("Something went wrong!");
          }
        })
        .catch(() => {
          setError("Invalid Credentials!");
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, navigate, values]
  );

  const handleOnChange = useCallback((e) => {
    setValues((values) => ({
      ...values,
      [e.target.name]: e.target?.value,
    }));
  }, []);

  return (
    <div className="px-8 w-full lg:w-[70%] flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-none">
        <p className="text-3xl font-bold pb-4 pt-2 text-center">Sign In</p>
        {/* <GoogleSignIn />
        <div className="flex items-center my-4">
          <div className="flex-grow h-[1px] bg-gray-300"></div>
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-grow h-[1px] bg-gray-300"></div>
        </div> */}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="userName"
              value={values?.userName}
              onChange={handleOnChange}
              placeholder="Email address"
              className="h-[48px] w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={values?.password}
              onChange={handleOnChange}
              placeholder="Password"
              className="h-[48px] w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none"
              required
              autoComplete="new-password"
            />
          </div>
          <div className="text-right mb-4">
            <Link className="underline text-gray-500 hover:text-black text-sm">
              Forgot Password?
            </Link>
          </div>
          <button className="w-full rounded-lg h-[48px] bg-black text-white font-semibold hover:bg-gray-900 transition mb-2">
            Sign In
          </button>
        </form>
        {error && <p className="text-lg text-red-700 text-center">{error}</p>}
        <div className="text-center mt-4">
          <Link
            to={"/v1/register"}
            className="underline text-gray-500 hover:text-black"
          >
            Don’t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
