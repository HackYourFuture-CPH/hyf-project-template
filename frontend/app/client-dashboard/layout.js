import "@/app/_styles/globals.css";

import SideNavigation from "@/app/_components/client-dashboard-components/SideNavigation";
import Header from "../_components/client-dashboard-components/Header";

export const metadata = {
  title: {
    template: "%s WFlance",
    default: "Welcom/ WFlance",
  },
  description: "Freelance web developer Platform",
};

export default function RootLayout({ children }) {
  return (
    <div className="grid grid-cols-12 grid-rows-12 gap-1 min-h-screen">
      <Header />
      <main className="col-span-12 row-span-10 row-start-3 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
