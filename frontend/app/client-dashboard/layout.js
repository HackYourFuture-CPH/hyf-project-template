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
    <div className="grid grid-cols-12 grid-rows-11 min-h-screen">
      <Header />
      <SideNavigation />
      <main className="col-span-9 row-span-7 col-start-4 row-start-4 overflow-auto max-h-[calc(100vh-20rem)]">
        {children}
      </main>
      <footer className="col-span-9 col-start-4 row-start-11 h-[10rem]">
        Copyright By The WFlance
      </footer>
    </div>
  );
}
