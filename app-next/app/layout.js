import "./globals.css";
import Header from "../components/Header/Header";

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
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
