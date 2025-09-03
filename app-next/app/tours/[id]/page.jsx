export default function TourDetails({ params }) {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Tour Details</h1>
      <p>Tour ID: {params.id}</p>
      <p>This is the details page for the selected tour.</p>
    </div>
  );
}
