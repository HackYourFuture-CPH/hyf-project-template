import dayjs from "dayjs";
export default function dateFormat(dateString) {
  const formattedDate = dayjs(dateString).format("DD/MM/YYYY");
  return formattedDate;
}
