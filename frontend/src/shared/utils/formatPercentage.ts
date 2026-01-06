import { formatNumber } from './formatNumber';

/**
 * Converts a number to a percentage string.
 * 
 * @param value - The number to format (e.g., 0.123 for 12.3%)
 * @param decimals - Number of decimal places (default is 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
    const formattedValue = formatNumber(value * 100, decimals);
    return `${formattedValue}%`;
};
