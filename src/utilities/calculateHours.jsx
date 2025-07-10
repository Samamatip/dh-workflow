// Utility function to calculate hours worked, including overnight shifts
export function calculateHours(startTime, endTime) {
  if (!startTime || !endTime) {
    return 0;
  }

  const start = new Date(`1970-01-01T${startTime}:00`);
  let end = new Date(`1970-01-01T${endTime}:00`);
  
  // If end time is before start time, it means the shift goes to the next day
  if (end <= start) {
    end = new Date(`1970-01-02T${endTime}:00`); // Add one day
  }
  
  const diff = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
  return Math.round(diff * 100) / 100; // Round to 2 decimal places
}

// Alternative version that returns a formatted string
export function calculateHoursFormatted(startTime, endTime) {
  const hours = calculateHours(startTime, endTime);
  return hours === 1 ? `${hours} hour` : `${hours} hours`;
}
