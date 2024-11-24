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
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              Project
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Edit</TableHead>
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
              <AlertDialog>
                <AlertDialogTrigger>
                  <TrashIcon className="h-6 w-6 text-red-500" />
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
