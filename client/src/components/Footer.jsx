import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between  items-center">
        <div>
          <div className="font-bold text-lg">ByteCart</div>
          <div className="text-sm text-gray-400 mt-2">
            Modern e-commerce starter UI
          </div>
        </div>
        <div className="text-sm text-gray-400 mt-4  md:mt-0">
          © {new Date().getFullYear()} ByteCart - made with ❤
        </div>
      </div>
    </footer>
  );
};

export default Footer;
