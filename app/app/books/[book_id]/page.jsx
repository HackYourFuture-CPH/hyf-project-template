"use client";

import { useParams } from "next/navigation";

const BookDetails = () => {
  const { book_id } = useParams();

  // Example: Fetch book details based on the book_id
  return (
    <div>
      <h1>Book Details for ID: {book_id}</h1>
      {/* Fetch and display the book details here */}
    </div>
  );
};

export default BookDetails;
