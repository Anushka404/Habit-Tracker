"use client";

import {
    CalendarDays,
    CalendarCheck,
    TrendingUp,
    Clock,
} from "lucide-react";
import { useState } from "react";
import { Habit } from "../lib/types";
import { useHabit } from "../context/HabitContent";

interface HabitCardProps {
    habit: Habit;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
    const { logHabit } = useHabit();
    const [weekOffset, setWeekOffset] = useState(0); // 0: current week, -1: last, +1: next

    const today = new Date().toISOString().split("T")[0];

    const getWeekDays = (): { date: string; weekday: string }[] => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

        const days: { date: string; weekday: string }[] = [];

        for (let i = 0; i < 7; i++) {
            const current = new Date(startOfWeek);
            current.setDate(startOfWeek.getDate() + i);

            const iso = current.toISOString().split("T")[0];
            const weekday = current.toLocaleDateString("en-US", { weekday: "short" });

            days.push({ date: iso, weekday });
        }

        return days;
    };

    const weekDays = getWeekDays();

    const isSameWeek = (d1: string, d2: string): boolean => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        const startOfWeek = (d: Date) => {
            const copy = new Date(d);
            copy.setDate(copy.getDate() - copy.getDay());
            return copy.toDateString();
        };
        return startOfWeek(date1) === startOfWeek(date2);
    };

    const isSameMonth = (d1: string, d2: string): boolean => {
        return d1.slice(0, 7) === d2.slice(0, 7); // YYYY-MM
    };

    const alreadyLoggedThisPeriod = (date: string): boolean => {
        if (habit.frequency === "Daily") {
            return habit.logs.includes(date);
        }
        if (habit.frequency === "Weekly") {
            return habit.logs.some((d) => isSameWeek(d, date));
        }
        if (habit.frequency === "Monthly") {
            return habit.logs.some((d) => isSameMonth(d, date));
        }
        return false;
    };

    const getCurrentWeekLabel = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);
        return startOfWeek.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("en-GB"); 
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-black mb-6">
            <h2 className="text-xl font-bold mb-3 text-indigo-700">{habit.name}</h2>

            {/* Current Week Label */}
            <p className="text-sm text-gray-700 mb-1 font-mono">
                {getCurrentWeekLabel()}
            </p>

            {/* Week Bubble Row */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setWeekOffset((prev) => prev - 1)}
                    className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                    ←
                </button>

                <div className="grid grid-cols-7 gap-2 flex-1 px-2">
                    {weekDays.map(({ date, weekday }) => {
                        const isToday = date === today;
                        const isLogged = habit.logs.includes(date);
                        const isClickable = date === today;

                        return (
                            <div key={date} className="text-center text-xs">
                                <div className="text-gray-600 font-mono font-medium mb-1">{weekday}</div>
                                <button
                                    disabled={!isClickable}
                                    onClick={() => {
                                        if (!alreadyLoggedThisPeriod(date)) {
                                            logHabit(habit.id, date);
                                        }
                                    }}
                                    className={`
                                        w-9 h-9 rounded-full border-2 flex items-center justify-center mx-auto transition font-mono
                                        ${habit.logs.includes(date) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-800 border-gray-300"}
                                        ${isToday ? "ring-2 ring-indigo-400" : ""}
                                        ${isClickable ? "hover:bg-indigo-100" : "cursor-not-allowed"}
                                    `}
                                    
                                    title={alreadyLoggedThisPeriod(date) ? "Already logged" : "Click to log today"}>
                                    {new Date(date).getDate()}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={() => setWeekOffset((prev) => prev + 1)}
                    className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                    →
                </button>
            </div>

            {/* Details */}
            <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-800" />
                <span>Frequency: {habit.frequency}</span>
            </div>
            <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-gray-500" />
                <span>Start Date: {formatDate(habit.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Progress: {habit.logs.length} {habit.logs.length === 1 ? "entry" : "entries"}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Last done: {habit.logs.length > 0 ? formatDate(habit.logs.at(-1)!) : "Not logged yet"}</span>
            </div>
            
            {/* Progress */}
            <div className="mt-4">
                {(() => {
                    const now = new Date();
                    let label = "";
                    let maxCount = 1;
                    let actualCount = 0;
                    let color = "";

                    if (habit.frequency === "Daily") {
                        label = "Last 7 Days";
                        maxCount = 7;
                        color = "bg-indigo-500";
                        actualCount = habit.logs.filter((log) => {
                            const date = new Date(log);
                            const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24); // difference in days
                            return diff <= 7;
                        }).length;
                    }

                    if (habit.frequency === "Weekly") {
                        label = "Last 4 Weeks";
                        maxCount = 4;
                        color = "bg-yellow-500";
                        actualCount = habit.logs.filter((log) => {
                            const date = new Date(log);
                            const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 7);
                            return diff <= 4;
                        }).length;
                    }

                    if (habit.frequency === "Monthly") {
                        label = "Last 6 Months";
                        maxCount = 6;
                        color = "bg-rose-500";
                        actualCount = habit.logs.filter((log) => {
                            const date = new Date(log);
                            const diff =
                                now.getFullYear() * 12 + now.getMonth() -
                                (date.getFullYear() * 12 + date.getMonth());
                            return diff <= 6;
                        }).length;
                    }

                    return (
                        <>
                            <div className="flex justify-between mb-1">
                                <p className="text-sm font-medium text-gray-700">{label}</p>
                                <span className="text-sm text-gray-600">{actualCount} / {maxCount}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded h-2">
                                <div
                                    className={`h-full ${color} rounded`}
                                    style={{ width: `${(actualCount / maxCount) * 100}%` }}
                                />
                            </div>
                        </>
                    );
                })()}
            </div>
            
            {/* Total Progress */}
            <div className="mt-4">
                <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">Total Progress</p>
                    <span className="text-sm text-gray-600">{habit.logs.length} logs</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-2 mb-2">
                    <div
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${Math.min(habit.logs.length / 30, 1) * 100}%` }}
                    />
                </div>
            </div>

            {/* Date Dropdown */}
            <div className="mt-2">
                <details className="text-sm text-gray-700 cursor-pointer select-none">
                    <summary className="underline hover:text-indigo-800">Show All Logged Dates</summary>
                    <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
                        {habit.logs.map((logDate, idx) => (
                            <li key={idx}>{formatDate(logDate)}</li>
                        ))}
                    </ul>
                </details>
            </div>
        </div>
    );
};

export default HabitCard;
