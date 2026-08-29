export function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value) {
  if (!value.trim()) return "Email is required.";
  if (!EMAIL_RE.test(value)) return "Enter a valid email address.";
  return "";
}

export function validatePassword(value) {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  return "";
}

export function validateRequired(value, label = "This field") {
  if (!String(value ?? "").trim()) return `${label} is required.`;
  return "";
}

export function validateCardNumber(value) {
  const digits = value.replace(/\s+/g, "");
  if (!digits) return "Card number is required.";
  if (!/^\d{13,19}$/.test(digits)) return "Enter a valid card number.";
  return "";
}

export function validateExpiry(value) {
  if (!value) return "Expiry is required.";
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim());
  if (!match) return "Use MM/YY format.";
  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);
  if (month < 1 || month > 12) return "Enter a valid month.";
  const now = new Date();
  const expiry = new Date(year, month);
  if (expiry < now) return "Card has expired.";
  return "";
}

export function validateCvc(value) {
  if (!value) return "CVC is required.";
  if (!/^\d{3,4}$/.test(value)) return "Enter a valid CVC.";
  return "";
}

export function validateZip(value) {
  if (!String(value ?? "").trim()) return "ZIP / postal code is required.";
  return "";
}
