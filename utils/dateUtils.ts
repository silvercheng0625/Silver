// Provides a 'YYYY-MM-DD' formatted date string.
export const getTodayDateString = (): string => {
    const today = new Date();
    // Use toLocaleDateString with the 'sv-SE' locale to get the desired format.
    return today.toLocaleDateString('sv-SE');
};

// Gets the localized month name from a month index (0-11).
export const getMonthName = (monthIndex: number): string => {
    const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    return monthNames[monthIndex];
};

// Gets the number of days in a given month and year.
export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

// Gets the starting day of the week for a given month and year (0 for Sunday, 6 for Saturday).
export const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
};

// Gets the year and month index for the month before the given date.
export const getPreviousMonthInfo = (date: Date): { year: number, month: number } => {
    const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    return {
        year: prevMonthDate.getFullYear(),
        month: prevMonthDate.getMonth(),
    };
};