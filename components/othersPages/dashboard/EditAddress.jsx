import { countries } from "@/data/countries";
import { states } from "@/data/states";

export default function EditAddress({activeAdd}) {
    
    return (
        <>
              <form
          className="edit-form-address wd-form-address"
          id="formeditAddress"
          onSubmit={(e) => e.preventDefault()}
          style={activeAdd ? { display: "block" } : { display: "none" }}
        >
          <div className="title">Edit address</div>
          <div className="box-field grid-2-lg">
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="text"
                id="firstnameEdit"
                name="first name"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="firstnameEdit"
              >
                First name
              </label>
            </div>
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="text"
                id="lastnameEdit"
                name="last name"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="lastnameEdit"
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
                id="companyEdit"
                name="company"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="companyEdit"
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
                id="addressEdit"
                name="address"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="addressEdit"
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
                id="cityEdit"
                name="city"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="cityEdit"
              >
                City
              </label>
            </div>
          </div>
          <div className="box-field">
            <label
              htmlFor="countryEdit"
              className="mb_10 fw-4 text-start d-block text_black-2"
            >
              Country/Region
            </label>
            <div className="select-custom">
              <select
                className="tf-select w-100"
                id="countryEdit"
                name="address[country]"
                data-default=""
              >
                <option value="---" data-provinces="[]">
                  ---
                </option>
                <option
                  value="Australia"
                  data-provinces="[['Australian Capital Territory','Australian Capital Territory'],['New South Wales','New South Wales'],['Northern Territory','Northern Territory'],['Queensland','Queensland'],['South Australia','South Australia'],['Tasmania','Tasmania'],['Victoria','Victoria'],['Western Australia','Western Australia']]"
                >
                  Australia
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
                id="province"
                name="province"
              />
              <label
                className="tf-field-label fw-4 text_black-2"
                htmlFor="province"
              >
                Province
              </label>
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
                id="check-edit-address"
                className="tf-check"
              />
              <label htmlFor="check-edit-address" className="text_black-2 fw-4">
                Set as default address.
              </label>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center gap-20">
            <button type="button" className="tf-btn btn-fill animate-hover-btn">
              Update address
            </button>
            <span
              className="tf-btn btn-fill animate-hover-btn btn-hide-edit-address"
              onClick={() => setactiveAdd(false)}
            >
              Cancel
            </span>
          </div>
        </form>
        </>
    );
}