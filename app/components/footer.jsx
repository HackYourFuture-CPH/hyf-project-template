const Footer = () => {
  return (
    <footer className="w-full bg-blue-100 py-7 text-gray-700">
      <div className="container mx-auto flex items-center justify-center gap-10">
        <p className="text-sm font-semibold">
          &copy; {new Date().getUTCFullYear()} CodeCrafters Inc.
        </p>
        <p className="text-sm font-semibold">Privatlivspolitik</p>
        <p className="text-sm font-semibold">Copyright</p>
      </div>
    </footer>
  );
};

export default Footer;
