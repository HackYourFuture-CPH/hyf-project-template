import ClientList from "@/app/_components/client-dashboard-components/ClientList";

export const metadata = {
  title: "clients",
};

function Page() {
  return (
    <div className="bg-accent-600">
      <ClientList />

      <p>This is a client-side only page.</p>
    </div>
  );
}

export default Page;
