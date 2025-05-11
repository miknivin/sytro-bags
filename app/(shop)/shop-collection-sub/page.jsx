import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import ShopDefault from "@/components/shop/ShopDefault";
import React from "react";
import Script from "next/script"; // Import Next.js Script component

// Metadata API for page title and description
export const metadata = {
  title: "Kids Collection",
  description: "Sytro",
};

export default function Page() {
  return (
    <>
      {/* Noscript fallback for Facebook Pixel */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=667198472605986&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      {/* Facebook Pixel Script */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive" // Load after page is interactive
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '667198472605986');
            fbq('track', 'PageView');
          `,
        }}
      />

      <Header4 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">
            Make your child’s school bag truly special with Sytro Bags!
          </div>
          <p className="text-center text-2 text_black-2 mt_5">
            Now, you can upload your child’s photo and watch them transform into
            their favorite superhero, printed right on their bag! Let them carry
            their powers wherever they go.
          </p>
        </div>
      </div>
      <ShopDefault />
      <Footer1 />
    </>
  );
}
