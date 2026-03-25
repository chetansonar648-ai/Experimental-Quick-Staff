import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import loginBg from "../assets/login_background.png";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form);
      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate("/admin");
      } else if (data.user.role === 'client') {
        navigate("/client");
      } else if (data.user.role === 'worker') {
        navigate("/worker/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-[#f5f7f8] dark:bg-[#101922] text-[#111418] dark:text-[#f5f7f8]">
      <div className="relative flex min-h-screen w-full flex-col group/design-root">
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1">
            <div className="flex w-full flex-col lg:flex-row">
              <div className="relative hidden w-full flex-col items-center justify-center bg-cover bg-center lg:flex lg:w-1/2" style={{ backgroundImage: `url(${loginBg})` }}>
                <div className="absolute inset-0 bg-[#0d7ff2]/80"></div>
                <div className="relative z-10 flex flex-col items-start gap-6 p-12 text-white max-w-md">
                  <div className="text-3xl font-bold">Quick Staff</div>
                  <h1 className="text-4xl font-black leading-tight tracking-tight">Connecting Talent. Powering Business.</h1>
                  <p className="text-lg font-normal leading-relaxed opacity-90">Log in to access your dashboard, manage your team, and find your next opportunity with Quick Staff.</p>
                </div>
              </div>
              <div className="flex w-full items-center justify-center bg-[#f5f7f8] dark:bg-[#101922] p-6 sm:p-8 lg:w-1/2">
                <div className="flex w-full max-w-md flex-col gap-8 py-10">
                  <div className="flex flex-col gap-2 text-center lg:text-left">
                    <h1 className="text-3xl font-bold text-[#111418] dark:text-[#f5f7f8]">Welcome Back</h1>
                    <p className="text-[#60758a] dark:text-[#a0b0c0]">Log in to access your Quick Staff account.</p>
                  </div>
                  <form className="flex w-full flex-col gap-6" onSubmit={onSubmit}>
                    <label className="flex flex-col w-full">
                      <p className="text-sm font-medium pb-2 text-[#111418] dark:text-[#f5f7f8]">Email or Username</p>
                      <div className="flex w-full flex-1 items-stretch rounded-lg">
                        <div className="flex items-center justify-center pl-4 pr-3 border border-r-0 border-[#dbe0e6] dark:border-[#344150] rounded-l-lg bg-white dark:bg-[#101922]">
                          <span className="material-symbols-outlined text-[#60758a] dark:text-[#a0b0c0] text-base">person</span>
                        </div>
                        <input
                          name="email"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#111418] dark:text-[#f5f7f8] focus:outline-0 focus:ring-2 focus:ring-[#0d7ff2]/50 border border-[#dbe0e6] dark:border-[#344150] bg-white dark:bg-[#101922] h-12 placeholder:text-[#60758a] dark:placeholder:text-[#a0b0c0] px-3 text-base font-normal leading-normal border-l-0"
                          placeholder="e.g., yourname@example.com"
                          value={form.email}
                          onChange={onChange}
                          required
                        />
                      </div>
                    </label>
                    <label className="flex flex-col w-full">
                      <p className="text-sm font-medium pb-2 text-[#111418] dark:text-[#f5f7f8]">Password</p>
                      <div className="flex w-full flex-1 items-stretch rounded-lg">
                        <div className="flex items-center justify-center pl-4 pr-3 border border-r-0 border-[#dbe0e6] dark:border-[#344150] rounded-l-lg bg-white dark:bg-[#101922]">
                          <span className="material-symbols-outlined text-[#60758a] dark:text-[#a0b0c0] text-base">lock</span>
                        </div>
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#111418] dark:text-[#f5f7f8] focus:outline-0 focus:ring-2 focus:ring-[#0d7ff2]/50 border border-[#dbe0e6] dark:border-[#344150] bg-white dark:bg-[#101922] h-12 placeholder:text-[#60758a] dark:placeholder:text-[#a0b0c0] px-3 text-base font-normal leading-normal border-l-0 border-r-0"
                          placeholder="Enter your password"
                          value={form.password}
                          onChange={onChange}
                          required
                        />
                        <div className="flex items-center justify-center pr-4 pl-3 border border-l-0 border-[#dbe0e6] dark:border-[#344150] rounded-r-lg bg-white dark:bg-[#101922] cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                          <span className="material-symbols-outlined text-[#60758a] dark:text-[#a0b0c0] text-base">visibility</span>
                        </div>
                      </div>
                    </label>
                    {error && <div className="text-sm text-red-600">{error}</div>}
                    <div className="flex flex-wrap items-center justify-end gap-4">
                      <Link className="text-sm font-medium text-[#0d7ff2] hover:underline" to="/forgot-password">Forgot Password?</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#0d7ff2] text-white text-base font-bold leading-normal tracking-wide hover:bg-[#0d7ff2]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#f5f7f8] dark:focus:ring-offset-[#101922] focus:ring-[#0d7ff2] transition-colors duration-200"
                      >
                        <span className="truncate">{loading ? "Logging in..." : "Log In"}</span>
                      </button>
                      <p className="text-center text-sm text-[#60758a] dark:text-[#a0b0c0]">
                        New to Quick Staff? <Link className="font-bold text-[#0d7ff2] hover:underline" to="/register">Create an account</Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
