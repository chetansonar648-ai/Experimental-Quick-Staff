import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterWorker = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    skills: "",
    hourly_rate: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-navigate to login after 3 seconds when success popup is shown
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  const handleSuccessClose = () => {
    navigate("/login");
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.terms) {
      setError("Please agree to the Terms and Conditions");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, terms, skills, hourly_rate, ...rest } = form;
      // Convert skills from comma-separated string to array
      const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
      // Convert hourly_rate to number
      const hourlyRateNum = hourly_rate ? parseFloat(hourly_rate) : null;
      await register({ ...rest, skills: skillsArray, hourly_rate: hourlyRateNum, role: "worker" });
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
        <form onSubmit={onSubmit} className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl p-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={onChange}
                className="h-11 rounded-lg border border-border-light px-3"
                placeholder="Jane Doe"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                className="h-11 rounded-lg border border-border-light px-3"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={onChange}
                  className="h-11 w-full rounded-lg border border-border-light px-3 pr-10"
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
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={onChange}
                  className="h-11 w-full rounded-lg border border-border-light px-3 pr-10"
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
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="h-11 rounded-lg border border-border-light px-3"
                placeholder="(555) 555-5555"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={onChange}
              className="rounded-lg border border-border-light px-3 py-2"
              placeholder="Street, City, State"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Skills (comma separated)</label>
              <input
                name="skills"
                value={form.skills}
                onChange={onChange}
                className="h-11 rounded-lg border border-border-light px-3"
                placeholder="Bartending, Warehouse"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Hourly Rate (USD)</label>
              <input
                name="hourly_rate"
                value={form.hourly_rate}
                onChange={onChange}
                className="h-11 rounded-lg border border-border-light px-3"
                placeholder="25"
              />
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.checked })}
              className="h-4 w-4 rounded border-border-light bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-1 focus:ring-offset-1 focus:ring-primary mt-0.5"
              required
            />
            <label className="text-sm font-normal text-text-light dark:text-text-dark">
              I agree to the <Link className="font-medium text-primary hover:underline" to="/terms-of-service">Terms & Conditions</Link> and{" "}
              <Link className="font-medium text-primary hover:underline" to="/privacy-policy">Privacy Policy</Link>.
            </label>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
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

