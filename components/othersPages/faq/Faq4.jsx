import Accordion from "@/components/common/Accordion";
import { faqs4 } from "@/data/faqs";
import React from "react";

export default function Faq4() {
  return (
    <>
      <h5 className="mb_24" id="return-information" style={{paddingTop:'45px'}}>
        Return Information
      </h5>
      <div className="flat-accordion style-default has-btns-arrow mb_60">
        <Accordion faqs={faqs4} />
      </div>
    </>
  );
}
