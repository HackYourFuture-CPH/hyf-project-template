import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { TrashIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
function ClientNewTable({ project, onDelete }) {
  const { title, status, deadline, id } = project;
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] text-left">
              Project
            </TableHead>
            <TableHead className="text-left">
              Status
            </TableHead>
            <TableHead className="text-left">
              Deadline
            </TableHead>
            <TableHead className="text-left">
              Edit
            </TableHead>
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
              <Link
                href={`/client-dashboard/edit/${id}`}
                className="flex items-center"
              >
                <PencilSquareIcon className="h-6 w-6 hover:text-blue-800 transition duration-200" />
              </Link>
            </TableCell>
            <TableCell className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger>
                  <TrashIcon className="h-6 w-6 hover:text-red-700 transition duration-200 cursor-pointer" />
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-100 text-primary-900">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This
                      will permanently delete your project.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(id)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default ClientNewTable;
