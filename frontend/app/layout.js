import "./globals.css";

export const metadata = {
  title: "HackYourFuture",
  description: "Your App Description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
