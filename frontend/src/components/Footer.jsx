const Footer = () => {
  return (
    <footer className="w-full bg-white text-gray-800 border-t border-gray-200">

      <div className="w-full px-7 py-2 flex flex-col md:flex-row items-center justify-between gap-3">

        {/* LEFT */}
        <div>
          <p className="text-gray-900 font-semibold tracking-wide">
            POS SYSTEM
          </p>

          <p className="text-xs text-gray-500">
            Restaurant Management Dashboard
          </p>
        </div>

        {/* CENTER STATUS */}
        <div className="flex items-center gap-2">

          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

          <p className="text-xs text-green-600 font-medium">
            System Live
          </p>

        </div>

        {/* RIGHT */}
        <div className="text-xs text-gray-500 text-center md:text-right">

          <p className="text-gray-900 font-medium">
            ShahnaunLabs © 2026
          </p>

          <p>
            All rights reserved
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;