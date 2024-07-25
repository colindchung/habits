import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseUrlQueryParams(url: string) {
  // Parse the URL string
  const urlObj = new URL(url);

  // Get the search parameters
  const searchParams = new URLSearchParams(urlObj.search);

  // Create an object to hold the query parameters
  const queryParams: { [key: string]: string } = {};

  // Iterate over the search parameters and add them to the object
  searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return queryParams;
}
