import ReduxProvider from "@/components/providers/ReduxProvider";
import ClientWrapper from "@/components/for-layout/ClientWrapper";

import "@/styles/main.scss";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";
export const metadata = {
  title: "Sytro",
  description: "Your website description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="preload-wrapper">
        <div className="preload preload-container" id="preloader">
          <div className="preload-logo">
            <div className="spinner"></div>
          </div>
        </div>
        <ReduxProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
