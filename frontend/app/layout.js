import "./globals.css";
export const metadata = {
  title: "SkillUpPro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
