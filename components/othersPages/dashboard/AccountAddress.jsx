"use client";

import { useState } from "react";
import AddAddress from "./AddAddress";
import EditAddress from "./EditAddress";
export default function AccountAddress() {
  const [activeEdit, setactiveEdit] = useState(false);
  const [activeAdd, setactiveAdd] = useState(false);

  return (
    <div className="my-account-content account-address">
      <div className="text-center widget-inner-address">
        <button
          className="tf-btn btn-fill animate-hover-btn btn-address mb_20"
          onClick={() => setactiveEdit(true)}
        >
          Add a new address
        </button>
        <AddAddress activeEdit={activeEdit} />
        <h6 className="mb_20">Default</h6>
        <p>themesflat</p>
        <p>1234 Fashion Street, Suite 567</p>
        <p>New York</p>
        <p>info@fashionshop.com</p>
        <p className="mb_10">(212) 555-1234</p>
        <div className="d-flex gap-10 justify-content-center">
          <button
            className="tf-btn btn-fill animate-hover-btn justify-content-center btn-edit-address"
            onClick={() => setactiveAdd(true)}
          >
            <span>Edit</span>
          </button>
          <button className="tf-btn btn-outline animate-hover-btn justify-content-center">
            <span>Delete</span>
          </button>
        </div>
        <EditAddress activeAdd={activeAdd} />
      </div>
    </div>
  );
}
