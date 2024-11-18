"use client";

import AppLayoutContainer from "../../components/AppLayoutContainer";
import Profile from "../../components/Profile";
import Bookshelf from "../../components/Bookshelf";
import MostRecentQuote from "../../components/MostRecentQuote";
import Quote from "../../components/Quote";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../Dashboard.module.css";
export default function UserProfilePage({ params }) {
  const { currentUser } = useAuth(); // Destructure currentUser from AuthContext
  if (!currentUser) {
    return <p>Loading user data...</p>;
  }
  return (
    <AppLayoutContainer>
      <div className={styles.mainContent}>
        <>
          <div className={styles.leftSide}>
            <Profile userData={currentUser.user} />
          </div>
          <div className={styles.middleContent}>
            <Bookshelf userId={currentUser.user.id} />
            <h3>Most Recent Quotes:</h3>
            <MostRecentQuote />
          </div>
          <div className={styles.rightSide}>
            <h3>Favorite Quotes:</h3>
            {/* Pass currentUser.user.id to Quote */}
            <Quote userId={currentUser.user.id} />
          </div>
        </>
      </div>
    </AppLayoutContainer>
  );
}
