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

const Profile = ({onCancel}) => {
  const userInfo = useSelector(selectUserInfo);
  const [addAddress, setAddAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(null); // Track address being edited
  const [editProfile, setEditProfile] = useState(false); // Track profile edit mode
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setFormValues({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneNumber: userInfo.phoneNumber,
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
  console.log("id:",userInfo.id);
  

  const onEditAddress = (address) => {
    setEditAddress(address); // Set the address to be edited
    setAddAddress(true); // Open the AddAddress form
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
      // e.preventDefault();
      dispatch(setLoading(true));
      updateUserDetailsAPI(formValues, userInfo.id)
        .then((updatedUser) => {
          dispatch(updateUserInfo(updatedUser));
          setEditProfile(false);
          onCancel && onCancel(); // Close the form after saving
        })
        .catch((err) => {
          console.error("Error updating profile:", err);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, formValues,onCancel, userInfo.id]
  );

  return (
    <div>
      <h1 className="text-2xl">My Info</h1>
      {!addAddress && !editProfile && (
        <div>
          <div className="flex gap-2">
            <h2 className="text-xl pt-4">Contact Details</h2>
            <button
              className="underline text-blue-900 mt-4"
              onClick={() => setEditProfile(true)}
            >
              Edit Profile
            </button>
          </div>
          <div className="pt-4">
            <p className="text-gray-700 py-2 font-bold">Full Name</p>
            <p>
              {userInfo?.firstName} {userInfo?.lastName}
            </p>
            <p className="text-gray-700 py-2 font-bold">Phone Number</p>
            <p>{userInfo?.phoneNumber ?? "None"}</p>
            <p className="text-gray-700 py-2 font-bold">Email</p>
            <p>{userInfo?.email}</p>
          </div>
          {/* Addresses */}
          <div className="pt-4">
            <div className="flex gap-12">
              <h3 className="text-lg font-bold">Address</h3>
              <button
                className="underline text-blue-900"
                onClick={() => setAddAddress(true)}
              >
                Add New
              </button>
            </div>

            <div className="pt-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-8 pb-10 mb-8">
              {userInfo?.addressList?.map((address, index) => {
                return (
                  <div
                    key={index}
                    className="bg-gray-200 border rounded-lg p-4"
                  >
                    <p className="py-2 font-bold">{address?.name}</p>
                    <p className="pb-2">{address?.phoneNumber}</p>
                    <p className="pb-2">
                      {address?.street}, {address?.city}, {address?.state}
                    </p>
                    <p>{address?.zipCode}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditAddress(address)}
                        className="underline text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteAddress(address?.id)}
                        className="underline text-blue-900"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {editProfile && (
        <form onSubmit={handleProfileSubmit}>
          <div className="pt-4">
            <label className="text-gray-700 py-2 font-bold">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formValues.firstName}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="pt-4">
            <label className="text-gray-700 py-2 font-bold">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formValues.lastName}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="pt-4">
            <label className="text-gray-700 py-2 font-bold">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formValues.phoneNumber}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="pt-4">
            <label className="text-gray-700 py-2 font-bold">Email</label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-900 text-white p-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white p-2 rounded ml-2"
              onClick={() => setEditProfile(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
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
  );
};

export default Profile;
