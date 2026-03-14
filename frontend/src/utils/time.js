/**
 * The backend runs in UTC and returns LocalDateTime values
 * without timezone info (e.g. "2026-03-14T08:49:00").
 * We append 'Z' so the browser knows it's UTC, then
 * convert to IST (Asia/Kolkata) for display.
 */
function toUTCDate(dateStr) {
  if (!dateStr) return new Date();
  // If it already has timezone info, use as-is; otherwise treat as UTC
  if (dateStr.endsWith('Z') || dateStr.includes('+') || dateStr.includes('-', 10)) {
    return new Date(dateStr);
  }
  return new Date(dateStr + 'Z');
}

export function formatTime(dateStr) {
  return toUTCDate(dateStr).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function formatTimeShort(dateStr) {
  return toUTCDate(dateStr).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatChartTime(dateStr) {
  return toUTCDate(dateStr).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
