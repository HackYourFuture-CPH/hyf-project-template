/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
  await knex("event").del();

  await knex("event")
    .insert([
      {
        id: 1,
        price: 100,
        currency: "DKK",
        title: "Copenhagen Coffee Crawl",
        description:
          "A relaxed Saturday walk between 4 specialty cafés. Includes tasting notes, small pastry, and a guide to brewing styles.",
        venue: "Another Coffee, Amager",
        event_date: "2026-05-20 10:00:00",
        available_tickets: 15,
      },
      {
        id: 2,
        price: 150,
        currency: "DKK",
        title: "After-Work Board Games Night",
        description:
          "Drop in with friends or come solo. We’ll teach quick games, set you up at a table, and keep the vibe cozy and social.",
        venue: "Bastard Café, Rådhusstræde",
        event_date: "2026-05-21 17:00:00",
        available_tickets: 30,
      },
      {
        id: 3,
        price: 250,
        currency: "DKK",
        title: "Beginner Pasta Workshop",
        description:
          "Hands-on workshop: mix dough, roll sheets, shape pasta, and finish with a simple sauce. You’ll leave with a small take-home pack.",
        venue: "Torvehallerne, Frederiksborggade",
        event_date: "2026-05-22 18:30:00",
        available_tickets: 10,
      },
      {
        id: 4,
        price: 0,
        currency: "DKK",
        title: "Sunday Park Run & Stretch",
        description:
          "Easy-paced community run (5K-ish) followed by guided stretching. All levels welcome—walkers included.",
        venue: "Fælledparken, Østerbro",
        event_date: "2026-05-24 09:00:00",
        available_tickets: 100,
      },
      {
        id: 5,
        price: 75,
        currency: "DKK",
        title: "Indie Film Screening: Short Nights",
        description:
          "A curated set of local short films with a short Q&A after. Seats are limited—arrive early for the best spots.",
        venue: "Empire Bio, Guldbergsgade",
        event_date: "2026-05-25 20:00:00",
        available_tickets: 40,
      },
      {
        id: 6,
        price: 180,
        currency: "DKK",
        title: "Photography Walk: City Lights",
        description:
          "Evening photo walk focused on street scenes and reflections. Bring any camera—even a phone—and we’ll share tips on composition and exposure.",
        venue: "Nyhavn 1, København K",
        event_date: "2026-05-26 21:00:00",
        available_tickets: 12,
      },
      {
        id: 7,
        price: 120,
        currency: "DKK",
        title: "Bread & Butter Tasting",
        description:
          "Taste 6 breads and 5 butters (classic + flavored). Learn what makes a good crumb, crust, and fermentation—and why butter matters.",
        venue: "Lille Bakery, Refshaleøen",
        event_date: "2026-05-28 11:00:00",
        available_tickets: 20,
      },
      {
        id: 8,
        price: 300,
        currency: "DKK",
        title: "Live Jazz Trio at the Loft",
        description:
          "An intimate set with modern standards and originals. Ticket includes a welcome drink; doors open 19:00.",
        venue: "La Fontaine, Kompagnistræde",
        event_date: "2026-05-30 22:00:00",
        available_tickets: 50,
      },
    ])
    .onConflict("id")
    .merge();
}
