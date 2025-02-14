import Accordion from "@/components/common/Accordion";
import { faqs2 } from "@/data/faqs";
import React from "react";

export default function Faq2() {
  return (
    <>
      <h5 className="mb_24" id="order-information">
        Order Information
      </h5>
      <div className="flat-accordion style-default has-btns-arrow mb_60">
        <Accordion faqs={faqs2} />
      </div>
    </>
  );
}
