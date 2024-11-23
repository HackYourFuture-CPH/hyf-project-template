import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TrashIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
function ClientNewTable({ project, onDelete }) {
  const { title, status, deadline, id } = project;
  return (
    <div>
      <Table>
        <TableCaption>
          A list of your recent invoices.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              Project
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="">Edit</TableHead>
            <TableHead className="text-right">
              Delete
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">
              {title}
            </TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>{deadline}</TableCell>
            <TableCell className="">
              <Link href={`/client-dashboard/edit/${id}`}>
                <PencilSquareIcon className="h-6 w-6 text-blue-600" />
              </Link>
            </TableCell>
            <TableCell className="flex justify-end">
              <TrashIcon className="h-6 w-6 text-red-500" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default ClientNewTable;
