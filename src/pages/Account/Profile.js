import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeAddress,
  selectUserInfo,
  updateUserInfo,
} from "../../store/features/user";
import AddAddress from "./AddAddress";
import { setLoading } from "../../store/features/common";
import { deleteAddressAPI, updateUserDetailsAPI } from "../../api/userInfo";

const Profile = ({ onCancel }) => {
  const userInfo = useSelector(selectUserInfo);
  const [addAddress, setAddAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    phoneNumber2: "",
    email: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setFormValues({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneNumber: userInfo.phoneNumber,
        phoneNumber2: userInfo.phoneNumber2,
        email: userInfo.email,
      });
    }
  }, [userInfo]);

  const onDeleteAddress = useCallback(
    (id) => {
      dispatch(setLoading(true));
      deleteAddressAPI(id)
        .then(() => {
          dispatch(removeAddress(id));
        })
        .catch((err) => {
          console.error("Error deleting address:", err);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch]
  );

  const onEditAddress = (address) => {
    setEditAddress(address);
    setAddAddress(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleProfileSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(setLoading(true));
      updateUserDetailsAPI(formValues, userInfo.id)
        .then((updatedUser) => {
          dispatch(updateUserInfo(updatedUser));
          setEditProfile(false);
          onCancel && onCancel();
          window.location.reload(); // Force reload to refresh profile page
        })
        .catch((err) => {
          console.error("Error updating profile:", err);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, formValues, onCancel, userInfo.id]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 ">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
        {!addAddress && !editProfile && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Contact Details
              </h2>
              <button
                className="ml-2 px-3 py-1 text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition"
                onClick={() => setEditProfile(true)}
              >
                Edit Profile
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-500 font-medium mb-1">Full Name</p>
                <p className="text-lg font-semibold text-gray-900 mb-4">
                  {userInfo?.firstName} {userInfo?.lastName}
                </p>
                <p className="text-gray-500 font-medium mb-1">Phone Number</p>
                <p className="text-lg text-gray-800 mb-4">
                  {userInfo?.phoneNumber ?? "None"}
                </p>
                <p className="text-gray-500 font-medium mb-1">
                  Phone Number- 2
                </p>
                <p className="text-lg text-gray-800 mb-4">
                  {userInfo?.phoneNumber2 ?? "None"}
                </p>

                <p className="text-gray-500 font-medium mb-1">Email</p>
                <p className="text-lg text-gray-800">{userInfo?.email}</p>
              </div>
              {/* You can add a profile picture or summary card here */}
            </div>
            {/* Addresses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Addresses
                </h3>
                {userInfo?.addressList?.length === 0 && (
                  <button
                    className="px-3 py-1 text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition"
                    onClick={() => setAddAddress(true)}
                  >
                    Add New
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userInfo?.addressList?.length === 0 && (
                  <div className="text-gray-500 italic">
                    No addresses saved.
                  </div>
                )}
                {userInfo?.addressList?.map((address, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">
                        {address?.name}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditAddress(address)}
                          className="text-blue-700 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteAddress(address?.id)}
                          className="text-red-700 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-gray-700">{address?.phoneNumber}</div>
                    <div className="text-gray-700">
                      {address?.street}, {address?.city}, {address?.state}
                    </div>
                    <div className="text-gray-500">{address?.zipCode}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Form */}
        {editProfile && (
          <form onSubmit={handleProfileSubmit} className="max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Edit Profile
            </h2>
            <div className="mb-4">
              <label className="block text-gray-500 font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formValues.firstName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-500 font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formValues.lastName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-500 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-500 font-medium mb-1">
                Phone Number-2
              </label>
              <input
                type="text"
                name="phoneNumber2"
                value={formValues.phoneNumber2}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-500 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition"
                onClick={() => setEditProfile(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Add/Edit Address Form */}
        {addAddress && (
          <AddAddress
            addressToEdit={editAddress}
            onCancel={() => {
              setAddAddress(false);
              setEditAddress(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
