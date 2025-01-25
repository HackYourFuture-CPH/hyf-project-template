import Image from "next/image";
import React from "react";

const InvestSection = () => {
  const invest = [
    {
      icon: "/explore.svg",
      title: "Explore new skills",
      description:
        "Access 1000+ short courses in personal development, programming, business and data analysis",
    },
    {
      icon: "/earn.svg",
      title: "Earn valuable credentials",
      description:
        "Access 1000+ short courses in personal development, programming, business and data analysis",
    },
    {
      icon: "/learn.svg",
      title: "Learn from the best",
      description:
        "Access 1000+ short courses in personal development, programming, business and data analysis",
    },
  ];
  return (
    <div className=" py-20 bg-gray-100">
      <h2 className="text-center mb-14 text-3xl font-semibold">
        Invest in your career
      </h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 ">
        {invest.map((invests, index) => (
          <div key={index} className="text-center px-7">
            <Image
              src={invests.icon}
              width={30}
              height={30}
              className="mx-auto mb-3 "
            />
            <h2 className="font-bold text-xl mb-3">{invests.title}</h2>
            <p className="leading-7 text-gray-400">{invests.description}</p>
          </div>
        ))}
      </div>
      {/* <div>
        <div>
          <h2 className="font-bold text-4xl">
             Discover bite-sized lessons, real-world projects, and
            expert-led courses designed to fit into your busy life.
          </h2>
        </div>
        <div></div>
      </div> */}
    </div>
  );
};

export default InvestSection;
