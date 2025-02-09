import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPastMonday() {
  const prevMonday = new Date();
  prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
  return prevMonday;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function tryCatch<T>(
  promise: Promise<T>,
): Promise<{ error: false; data: T } | { error: any }> {
  return promise
    .then((data) => ({ error: false, data }))
    .catch((error) => ({ error }));
}
