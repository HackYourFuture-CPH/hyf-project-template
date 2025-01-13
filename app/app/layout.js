import "./globals.css";
import Footer from "@/components/footer";



export const metadata = {
  title: "DKTestPrep",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
