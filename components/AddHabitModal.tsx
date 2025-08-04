"use client";

import { useHabit } from "@/context/HabitContent";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // unique IDs
import { Frequency } from "@/lib/types";

const AddHabitModal = () => {
    const { addHabit } = useHabit();
    const [name, setName] = useState("");
    const [frequency, setFrequency] = useState<Frequency>("Daily");
    const [startDate, setStartDate] = useState(() =>
        new Date().toISOString().slice(0, 10)
    ); 
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newHabit = {
            id: uuidv4(),
            name,
            frequency,
            startDate,
            logs: [], 
        };

        addHabit(newHabit);
        setName("");
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white text-black p-4 rounded-md shadow-md mb-6 max-w-xl mx-auto"
        >
            <h2 className="text-xl font-semibold mb-4 font-mono">Add New Habit</h2>

            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Habit Name</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select
                    className="w-full p-2 border rounded"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as Frequency)}
                >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
                Add Habit
            </button>
        </form>
    );
}

export default AddHabitModal;