export function formatSeconds (seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);

    let timeString = '';

    if (hours > 0) {
        timeString += `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        timeString += `${minutes}m ${sec}s`;
    } else {
        timeString += `${sec}s`;
    }

    return timeString;
};

export function getSecondsToday() {
  let d = new Date();
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
}