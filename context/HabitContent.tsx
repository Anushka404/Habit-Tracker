"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Habit } from "@/lib/types";
import { defaultHabits } from "@/lib/defaultHabits";

type HabitContextType = {
    habits: Habit[];
    addHabit: (habit: Habit) => void;
    logHabit: (id: string, date: string) => void;
    resetHabits: () => void;
};

const HabitContext = createContext<HabitContextType | null>(null);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    
    useEffect(() => {
        const stored = localStorage.getItem("habits");
        if (stored) {
            setHabits(JSON.parse(stored));
        } else {
            setHabits(defaultHabits);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("habits", JSON.stringify(habits)); // Save habits to localStorage whenever they change
    }, [habits]);

    const addHabit = (habit: Habit) => {
        setHabits((prev) => [...prev, habit]); // Add new habit at the end of array
    };

    const logHabit = (id: string, date: string) => {
        setHabits((prev) => 
            prev.map((habit) =>
                habit.id === id && !habit.logs.includes(date) // checks id and if date is not already logged
                    ? { ...habit, logs: [...habit.logs, date] }
                    : habit
            )
        );
    }
    const resetHabits = () => {
        localStorage.removeItem("habits");
        setHabits(defaultHabits);
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, logHabit, resetHabits}}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabit = () => {
    const context = useContext(HabitContext);
    if (!context) throw new Error("useHabit must be used within HabitProvider");
    return context;
};