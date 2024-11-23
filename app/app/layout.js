import { AuthContextProvider } from "./contexts/AuthContext";
import { BookshelfProvider } from "./contexts/BooksReadCountContext";
import localFont from "next/font/local";
import "./globals.css";

// Load Lato Font
const lato = localFont({
  src: "./fonts/Lato-Regular.ttf", // Path to your .ttf file
  variable: "--font-lato",
  weight: "400", // Regular weight
});

// Load Playfair Display Font
const playfairDisplay = localFont({
  src: "./fonts/PlayfairDisplay-Italic.ttf", // Path to your .ttf file
  variable: "--font-playfair",
  weight: "400", // Regular weight
});

// You can also load bold versions if needed
const latoBold = localFont({
  src: "./fonts/Lato-Bold.ttf", // Path to your .ttf file
  variable: "--font-lato-bold",
  weight: "700", // Bold weight
});

const playfairDisplayBold = localFont({
  src: "./fonts/PlayfairDisplay-Bold.ttf", // Path to your .ttf file
  variable: "--font-playfair-bold",
  weight: "700", // Bold weight
});

export const metadata = {
  title: "LeafNotes",
  description: "A note-taking app for book lovers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${playfairDisplay.variable}`}>
        <AuthContextProvider>
          <BookshelfProvider>{children}</BookshelfProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
