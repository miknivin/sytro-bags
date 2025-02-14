import { countries } from "@/data/countries";
import { states } from "@/data/states";

export default function AddAddress({activeEdit}) {
    
    return (
        <>
        <form
          className="show-form-address wd-form-address"
          id="formnewAddress"
          onSubmit={(e) => e.preventDefault()}
          style={activeEdit ? { display: "block" } : { display: "none" }}
        >
          <div className="title">Add a new address</div>
          <div className="box-field grid-2-lg">
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="text"
                id="firstname"
                name="first name"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="firstname"
              >
                First name
              </label>
            </div>
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="text"
                id="lastname"
                name="last name"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="lastname"
              >
                Last name
              </label>
            </div>
          </div>
          <div className="box-field">
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="text"
                id="company"
                name="company"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="company"
              >
                Company
              </label>
            </div>
          </div>
          <div className="box-field">
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="text"
                id="address"
                name="address"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="address"
              >
                Address
              </label>
            </div>
          </div>
          <div className="box-field">
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="text"
                id="city"
                name="city"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="city"
              >
                City
              </label>
            </div>
          </div>
          <div className="box-field">
            <label
              htmlFor="country"
              className="mb_10 fw-4 text-start d-block text_black-2 "
            >
              Country/Region
            </label>
            <div className="select-custom">
              <select
                className="tf-select w-100"
                id="country"
                name="address[country]"
                data-default=""
              >
                <option value="---" data-provinces="[]">
                  ---
                </option>
                
                <option value="Vietnam" data-provinces="[]">
                  Vietnam
                </option>
              </select>
            </div>
          </div>
          <div className="box-field">
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="text"
                id="AddressZipNew"
                name="AddressZipNew"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="AddressZipNew"
              >
                Postal/ZIP code
              </label>
            </div>
          </div>
          <div className="box-field">
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="text"
                id="phone"
                name="phone"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="phone"
              >
                Phone
              </label>
            </div>
          </div>
          <div className="box-field text-start">
            <div className="box-checkbox fieldset-radio d-flex align-items-center gap-8">
              <input
                type="checkbox"
                id="check-new-address"
                className="tf-check"
              />
              <label htmlFor="check-new-address" className="text_black-2 fw-4">
                Set as default address.
              </label>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center gap-20">
            <button type="button" className="tf-btn btn-fill animate-hover-btn">
              Add address
            </button>
            <span
              className="tf-btn btn-fill animate-hover-btn btn-hide-address"
              onClick={() => setactiveEdit(false)}
            >
              Cancel
            </span>
          </div>
        </form>
        </>
    );
}