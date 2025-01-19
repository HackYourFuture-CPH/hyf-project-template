export const style = {
  heading:
    'font-poppins font-semibold xs:text-[48px] text-[40px] xs:leading-[77px] leading-[67px] w-full',
  paragraph: 'font-poppins font-normal text-[18px] leading-[30px]',

  flexCenter: 'flex flex-col justify-center items-center',
  flexStart: 'flex flex-col justify-center items-start',

  paddingX: 'sm:px-4 px-2',
  paddingY: 'sm:py-4 py-2',
  padding: 'sm:px-4 px-2 sm:py-4 py-2',

  marginX: 'sm:mx-4 mx-2',
  marginY: 'sm:my-10 my-4',
};

export const layout = {
  section: `flex ${style.paddingY}`,
  sectionImg: `flex-1 flex ${style.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,
};
