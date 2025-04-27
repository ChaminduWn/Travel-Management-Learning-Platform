import { formatDistanceToNowStrict, format } from 'date-fns';

export const formatDistanceToNow = (date) => {
  return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
};

export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = format(start, 'MMM d');
  const endFormatted = format(end, 'MMM d, yyyy');
  
  return `${startFormatted} - ${endFormatted}`;
};

export const formatShortDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy');
};
