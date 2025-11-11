//converts the given time in (seconds passed ) to Hours:Mins format

export function convertTime(secondsPassed) {
  const date = new Date(secondsPassed * 1000); //convert into milliseconds

  const timeString = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  console.log('Sunset time:', timeString);
  return timeString;
}
