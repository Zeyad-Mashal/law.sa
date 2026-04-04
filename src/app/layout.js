import "./globals.css";
import { Cairo } from "next/font/google";
import ConditionalNavbar from "./Components/Navbar/ConditionalNavbar";
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata = {
  title: "Law.sa",
  description: "Law.sa is a platform for legal services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}
