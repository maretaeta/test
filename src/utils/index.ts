// utility.ts

export const monthNameToNumber = (monthName: string): number => {
    if (typeof monthName !== 'string') {
        throw new Error(`Invalid month name: ${monthName}`);
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const index = months.findIndex(month => month.toLowerCase() === monthName.toLowerCase());

    if (index === -1) {
        throw new Error(`Invalid month name: ${monthName}`);
    }

    return index + 1; // Returns the month number (1-based)
};
