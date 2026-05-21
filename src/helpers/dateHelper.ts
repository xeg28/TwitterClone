
export const getDateJoined = (d: Date | String | undefined): string => {
  if (!d) return "";

  const date = typeof d === "string" ? new Date(d) : d;
  // invalid date guard
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(date); // e.g. "August"
  return `${month} ${year}`;
}

export const getPostTime = (d: Date | String | undefined): string => {
  const date = typeof d === "string" ? new Date(d) : d;
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffSeconds < 60) {
    return `${diffSeconds}s`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else {
    const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
    const day = date.getDate();
    const year = date.getFullYear();
    const currentYear = now.getFullYear();
    if (year === currentYear) {
      return `${month} ${day}`;
    } else {
      return `${month} ${day}, ${year}`;
    }
  }
}

export const getPostDateTime = (d: Date | String | undefined) => {
  const date = typeof d === "string" ? new Date(d) : d;
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const dateString = date.toLocaleDateString("en-US", {
    month: "short",  // "May"
    day: "numeric",  // "6"
    year: "numeric", // "2026"
  });

  return `${time} · ${dateString}`;
}