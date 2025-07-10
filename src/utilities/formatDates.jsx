export function formatLocalDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// Helper to get 'YYYY-MM' from ISO date
export function getYearMonthISO(isoString) {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 7); // 'YYYY-MM'
}

// Helper to format 'Month Year' from ISO date or 'YYYY-MM'
export function formatMonthYear(isoOrYearMonth) {
  let date;
  if (isoOrYearMonth.length === 7) {
    // 'YYYY-MM'
    date = new Date(isoOrYearMonth + '-01T00:00:00.000Z');
  } else {
    date = new Date(isoOrYearMonth);
  }
  return date.toLocaleString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}


//get day of the week
// Helper to get day of the week from ISO string or Date
export function getDayOfWeek(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-GB', { weekday: 'long' });
};