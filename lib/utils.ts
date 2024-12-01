import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCount(views: number): string {
  if (views < 1000) return views.toString();
  if (views < 1_000_000) return (views / 1000).toFixed(1) + 'k';
  if (views < 1_000_000_000) return (views / 1_000_000).toFixed(1) + 'M';
  return (views / 1_000_000_000).toFixed(1) + 'B';
}