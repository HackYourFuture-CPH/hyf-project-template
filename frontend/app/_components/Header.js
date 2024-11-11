import Logo from "@/app/_components/Logo";
import Navigation from "./Navigation";

function Header() {
  return (
    <header className="flex flex-col bg-primary-300 border-b border-primary-900 h-60 ">
      <div className="flex justify-around items-center bg-primary-500 h-20 py-3">
        <Logo />
        <h1 className="text-2xl text-primary-100">
          Client Management
        </h1>
        <button className="bg-accent-950 text-accent-50 px-8 py-3 rounded-md text-xl hover:bg-accent-900 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300">
          Logout
        </button>
      </div>
      <div className="flex justify-between items-center text-primary-800 text-3xl px-10 h-40">
        <p>Welcome Rose</p>
        <Navigation />
      </div>
    </header>
  );
}

export default Header;
