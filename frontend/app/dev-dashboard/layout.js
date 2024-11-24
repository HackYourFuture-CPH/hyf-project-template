import "@/app/_styles/globals.css";
import Header from "../_components/DevDashboard/Header";

export const metadata = {
  title: {
    template: "%s WFlance",
    default: "Welcom/ WFlance",
  },
  description: "Freelance web developer Platform",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}
