export default function Explore({icon, title}) {

    return (
        <>
            <div className="flex flex-col w-[150px] h-[150px] justify-center text-center items-center bg-blue-100 hover:bg-blue-200 duration-500 rounded-2xl p-3 gap-3">
                <div className="flex items-center justify-center w-[50px] h-[50px]">
                    <img src={icon} alt="icon" className="block"/>
                </div>
                <h3 className="text-l font-semibold">{title}</h3>
            </div>
        </>
    )
}