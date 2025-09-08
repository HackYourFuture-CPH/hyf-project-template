"use client";
import VolunteerDetail from "@/components/VolunteerDetail/VolunteerDetail";

export default function VolunteerDetailPage({ params }) {
  return <VolunteerDetail volunteerId={params.id} />;
}
