"use client";
import Link from "next/link";
import React, { useState } from "react";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { products1 } from "@/data/products";
import { ProductCard } from "../shopCards/ProductCard";
import { Navigation } from "swiper/modules";
import {
  allHomepages,
  blogLinks,
  demoItems,
  pages,
  productDetailPages,
  productsPages,
  contact,
} from "@/data/menu";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  useGetProductsQuery,
  useListProductsQuery,
} from "@/redux/api/productsApi";

export default function Nav({ isArrow = true, textColor = "", Linkfs = "" }) {
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const products = useSelector((state) => state.product.items);
  const { data, error, isLoading, isFetching } = useListProductsQuery({
    skip: products.length > 30,
  });
  const finalProducts =
    products.length > 30 ? products : data?.filteredProducts || [];
  const isMenuActive = (menuItem) => {
    let active = false;
    if (menuItem.href?.includes("/")) {
      if (menuItem.href?.split("/")[1] == pathname.split("/")[1]) {
        active = true;
      }
    }
    if (menuItem.length) {
      active = menuItem.some(
        (elm) => elm.href?.split("/")[1] == pathname.split("/")[1]
      );
    }
    if (menuItem.length) {
      menuItem.forEach((item) => {
        item.links?.forEach((elm2) => {
          if (elm2.href?.includes("/")) {
            if (elm2.href?.split("/")[1] == pathname.split("/")[1]) {
              active = true;
            }
          }
          if (elm2.length) {
            elm2.forEach((item2) => {
              item2?.links?.forEach((elm3) => {
                if (elm3.href.split("/")[1] == pathname.split("/")[1]) {
                  active = true;
                }
              });
            });
          }
        });
        if (item.href?.includes("/")) {
          if (item.href?.split("/")[1] == pathname.split("/")[1]) {
            active = true;
          }
        }
      });
    }

    return active;
  };
  return (
    <>
      {" "}
      <li className="menu-item">
        <Link
          href="/"
          className={`item-link ${Linkfs} ${textColor} ${
            isMenuActive(allHomepages) ? "activeMenu" : ""
          } `}
        >
          Home
          {/* {isArrow ? <i className="icon icon-arrow-down" /> : ""} */}
        </Link>
      </li>
      <li className="menu-item position-relative">
        <Link
          href="/about-us"
          className={`item-link ${Linkfs} ${textColor}  ${
            isMenuActive(pages) ? "activeMenu" : ""
          }`}
        >
          About
          {/* <i className="icon icon-arrow-down" /> */}
        </Link>
      </li>
      <li className="menu-item">
        <a
          href="#"
          className={`item-link ${Linkfs} ${textColor}  ${
            isMenuActive(productDetailPages) ? "activeMenu" : ""
          }`}
        >
          Products
          {isArrow ? <i className="icon icon-arrow-down" /> : ""}
        </a>
        <div className="sub-menu mega-menu">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="menu-heading">Best seller</div>
                <div className="hover-sw-nav hover-sw-2">
                  <Swiper
                    dir="ltr"
                    modules={[Navigation]}
                    navigation={{
                      prevEl: ".snmpn1",
                      nextEl: ".snmnn1",
                    }}
                    slidesPerView={4}
                    spaceBetween={30}
                    className="swiper tf-product-header wrap-sw-over row"
                  >
                    {[...finalProducts].map((elm, i) => (
                      <div>
                        <SwiperSlide key={i} className="swiper-slide col-lg-4">
                          <ProductCard product={elm} />
                        </SwiperSlide>
                      </div>
                    ))}
                  </Swiper>
                  <div className="nav-sw nav-next-slider nav-next-product-header box-icon w_46 round snmpn1">
                    <span className="icon icon-arrow-left" />
                  </div>
                  <div className="nav-sw nav-prev-slider nav-prev-product-header box-icon w_46 round snmnn1">
                    <span className="icon icon-arrow-right" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li className="menu-item">
        <Link
          href="/contact-2"
          className={`item-link ${Linkfs} ${textColor}  ${
            isMenuActive(contact) ? "activeMenu" : ""
          }`}
        >
          Contact
        </Link>
      </li>
    </>
  );
}
