// @ts-nocheck
import moment from "moment";
export const timeSince = (dateParam)=> {
    if (!dateParam) {
        return null;
    }
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();
    
    if (seconds < 5) {
        return 'Today';
    } else if (seconds < 60) {
        return `Today`;
    } else if (seconds < 90) {
        return 'Today';
    } else if (minutes < 60) {
        return `Today`;
    } else if (isToday) {
        return 'Today'; // Today at 10:20
    } else if (isYesterday) {
        return 'Yesterday'; // Yesterday at 10:20
    } else if (isThisYear) {
        return moment.utc(dateParam).local().format('MMM D, YYYY'); // 10. January at 10:20
    }
    return moment.utc(dateParam).local().format('MMM D, YYYY'); // 10. January 2017. at 10:20
};