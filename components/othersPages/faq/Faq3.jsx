import Accordion from "@/components/common/Accordion";
import { faqs3 } from "@/data/faqs";
import React from "react";

export default function Faq3() {
  return (
    <>
      <h5 className="mb_24" id="order-returns">
       Payment Information
      </h5>
      <div className="flat-accordion style-default has-btns-arrow">
        <Accordion faqs={faqs3}/>
      </div>
    </>
  );
}
