// prettier-ignore
const MONTHS = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];

// convert date from YYYY-MM-DD to MMM DD, YYYY
export function formatDate(
  input: string | { year: number; month: number; day: number },
) {
  if (!input) return "";

  let year, month, day;

  if (typeof input === "string") {
    // parse "YYYY-MM-DD"
    const parts = input.split("-");
    if (parts.length !== 3) return input; // fallback
    year = Number(parts[0]);
    month = Number(parts[1]);
    day = Number(parts[2]);
  } else if (input && typeof input === "object") {
    ({ year, month, day } = input);
  } else {
    return "";
  }

  return `${MONTHS[month - 1]} ${String(day).padStart(2, "0")}, ${year}`;
}
