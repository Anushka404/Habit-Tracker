import { Habit } from "./types";

export const defaultHabits: Habit[] = [
    {
        id: "1",
        name: "Do Daily Meditation",
        frequency: "Daily",
        startDate: "2025-08-01",
        logs: ["2025-08-01", "2025-08-02", "2025-08-03"],
    },
    {
        id: "2",
        name: "Go for a Walk",
        frequency: "Weekly",
        startDate: "2025-07-15",
        logs: ["2025-07-15", "2025-07-22", "2025-08-01"],
    },
    {
        id: "3",
        name: "Submit Report",
        frequency: "Monthly",
        startDate: "2025-06-01",
        logs: ["2025-06-05", "2025-07-03"],
    },
];
