import "@/app/_styles/globals.css";

import Navbar from "../_components/instructor-dashboard-components/Navbar";

export const metadata = {
  title: "UpSkillPro",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col h-screen ">
      <Navbar />
      <main
        className="min-h-screen 
      bg-gradient-to-r from-white via-[#f7f9fc] to-[#e9f3ff]"
      >
        {children}
      </main>
    </div>
  );
}
