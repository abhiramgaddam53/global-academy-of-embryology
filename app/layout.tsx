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
          <link rel="icon" type="image/webp" href="/favicon.webp"/>
          <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
        <title>Global Academy Embryology</title>
      </head>
      <body className="bg-white   text-[#1B3A5B]">
        <Navbar />
        <main className=" ">{children}</main>
      </body>
    </html>
  );
}
