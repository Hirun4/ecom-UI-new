import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common";
import { addAddressAPI, updateAddressAPI } from "../../api/userInfo";
import { saveAddress, updateAddress } from "../../store/features/user";

const AddAddress = ({ addressToEdit, onCancel }) => {
  const [values, setValues] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (addressToEdit) {
      setValues(addressToEdit);
    } else {
      setValues({
        name: "",
        phoneNumber: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
      });
    }
  }, [addressToEdit]);

  const onSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      dispatch(setLoading(true));
      setError("");
      const apiCall = addressToEdit
        ? updateAddressAPI(addressToEdit.id, values)
        : addAddressAPI(values);

      apiCall
        .then((res) => {
          if (addressToEdit) {
            dispatch(updateAddress(res));
          } else {
            dispatch(saveAddress(res));
          }
          onCancel && onCancel();
        })
        .catch(() => {
          setError("Failed to save the address.");
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, onCancel, values, addressToEdit]
  );

  const handleOnChange = useCallback((e) => {
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {addressToEdit ? "Edit Address" : "Add Address"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={values?.name}
            onChange={handleOnChange}
            placeholder="Contact person name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={values?.phoneNumber}
            onChange={handleOnChange}
            placeholder="Contact number"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Street Address</label>
          <input
            type="text"
            name="street"
            value={values?.street}
            onChange={handleOnChange}
            placeholder="Address"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={values?.city}
              onChange={handleOnChange}
              placeholder="City"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              value={values?.state}
              onChange={handleOnChange}
              placeholder="State"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={values?.zipCode}
            onChange={handleOnChange}
            placeholder="Zip code"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 outline-none"
            required
          />
        </div>
        {error && <p className="text-red-600 font-medium">{error}</p>}
        <div className="flex gap-4 mt-6">
          <button
            onClick={onCancel}
            type="button"
            className="border-2 border-gray-400 text-gray-700 bg-gray-100 rounded-lg w-[120px] h-[42px] font-semibold hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-700 text-white rounded-lg w-[120px] h-[42px] font-semibold hover:bg-blue-800 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddress;
