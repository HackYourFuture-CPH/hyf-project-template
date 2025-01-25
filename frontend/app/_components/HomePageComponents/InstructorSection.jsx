import { HighQuality } from "@mui/icons-material";
import Image from "next/image";

const InstructorSection = () => {
  return (
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-center bg-white p-8 md:p-12 gap-4 md:gap-8">
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/instructor.png"
          alt="Instructor Image"
          className="rounded-lg shadow-lg object-contain max-w-full h-auto"
          unoptimized={true}
          width={550}
          height={456}
          priority={true}
        />
      </div>

      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold font-roboto leading-snug text-gray-500 mb-6">
          Make Money <br />
          While Making an <br /> Impact
        </h1>
        <p className="text-[20px] font-[700] leading-[30px] font-roboto text-black mb-6">
          Empower minds, share your expertise, and earn a steady <br />
          income—create courses that change lives while building <br />
          your financial freedom!
        </p>
        <button className="px-9 py-4 border border-black text-lg md:text-xl font-roboto font-bold shadow-md hover:bg-gray-100 transition duration-300">
          Become An Instructor
        </button>
      </div>
    </div>
  );
};

export default InstructorSection;
