import Header from "@/components/Header/Header";
import "./globals.css";
import Footer from "@/components/Footer/Footer";

export const metadata = {
  title: "Better Travel"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header/>
        {children}
        <Footer />
      </body>
    </html>
  );
}
