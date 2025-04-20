// Format a date string to DD/MM/YYYY
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Add months to a date and return new date string
export const addMonths = (dateString: string, months: number): string => {
  const date = new Date(dateString);
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
};

// Calculate days remaining until a date
export const daysRemaining = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const currentDate = new Date();
  
  // Reset time part to compare dates only
  targetDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  const differenceInTime = targetDate.getTime() - currentDate.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
  return differenceInDays > 0 ? differenceInDays : 0;
};

// Check if a date is in the past
export const isExpired = (dateString: string): boolean => {
  const targetDate = new Date(dateString);
  const currentDate = new Date();
  
  // Reset time part to compare dates only
  targetDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  return targetDate < currentDate;
};

// Get current date as ISO string
export const getCurrentDate = (): string => {
  return new Date().toISOString();
};

// Generate a date range for weekly view
export const getWeekDates = (currentDate: Date = new Date()): Date[] => {
  const dates = [];
  const startOfWeek = new Date(currentDate);
  
  // Adjust to start of week (Sunday)
  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
  
  // Generate 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};