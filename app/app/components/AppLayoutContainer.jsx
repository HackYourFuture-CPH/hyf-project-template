import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const AppLayoutContainer = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default AppLayoutContainer;
