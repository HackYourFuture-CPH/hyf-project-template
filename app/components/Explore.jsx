import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Explore({ icon, title }) {
  return (
    <>
      <div className="flex min-h-[150px] min-w-[150px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-blue-100 p-3 text-center duration-500 hover:bg-blue-200">
        <div className="flex size-[60px] items-center justify-center rounded-full bg-blue-500 p-3">
          <FontAwesomeIcon className="w-10 text-blue-100" icon={icon} />
        </div>
        <h3 className="text-l font-semibold">{title}</h3>
      </div>
    </>
  );
}
