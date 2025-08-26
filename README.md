<pre>
PetPass/
├─ .git/                               # Git essential files
├─ api/                                # Backend API
│  ├─ routes/                          # API route handlers
│  │  ├─ pets.js                       # CRUD for pets
│  │  └─ users.js                      # CRUD for users
│  └─ index.js                         # API entry point
│
├─ app-next/                           # Next.js frontend
│  ├─ public/                          # Static assets (logos, images, etc.)
│  │  └─ favicon.ico
│  └─ app/                             # App Router (Next.js 13+)
│     ├─ layout.js
│     ├─ globals.css
│     ├─ page.js                       # Landing page (/)
│     │
│     ├─ about/                        # /about
│     │  ├─ page.js
│     │  └─ about.module.css
│     │
│     ├─ contact/                      # /contact
│     │  ├─ page.js
│     │  └─ contact.module.css
│     │
│     ├─ features/                     # /features
│     │  ├─ page.js
│     │  └─ features.module.css
│     │
│     ├─ profile/                      # /profile
│     │  ├─ page.js
│     │  └─ profile.module.css
│     │
│     └─ components/                   # Reusable UI components
│        ├─ navbar/
│        │  ├─ Navbar.js
│        │  └─ Navbar.module.css
│        └─ footer/
│           ├─ Footer.js
│           └─ Footer.module.css
│
├─ .gitignore
└─ README.md
</pre>
