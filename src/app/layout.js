import "./globals.css";
import ConditionalNavbar from "./Components/Navbar/ConditionalNavbar";

export const metadata = {
  title: "Law.sa",
  description: "Law.sa is a platform for legal services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}
