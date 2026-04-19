import React, { useEffect, useState } from "react";
import WorkerLayout from "../components/WorkerLayout.jsx";
import { fetchWorkerMe, updateWorkerProfile } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WorkerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    title: "",
    years_of_experience: "",
    bio: "",
    address: "",
    service_location: "",
    skills: [],
    hourly_rate: "",
    availability: {},
    rating: 0,
    total_reviews: 0,
    completed_jobs: 0
  });

  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchWorkerMe();
        if (data) {
          setProfile({
            title: data.title || "",
            years_of_experience: data.years_of_experience || "",
            bio: data.bio || "",
            address: data.address || "",
            service_location: data.service_location || "",
            skills: data.skills || [],
            hourly_rate: data.hourly_rate || "",
            availability: data.availability || {},
            rating: Number(data.rating) || 0,
            total_reviews: Number(data.total_reviews) || 0,
            completed_jobs: Number(data.completed_jobs) || 0
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  const updateField = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (profile.skills.includes(skillInput.trim())) return;
    updateField("skills", [...profile.skills, skillInput.trim()]);
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    updateField(
      "skills",
      profile.skills.filter((s) => s !== skill)
    );
  };

  const updateAvailability = (day, key, value) => {
    updateField("availability", {
      ...profile.availability,
      [day]: { ...(profile.availability?.[day] || {}), [key]: value },
    });
  };

  const saveProfile = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      await updateWorkerProfile({
        title: profile.title,
        years_of_experience: Number(profile.years_of_experience),
        bio: profile.bio,
        skills: profile.skills,
        hourly_rate: profile.hourly_rate,
        availability: profile.availability,
        address: profile.address,
        service_location: profile.service_location
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <WorkerLayout><div className="p-8">Loading profile...</div></WorkerLayout>;

  return (
    <WorkerLayout>
      <div className="space-y-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Profile</h2>
            <p className="text-slate-500 dark:text-slate-400">Manage your designation, skills, and availability.</p>
          </div>
          <div className="flex items-center gap-6">
            <img
              alt={user?.name || "Worker"}
              className="w-10 h-10 rounded-full object-cover"
              src={user?.profile_image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDPwtuc_hyb4ynb_I6Z4OS0ujP65g16K0e9EY18uXCJad-r38E3rgtKPMIFMJ7lRgQ5SD8Kjy1Wnq4lje5sfgMcubVeGcDtJ01W7ATN58jsEseQl_sqU-8amS564T4lMppYOietAhWSm-yjDHUohXwPpOKH76z2b3rQaJpRTzMJjTxuHxtB8Ln-hm4dXW9sdrACPCCQjM84BR-N-npfPNBkyoPRoiIZnwd3C_DYaIdZJcG_xpuEYf7X-9TSbAR2eWPdwH2fYVoTxw"}
            />
          </div>
        </header>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-4">Profile saved successfully!</div>}

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Job Designation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="title">Title</label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                id="title"
                type="text"
                value={profile.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Package Handler"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="experience">Years of Experience</label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                id="experience"
                type="number"
                min="0"
                value={profile.years_of_experience}
                onChange={(e) => updateField("years_of_experience", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Biography</h3>
          <div>
            <label className="sr-only" htmlFor="biography">Biography</label>
            <textarea
              className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
              id="biography"
              placeholder="Tell us about yourself..."
              rows="4"
              value={profile.bio}
              onChange={(e) => updateField("bio", e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="address">Address</label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                id="address"
                placeholder="e.g., 123 Main St, Anytown, USA"
                type="text"
                value={profile.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="service-location">Location of Service</label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                id="service-location"
                placeholder="e.g., San Francisco Bay Area"
                type="text"
                value={profile.service_location}
                onChange={(e) => updateField("service_location", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill, idx) => (
              <span key={idx} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
                {skill}
                <button onClick={() => removeSkill(skill)} className="text-primary/70 hover:text-primary">×</button>
              </span>
            ))}
          </div>
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">add</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Add a new skill and press Enter"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Hourly Rate</h3>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 dark:text-slate-400">$</span>
              <input
                className="w-full pl-7 pr-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                type="number"
                value={profile.hourly_rate}
                onChange={(e) => updateField("hourly_rate", e.target.value)}
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 dark:text-slate-400">/hr</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm flex flex-col justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-800 dark:text-white">{profile.rating}</span>
              <span className="material-icons text-yellow-400">star</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm flex flex-col justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Reviews</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{profile.total_reviews}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm flex flex-col justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Completed Jobs</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{profile.completed_jobs}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Availability</h3>
          <div className="space-y-4">
            {days.map(day => (
              <div key={day} className="grid grid-cols-[100px_1fr_auto_1fr] items-center gap-4">
                <p className="font-medium">{day}</p>
                <input
                  className="w-full text-center bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                  type="time"
                  value={profile.availability?.[day]?.start || ""}
                  onChange={(e) => updateAvailability(day, "start", e.target.value)}
                />
                <span className="text-slate-400">-</span>
                <input
                  className="w-full text-center bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                  type="time"
                  value={profile.availability?.[day]?.end || ""}
                  onChange={(e) => updateAvailability(day, "end", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </WorkerLayout>
  );
};

export default WorkerProfile;
