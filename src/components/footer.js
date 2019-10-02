import React from "react";

function Footer() {
  return (
    <>
      <footer className="footer mt-10 w-full">
        <hr />
        <p className="mt-5 text-center text-xs w-full font-bold text-gray-500">
          <a
            className="hover:text-orange-600 "
            href="https://github.com/blurdylan"
          >
            v0.1.0
          </a>{" "}
          -{" "}
          <a
            className="hover:text-orange-600 "
            href="https://dylantientcheu.com"
          >
            Dylan TIENTCHEU
          </a>
        </p>
      </footer>
    </>
  );
}

export default Footer;
