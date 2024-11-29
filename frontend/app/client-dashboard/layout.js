import "@/app/_styles/globals.css";

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
    <div className="flex flex-col  ">
      <Header />
      <main
        className=" overflow-hidden min-h-screen relative
      bg-gradient-to-r from-white via-[#f7f9fc] to-[#e9f3ff]"
      >
        {children}
      </main>
    </div>
  );
}
