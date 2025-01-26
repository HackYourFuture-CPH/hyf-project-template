const Footer = () => {
  return (
    <div className="flex  min-h-screen flex-col">
      <div className="grow"></div>
      <footer className="absolute bottom-0 h-10 w-full border-t bg-gray-100 py-4 text-black">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">
            &copy; {new Date().getUTCFullYear()} CodeCrafters Inc. |
            Privatlivspolitik | Copyright
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
