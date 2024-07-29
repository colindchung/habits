export function formatDate(date: Date, format: string): string {
  const map: { [key: string]: string } = {
    YYYY: date.getFullYear().toString(),
    MM: ("0" + (date.getMonth() + 1)).slice(-2),
    DD: ("0" + date.getDate()).slice(-2),
    HH: ("0" + date.getHours()).slice(-2),
    mm: ("0" + date.getMinutes()).slice(-2),
    ss: ("0" + date.getSeconds()).slice(-2),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (matched) => map[matched]);
}

export function getWeekDatesFromDate(dateString: string): string[] {
  const inputDate = new Date(dateString + "T00:00:00Z"); // Treat the input date as UTC
  const dayOfWeek = inputDate.getUTCDay(); // 0 (Sunday) to 6 (Saturday)

  // Calculate the start (Sunday) and end (Saturday) of the week in UTC
  const startOfWeek = new Date(inputDate);
  startOfWeek.setUTCDate(inputDate.getUTCDate() - dayOfWeek);

  const endOfWeek = new Date(inputDate);
  endOfWeek.setUTCDate(inputDate.getUTCDate() + (6 - dayOfWeek));

  const dates: string[] = [];

  // Generate the dates from start to end of the week in UTC
  for (
    let date = new Date(startOfWeek);
    date <= endOfWeek;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
}
