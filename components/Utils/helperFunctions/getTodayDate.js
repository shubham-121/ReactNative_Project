export function getTodayDate(dateStr) {
  //   const date = dateStr.split('-')[2];
  const date = new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });

  // console.log('Date splited:', date);
  return date;
}

//function return the Date like : 4 November
//takes in dateString in YY:MM:DD format, convert string to date obj first then extract the date reqd
