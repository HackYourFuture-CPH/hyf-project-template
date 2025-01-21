import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit } from "@mui/icons-material";

const DashboardContent = () => {
  return (
    <div>
      <Card>
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle className="font-extrabold text-3xl">All Courses</CardTitle>
          <Button className="p-5">Create New Course</Button>
        </CardHeader>
        <CardContent>
          <div>
            <Table>
              <TableCaption>A list of total invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Courses</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    ReactJS Full Course
                  </TableCell>
                  <TableCell>20</TableCell>
                  <TableCell>$100</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="mr-2">
                      <Edit className="h-6 w-6" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
