import React from "react";
import Image from "next/image";

const Testimonial = () => {
  const clientTestimonials = [
    {
      image: "/js.png",
      name: "John Done",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum  orci vel risus scelerisque, eget posuere sem lobortis. Interdum et  malesuada fames ac ante ipsum primis in faucibus",
    },
    {
      image: "/js.png",
      name: "Mark Zuckerberg",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum  orci vel risus scelerisque, eget posuere sem lobortis. Interdum et  malesuada fames ac ante ipsum primis in faucibus",
    },
    {
      image: "/js.png",
      name: "Tim Cook",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum  orci vel risus scelerisque, eget posuere sem lobortis. Interdum et  malesuada fames ac ante ipsum primis in faucibus",
    },
    {
      image: "/js.png",
      name: "Bill Gate",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum  orci vel risus scelerisque, eget posuere sem lobortis. Interdum et  malesuada fames ac ante ipsum primis in faucibus",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum  orci vel risus scelerisque, eget posuere sem lobortis. Interdum et  malesuada fames ac ante ipsum primis in faucibus",
    },
  ];

  return (
    <div className="my-10">
      <div className="container mx-auto flex justify-between my-10">
        <h2 className="font-medium text-3xl">What Our Users Are Saying</h2>
        <h2 className="font-medium text-3xl">Explore Courses</h2>
      </div>
      <div className=" container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {clientTestimonials.map((testimonial, index) => (
          <div
            key={index}
            className=" bg-black rounded-2xl  leading-loose text-center py-7 px-2 shadow-lg hover:bg-slate-500 transition-all even:bg-gray-100  "
          >
            <div className="rounded-full w-16 h-16 mx-auto mb-6 bg-slate-100"></div>

            <h2 className="text-lg font-semibold text-white mb-4 ">
              {testimonial.name}
            </h2>
            <p className=" text-gray-400">{testimonial.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
