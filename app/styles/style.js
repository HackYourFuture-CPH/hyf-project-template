export const style = {
    heading: "font-poppins font-semibold xs:text-[48px] text-[40px] xs:leading-[77px] leading-[67px] w-full",
    paragraph: "font-poppins font-normal text-[18px] leading-[30px]",

    flexCenter: "flex flex-col justify-center items-center",
    flexStart: "flex flex-col justify-center items-start",

    paddingX: "sm:px-16 px-6",
    paddingY: "sm:py-16 py-6",
    padding: "sm:px-16 px-6 sm:py-12 py-4",

    marginX: "sm:mx-16 mx-6",
    marginY: "sm:my-16 my-6",
};

export const layout = {
    section: `flex flex-col ${style.paddingY}`,
    sectionImg: `flex-1 flex ${style.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,
};