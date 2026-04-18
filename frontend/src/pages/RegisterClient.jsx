import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../services/api.js";

const RegisterClient = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isGoogle = useMemo(
    () => new URLSearchParams(location.search).get("google") === "true",
    [location.search]
  );
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "", address: "", terms: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const role = "client";
    const storedRole = localStorage.getItem("googleRole");
    const hasGoogleDraft =
      storedRole === role &&
      Boolean(localStorage.getItem("googleToken")) &&
      Boolean(localStorage.getItem("googleData"));
    setIsGoogleUser(hasGoogleDraft);
  }, []);

  useEffect(() => {
    const role = location.pathname.includes("worker") ? "worker" : "client";
    const storedRole = localStorage.getItem("googleRole");
    if (storedRole && storedRole !== role) return;
    if (!isGoogle && !storedRole) return;
    const stored = localStorage.getItem("googleData");
    if (!stored) return;
    try {
      const googleData = JSON.parse(stored);
      setForm((prev) => ({
        ...prev,
        name: googleData?.name || prev.name,
        email: googleData?.email || prev.email,
      }));
      if (storedRole === role) setIsGoogleUser(true);
    } catch {
      // Ignore malformed storage payload.
    }
  }, [isGoogle, location.pathname]);

  const handleGoogleRegisterSuccess = async (res) => {
    setError("");
    const role = location.pathname.includes("worker") ? "worker" : "client";
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

      // existing user: must match current role
      if (data.user.role !== role) {
        setError(`This Google account is registered as a ${data.user.role}.`);
        return;
      }

      login(data);
      navigate(role === "client" ? "/client" : "/worker/dashboard");
    } catch (err) {
      setError(err.message || "Google login failed");
    }
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isGoogleUser && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.terms) {
      setError("Please agree to the Terms and Conditions");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, terms, ...registerData } = form;
      const googleData = isGoogleUser ? JSON.parse(localStorage.getItem("googleData") || "{}") : null;
      const storedGoogleRole = localStorage.getItem("googleRole");
      const payload = {
        ...registerData,
        role: "client",
      };

      if (isGoogleUser || storedGoogleRole === "client") {
        payload.google_auth = true;
        payload.googleToken = localStorage.getItem("googleToken");
        payload.profile_image = googleData?.picture || null;
        // Ensure we don't accidentally send password fields for Google users
        delete payload.password;
      }

      await register(payload);

      if (isGoogleUser || storedGoogleRole === "client") {
        localStorage.removeItem("googleToken");
        localStorage.removeItem("googleData");
        localStorage.removeItem("googleRole");
      }

      navigate("/client");
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
          <p className="text-3xl font-black">Register as Client</p>
          <p className="text-subtle-light">Post jobs and hire top talent fast.</p>
        </div>
        <form onSubmit={onSubmit} className="w-full max-w-xl bg-white border border-gray-200 rounded-xl p-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={onChange}
                disabled={isGoogleUser}
                className={`h-11 rounded-lg border border-border-light px-3 ${
                  isGoogleUser ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
                disabled={isGoogleUser}
                className={`h-11 rounded-lg border border-border-light px-3 ${
                  isGoogleUser ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder="you@example.com"
              />
            </div>
            {!isGoogleUser && (
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
                    placeholder="Create a password"
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
            )}
            {!isGoogleUser && (
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
                    placeholder="Confirm your password"
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
            )}
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
          <div className="flex items-center">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.checked })}
              className="h-4 w-4 rounded border-border-light text-primary focus:ring-primary"
              required
            />
            <label className="ml-2 block text-sm text-neutral-subtle">
              I agree to the{" "}
              <Link className="font-medium text-primary hover:text-primary/90" to="/terms-of-service">Terms and Conditions</Link> and{" "}
              <Link className="font-medium text-primary hover:text-primary/90" to="/privacy-policy">Privacy Policy</Link>
            </label>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {/* <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleRegisterSuccess}
              onError={() => setError("Google login failed")}
            />
          </div> */}
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
    </div>
  );
};

export default RegisterClient;

