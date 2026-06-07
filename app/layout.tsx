import Footer from "./components/Footer";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/webp" href="/favicon.webp" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <title>Global Academy Embryology</title>
      </head>

      <body className="bg-white text-[#1B3A5B]">
        <Navbar />
        <main>{children}</main>
        <Footer />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L49DSL9T79"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L49DSL9T79');
          `}
        </Script>
      </body>
    </html>
  );
}
