import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateName() {
  const n1 = ["Blue", "Green", "Red", "Orange", "Violet", "Indigo", "Yellow"];
  const n2 = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Zero",
  ];
  return (
    n1[Math.round(Math.random() * (n1.length - 1))] +
    "-" +
    n2[Math.round(Math.random() * (n2.length - 1))]
  );
}

// generate random color
export function generateColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
