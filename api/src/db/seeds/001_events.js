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
            },
            {
                id: 2,
                price: 150,
                currency: "DKK",
                title: "After-Work Board Games Night",
                description:
                    "Drop in with friends or come solo. We’ll teach quick games, set you up at a table, and keep the vibe cozy and social.",
            },
            {
                id: 3,
                price: 250,
                currency: "DKK",
                title: "Beginner Pasta Workshop",
                description:
                    "Hands-on workshop: mix dough, roll sheets, shape pasta, and finish with a simple sauce. You’ll leave with a small take-home pack.",
            },
            {
                id: 4,
                price: 0,
                currency: "DKK",
                title: "Sunday Park Run & Stretch",
                description:
                    "Easy-paced community run (5K-ish) followed by guided stretching. All levels welcome—walkers included.",
            },
            {
                id: 5,
                price: 75,
                currency: "DKK",
                title: "Indie Film Screening: Short Nights",
                description:
                    "A curated set of local short films with a short Q&A after. Seats are limited—arrive early for the best spots.",
            },
            {
                id: 6,
                price: 180,
                currency: "DKK",
                title: "Photography Walk: City Lights",
                description:
                    "Evening photo walk focused on street scenes and reflections. Bring any camera—even a phone—and we’ll share tips on composition and exposure.",
            },
            {
                id: 7,
                price: 120,
                currency: "DKK",
                title: "Bread & Butter Tasting",
                description:
                    "Taste 6 breads and 5 butters (classic + flavored). Learn what makes a good crumb, crust, and fermentation—and why butter matters.",
            },
            {
                id: 8,
                price: 300,
                currency: "DKK",
                title: "Live Jazz Trio at the Loft",
                description:
                    "An intimate set with modern standards and originals. Ticket includes a welcome drink; doors open 19:00.",
            },
        ])
        .onConflict("id")
        .merge();
}