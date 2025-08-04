export type Frequency = "Daily" | "Weekly" | "Monthly";

export interface Habit {
    id: string;
    name: string;
    frequency: Frequency;
    startDate: string;
    logs: string[];  // for tracking dates when the habit was completed
}
