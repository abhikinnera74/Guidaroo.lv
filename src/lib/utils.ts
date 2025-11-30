import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format numbers as Indian Rupees (INR). Use Intl.NumberFormat so values
// are displayed consistently across the app. Example: formatCurrency(1500)
// -> "₹1,500.00"
export function formatCurrency(value: number | null | undefined, options?: { maximumFractionDigits?: number }) {
  if (value === null || value === undefined || Number.isNaN(value)) return "₹0";
  const nf = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  });
  return nf.format(value);
}
