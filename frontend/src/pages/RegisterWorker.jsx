import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../services/api.js";
import { validateBaseFields, validateWorkerFields } from "../utils/registrationValidation.js";

const RegisterWorker = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isGoogle = useMemo(
    () => new URLSearchParams(location.search).get("google") === "true",
    [location.search]
  );
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    hourly_rate: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-navigate to login after 3 seconds when success popup is shown
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/worker/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  const handleSuccessClose = () => {
    navigate("/worker/dashboard");
  };

  useEffect(() => {
    const role = "worker";
    const storedRole = localStorage.getItem("googleRole");
    if (storedRole && storedRole !== role) return;
    if (!isGoogle && !storedRole) return;
    const token = localStorage.getItem("googleToken");
    const stored = localStorage.getItem("googleData");
    if (!token || !stored) return;
    try {
      const googleData = JSON.parse(stored);
      setForm((prev) => ({
        ...prev,
        name: googleData?.name || prev.name,
        email: googleData?.email || prev.email,
      }));
      if (storedRole === role || (isGoogle && token)) setIsGoogleUser(true);
    } catch {
      // Ignore malformed storage payload.
    }
  }, [isGoogle, location.pathname]);

  useEffect(() => {
    api
      .services()
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]));
  }, []);

  const handleGoogleRegisterSuccess = async (res) => {
    setError("");
    const role = "worker";
    try {
      const data = await api.googleAuth(res.credential);

      if (data?.isNewUser) {
        localStorage.setItem("googleToken", res.credential);
        localStorage.setItem("googleData", JSON.stringify(data.googleData || {}));
        localStorage.setItem("googleRole", role);
        setIsGoogleUser(true);
        setForm((prev) => ({
          ...prev,
          name: data.googleData?.name || prev.name,
          email: data.googleData?.email || prev.email,
        }));
        return;
      }

      if (!data?.token || !data?.user) {
        setError("Google login failed");
        return;
      }

      if (data.user.role !== role) {
        setError(`This Google account is registered as a ${data.user.role}.`);
        return;
      }

      login(data);
      navigate("/worker/dashboard");
    } catch (err) {
      setError(err.message || "Google login failed");
    }
  };
  const clearGoogleAuthData = () => {
    localStorage.removeItem("googleToken");
    localStorage.removeItem("googleData");
    localStorage.removeItem("googleRole");
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: next }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const baseErr = validateBaseFields(form, isGoogleUser);
    const workerErr = validateWorkerFields(form, selectedService);
    const merged = { ...baseErr, ...workerErr };
    if (Object.keys(merged).length) {
      setFieldErrors(merged);
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      const { confirmPassword, terms, hourly_rate, ...rest } = form;
      const phoneDigits = String(form.phone || "").replace(/\D/g, "").slice(0, 10);
      const hourlyRateNum = hourly_rate === "" || hourly_rate == null ? null : parseFloat(hourly_rate);
      const googleData = isGoogleUser ? JSON.parse(localStorage.getItem("googleData") || "{}") : null;
      const storedGoogleRole = localStorage.getItem("googleRole");
      const payload = {
        ...rest,
        phone: phoneDigits,
        hourly_rate: hourlyRateNum,
        role: "worker",
        service_id: selectedService ? Number(selectedService) : null,
      };

      if (isGoogleUser || storedGoogleRole === "worker") {
        payload.google_auth = true;
        payload.googleToken = localStorage.getItem("googleToken");
        payload.profile_image = googleData?.picture || null;
        delete payload.password;
      }

      await register(payload);
      if (isGoogleUser || storedGoogleRole === "worker") {
        clearGoogleAuthData();
      }
      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold">Quick Staff</h2>
        </div>
        <Link
          to="/login"
          className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90"
        >
          Login
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="text-center mb-8">
          <p className="text-3xl font-black">Register as Gig Worker</p>
          <p className="text-subtle-light">Showcase your skills and get hired fast.</p>
        </div>
        <form noValidate onSubmit={onSubmit} className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl p-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                disabled={isGoogleUser}
                className={`h-11 rounded-lg border border-border-light px-3 ${
                  fieldErrors.name ? "border-red-500" : ""
                } ${isGoogleUser ? "bg-gray-100 cursor-not-allowed" : ""}`}
                placeholder="Jane Doe"
              />
              {fieldErrors.name && <p className="text-sm text-red-600">{fieldErrors.name}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={onChange}
                disabled={isGoogleUser}
                className={`h-11 rounded-lg border border-border-light px-3 ${
                  fieldErrors.email ? "border-red-500" : ""
                } ${isGoogleUser ? "bg-gray-100 cursor-not-allowed" : ""}`}
                placeholder="you@example.com"
              />
              {fieldErrors.email && <p className="text-sm text-red-600">{fieldErrors.email}</p>}
            </div>
            {!isGoogleUser && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={onChange}
                    className={`h-11 w-full rounded-lg border border-border-light px-3 pr-10 ${
                      fieldErrors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </div>
                {fieldErrors.password && <p className="text-sm text-red-600">{fieldErrors.password}</p>}
              </div>
            )}
            {!isGoogleUser && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={onChange}
                    className={`h-11 w-full rounded-lg border border-border-light px-3 pr-10 ${
                      fieldErrors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Phone</label>
              <input
                name="phone"
                inputMode="numeric"
                autoComplete="tel"
                value={form.phone}
                onChange={onChange}
                className={`h-11 rounded-lg border border-border-light px-3 ${
                  fieldErrors.phone ? "border-red-500" : ""
                }`}
                placeholder="10-digit mobile number"
              />
              {fieldErrors.phone && <p className="text-sm text-red-600">{fieldErrors.phone}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={onChange}
              className={`rounded-lg border border-border-light px-3 py-2 ${
                fieldErrors.address ? "border-red-500" : ""
              }`}
              placeholder="Street, City, State"
            />
            {fieldErrors.address && <p className="text-sm text-red-600">{fieldErrors.address}</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Service</label>
              <select
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  if (fieldErrors.service) setFieldErrors((prev) => ({ ...prev, service: undefined }));
                }}
                className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.service ? "border-red-500" : "border-gray-200"
                }`}
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              {fieldErrors.service && <p className="text-sm text-red-600">{fieldErrors.service}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Hourly Rate (USD)</label>
              <input
                name="hourly_rate"
                inputMode="decimal"
                value={form.hourly_rate}
                onChange={onChange}
                className={`h-11 rounded-lg border border-border-light px-3 ${
                  fieldErrors.hourly_rate ? "border-red-500" : ""
                }`}
                placeholder="25"
              />
              {fieldErrors.hourly_rate && (
                <p className="text-sm text-red-600">{fieldErrors.hourly_rate}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-x-2">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={onChange}
                className="mt-0.5 h-4 w-4 rounded border-border-light bg-transparent text-primary checked:border-primary checked:bg-primary focus:ring-1 focus:ring-primary focus:ring-offset-1"
              />
              <label className="text-sm font-normal text-text-light dark:text-text-dark">
                I agree to the <Link className="font-medium text-primary hover:underline" to="/terms-of-service">Terms & Conditions</Link> and{" "}
                <Link className="font-medium text-primary hover:underline" to="/privacy-policy">Privacy Policy</Link>.
              </label>
            </div>
            {fieldErrors.terms && <p className="text-sm text-red-600">{fieldErrors.terms}</p>}
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleRegisterSuccess}
              onError={() => setError("Google login failed")}
            />
          </div>
        </form>
      </main>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">Your account has been created successfully. You will be redirected to the login page shortly.</p>
            <button
              onClick={handleSuccessClose}
              className="h-12 w-full bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterWorker;

