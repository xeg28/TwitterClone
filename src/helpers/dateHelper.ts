
export const getDateJoined = (d: Date | String | undefined): string => {
  if (!d) return "";

  const date = typeof d === "string" ? new Date(d) : d;
  // invalid date guard
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(date); // e.g. "August"
  return `${month} ${year}`;
} 