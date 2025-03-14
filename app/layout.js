import Script from "next/script";
import ReduxProvider from "@/components/providers/ReduxProvider";
import ClientWrapper from "@/components/for-layout/ClientWrapper";
import "@/styles/main.scss";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";
import PixelTracker from "@/components/common/PixelTracker";

export const metadata = {
  title: "Sytro",
  description: "Sytro bags",
  icons: {
    icon: "/favicon.ico?v=2",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '9518901524895878');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=9518901524895878&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className="preload-wrapper">
        <div className="preload preload-container" id="preloader">
          <div className="preload-logo">
            <div className="spinner"></div>
          </div>
        </div>
        <ReduxProvider>
          <ClientWrapper>
            <PixelTracker />
            {children}
          </ClientWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
