"use client";

import { useHabit } from "../context/HabitContent";
import AddHabitModal from "../components/AddHabitModal";
import HabitCard from "../components/HabitCard";

export default function HomePage() {
    const { habits, resetHabits } = useHabit();

    return (
        <main className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-4xl text-black font-bold text-center mb-6 font-mono">
                Habit Tracker
            </h1>
            <AddHabitModal />

            {/* HabitCard */}
            <div className="space-y-4 max-w-2xl mx-auto text-black">
                {habits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} />
                ))}
            </div>

            {/*reset button */}
            <button
                className="mt-6 px-4 py-2 text-center bg-red-600 text-white rounded hover:bg-red-700"
                onClick={resetHabits}
            >
                Reset All Habits
            </button>
        </main>
    );
}
