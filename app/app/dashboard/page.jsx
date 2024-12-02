"use client";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AppLayoutContainer from "../components/AppLayoutContainer";
import { CircularProgress, Box, Typography } from "@mui/material";
import Profile from "../components/Profile";
import Bookshelf from "../components/Bookshelf";
import QuotesList from "../components/QuotesList";
import styles from "./Dashboard.module.css";
import { BookshelfProvider } from "../contexts/BooksReadCountContext";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [booksReadCount, setBooksReadCount] = useState(0);

  if (!currentUser) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Loading user data...
        </Typography>
      </Box>
    );
  }

  return (
    <BookshelfProvider>
      <AppLayoutContainer>
        <div className={styles.mainContent}>
          <>
            <div className={styles.leftSide}>
              <Profile
                userId={currentUser.user.id}
                booksReadCount={booksReadCount}
              />
            </div>
            <div className={styles.middleContent}>
              <Bookshelf
                userId={currentUser.user.id}
                updateBooksReadCount={setBooksReadCount}
              />
            </div>
            <div className={styles.rightSide}>
              <QuotesList userId={currentUser.user.id} />
            </div>
          </>
        </div>
      </AppLayoutContainer>
    </BookshelfProvider>
  );
}
