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

  // Populate form fields if editing an address
  useEffect(() => {
    if (addressToEdit) {
      setValues(addressToEdit); // Pre-fill form with existing address data
    } else {
      // Reset form fields when adding a new address
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

  // Handle form submission
  const onSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      dispatch(setLoading(true));
      setError("");

      // Determine whether to add or update the address
      const apiCall = addressToEdit
        ? updateAddressAPI(addressToEdit.id, values) // Update existing address with correct id
        : addAddressAPI(values); // Add new address

      apiCall
        .then((res) => {
          if (addressToEdit) {
            dispatch(updateAddress(res)); // Dispatch update action
          } else {
            dispatch(saveAddress(res)); // Dispatch add action
          }
          onCancel && onCancel(); // Close the form after saving
        })
        .catch((err) => {
          setError("Failed to save the address.");
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, onCancel, values, addressToEdit]
  );

  // Handle input changes
  const handleOnChange = useCallback((e) => {
    e.persist();
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  }, []);

  return (
    <div>
      <p className="text-xl pt-4">{addressToEdit ? "Edit Address" : "Add Address"}</p>
      <form onSubmit={onSubmit} className="pt-2 mb-2 md:w-[420px] w-full">
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={values?.name}
          onChange={handleOnChange}
          placeholder="Contact person name"
          className="w-full border p-2 my-2 border-gray-400"
          required
        />
        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={values?.phoneNumber}
          onChange={handleOnChange}
          placeholder="Contact number"
          className="w-full border p-2 my-2 border-gray-400"
          required
        />
        <label>Address</label>
        <input
          type="text"
          name="street"
          value={values?.street}
          onChange={handleOnChange}
          placeholder="Address"
          className="w-full border p-2 my-2 border-gray-400"
          required
        />
        <div className="flex gap-4">
          <input
            type="text"
            name="city"
            value={values?.city}
            onChange={handleOnChange}
            placeholder="City"
            className="w-full border p-2 my-2 border-gray-400"
            required
          />
          <input
            type="text"
            name="state"
            value={values?.state}
            onChange={handleOnChange}
            placeholder="State"
            className="w-full border p-2 my-2 border-gray-400"
            required
          />
        </div>
        <input
          type="text"
          name="zipCode"
          value={values?.zipCode}
          onChange={handleOnChange}
          placeholder="Zip code"
          className="w-full border p-2 my-2 border-gray-400"
          required
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={onCancel}
            type="button"
            className="border-2 border-gray-400 rounded-lg w-[120px] h-[42px]"
          >
            Cancel
          </button>
          <button type="submit" className="bg-black rounded-lg w-[120px] h-[42px] text-white">
            Save
          </button>
        </div>
      </form>
      {error && <p className="text-lg text-red-700">{error}</p>}
    </div>
  );
};

export default AddAddress;