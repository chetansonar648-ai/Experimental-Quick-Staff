/** Shared registration validation for worker & client signup forms. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** India mobile: exactly 10 digits (no country code). */
export const PHONE_IN_RE = /^\d{10}$/;

export function validateBaseFields(form, isGoogleUser) {
  const errors = {};

  const name = (form.name || "").trim();
  if (!name) errors.name = "Full name is required";
  else if (name.length < 3) errors.name = "Full name must be at least 3 characters";

  const email = (form.email || "").trim();
  if (!email) errors.email = "Email is required";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address";

  if (!isGoogleUser) {
    const password = form.password || "";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";

    const confirm = form.confirmPassword || "";
    if (!confirm) errors.confirmPassword = "Please confirm your password";
    else if (confirm !== password) errors.confirmPassword = "Passwords do not match";
  }

  const phoneDigits = String(form.phone || "").replace(/\D/g, "");
  if (!phoneDigits) errors.phone = "Phone is required";
  else if (!PHONE_IN_RE.test(phoneDigits)) errors.phone = "Enter a valid 10-digit mobile number";

  const address = (form.address || "").trim();
  if (!address) errors.address = "Address is required";
  else if (address.length < 5) errors.address = "Address must be at least 5 characters";

  if (!form.terms) errors.terms = "You must accept the Terms & Conditions";

  return errors;
}

export function validateWorkerFields(form, selectedService) {
  const errors = {};

  if (!selectedService) errors.service = "Please select a service";

  const rateRaw = form.hourly_rate;
  const rate = rateRaw === "" || rateRaw == null ? NaN : Number(rateRaw);
  if (rateRaw === "" || rateRaw == null) errors.hourly_rate = "Hourly rate is required";
  else if (Number.isNaN(rate) || rate <= 0) errors.hourly_rate = "Enter a valid hourly rate greater than 0";

  return errors;
}
