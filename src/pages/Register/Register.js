import React, { useCallback, useState } from 'react'
import GoogleSignIn from '../../components/Buttons/GoogleSignIn';
import { Link } from 'react-router-dom';
import { setLoading } from '../../store/features/common';
import { useDispatch } from 'react-redux';
import { registerAPI } from '../../api/authentication';
import VerifyCode from './VerifyCode';

const Register = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    firstName: "",
    lastName: "",
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const [enableVerify, setEnableVerify] = useState(false);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');
    dispatch(setLoading(true));
    registerAPI(values).then(res => {
      if (res?.code === 200) {
        setEnableVerify(true);
      }
    }).catch(() => {
      setError("Invalid or Email already exist!");
    }).finally(() => {
      dispatch(setLoading(false));
    });
  }, [dispatch, values]);

  const handleOnChange = useCallback((e) => {
    setValues(values => ({
      ...values,
      [e.target.name]: e.target?.value,
    }))
  }, []);

  return (
    <div className='px-8 w-full lg:w-[70%] flex flex-col items-center'>
      {!enableVerify &&
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-none">
          <p className='text-3xl font-bold pb-4 pt-2 text-center'>Sign Up</p>
          {/* <GoogleSignIn />
          <div className="flex items-center my-4">
            <div className="flex-grow h-[1px] bg-gray-300"></div>
            <span className="mx-4 text-gray-400">OR</span>
            <div className="flex-grow h-[1px] bg-gray-300"></div>
          </div> */}
          <form onSubmit={onSubmit} autoComplete='off'>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">First Name</label>
              <input
                type="text"
                name='firstName'
                value={values.firstName}
                onChange={handleOnChange}
                placeholder='First Name'
                className='h-[48px] w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none'
                required
                autoComplete='off'
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Last Name</label>
              <input
                type="text"
                name='lastName'
                value={values.lastName}
                onChange={handleOnChange}
                placeholder='Last Name'
                className='h-[48px] w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none'
                required
                autoComplete='off'
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name='phoneNumber'
                value={values.phoneNumber}
                onChange={handleOnChange}
                placeholder='Phone Number'
                className='h-[48px] w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none'
                required
                autoComplete='off'
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                name='email'
                value={values.email}
                onChange={handleOnChange}
                placeholder='Email address'
                className='h-[48px] w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none'
                required
                autoComplete='off'
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                name='password'
                value={values.password}
                onChange={handleOnChange}
                placeholder='Password'
                className='h-[48px] w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none'
                required
                autoComplete='new-password'
              />
            </div>
            <button className='w-full rounded-lg h-[48px] bg-black text-white font-semibold hover:bg-gray-900 transition mb-2'>
              Sign Up
            </button>
          </form>
          {error && <p className='text-lg text-red-700 text-center'>{error}</p>}
          <div className="text-center mt-4">
            <Link to={"/v1/login"} className='underline text-gray-500 hover:text-black'>
              Already have an account? Log in
            </Link>
          </div>
        </div>
      }
      {enableVerify && <VerifyCode email={values?.email} />}
    </div>
  )
}

export default Register;
