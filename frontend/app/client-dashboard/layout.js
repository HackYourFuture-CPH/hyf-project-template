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
      <main className=" overflow-hidden min-h-screen relative">
        {children}
      </main>
    </div>
  );
}
