"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { makeRequest } from "../utils/makeRequest";
import { useBookshelf } from "./BooksReadCountContext";

const GoalContext = createContext();
export const useGoal = () => useContext(GoalContext);

export const GoalProvider = ({ children }) => {
  const [activeGoal, setActiveGoal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { bookShelf } = useBookshelf();

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await makeRequest(`/api/goals/${activeGoal.goal_id}`);
        setActiveGoal(response.data);
      } catch (error) {
        console.error("Failed to fetch goal:", error);
      }
    };

    fetchGoal();
  }, []);

  const setGoal = async (goalData) => {
    setIsSubmitting(true);

    try {
      const newGoal = await makeRequest("/api/goals/add", goalData);

      setActiveGoal(newGoal);
    } catch (error) {
      console.error("Failed to set goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const updateGoal = async (goalData) => {
    setIsSubmitting(true);
    try {
      const updatedGoal = await makeRequest(
        `/api/goals/${activeGoal.goal_id}`,
        goalData,
        "PUT"
      );
      setActiveGoal(updatedGoal);
    } catch (error) {
      console.error("Failed to update goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgress = () => {
    if (!activeGoal) return 0;

    const booksAfterStartDate = bookShelf.read.filter(
      (book) => new Date(book.created_at) >= new Date(activeGoal.start_date)
    );

    return Math.min(
      (booksAfterStartDate.length / activeGoal.goal_count) * 100,
      100
    );
  };

  const getTimeRemaining = () => {
    if (!activeGoal) return null;

    const today = new Date();
    const endDate = new Date(activeGoal.end_date);

    if (activeGoal.goal_type === "MONTHLY") {
      const daysLeft = Math.max(
        Math.floor((endDate - today) / (1000 * 60 * 60 * 24)),
        0
      );
      return daysLeft > 0 ? `${daysLeft} day(s) left` : "Goal time elapsed!";
    } else if (activeGoal.goal_type === "ANNUAL") {
      const monthsLeft = Math.max(
        Math.floor((endDate - today) / (1000 * 60 * 60 * 24 * 30)),
        0
      );
      return monthsLeft > 0
        ? `${monthsLeft} month(s) left`
        : "Goal time elapsed!";
    }

    return null;
  };
  return (
    <GoalContext.Provider
      value={{
        activeGoal,
        setGoal,
        updateGoal,
        getProgress,
        getTimeRemaining,
        isSubmitting,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};
