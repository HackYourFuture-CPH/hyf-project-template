import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Explore({icon, title}) {

    return (
        <>
            <div className="flex flex-col min-w-[150px] min-h-[150px] justify-center text-center items-center bg-blue-100 hover:bg-blue-200 duration-500 rounded-2xl p-3 gap-3 cursor-pointer">
                <div className="flex items-center justify-center w-[60px] h-[60px] bg-blue-500 rounded-full p-3">
                    <FontAwesomeIcon className="text-blue-100 w-10" icon={icon} />
                </div>
                <h3 className="text-l font-semibold">{title}</h3>
            </div>
        </>
    )
}