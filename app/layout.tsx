import Footer from "./components/Footer";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-L49DSL9T79"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-L49DSL9T79');
</script>
          <link rel="icon" type="image/webp" href="/favicon.webp"/>
          <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
        <title>Global Academy Embryology</title>
      </head>
      <body className="bg-white   text-[#1B3A5B]">
        <Navbar />
        <main className=" ">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
