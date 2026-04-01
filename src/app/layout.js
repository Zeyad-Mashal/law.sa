import "./globals.css";
export const metadata = {
  title: "Law.sa",
  description: "Law.sa is a platform for legal services",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
