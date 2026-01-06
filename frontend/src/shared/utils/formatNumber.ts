/**
 * Formats a numeric value with a fixed number of decimals for display.
 * 
 * @param value - The number to format
 * @param decimals - Number of decimal places (default is 2)
 * @returns Formatted string
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
    if (isNaN(value)) return '0.00';

    return new Intl.NumberFormat('en-GB', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
};
