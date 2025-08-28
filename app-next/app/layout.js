import "./globals.css";

export const metadata = {
  title: "CareConnect",
  description: "CareConnect App",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
