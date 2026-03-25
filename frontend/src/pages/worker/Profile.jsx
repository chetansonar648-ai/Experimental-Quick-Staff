import React, { useEffect, useState, useRef } from 'react';
import WorkerLayout from '../../components/WorkerLayout';
import { fetchWorkerMe, updateWorkerProfile, fetchServiceNames, uploadProfilePicture, changePassword } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WorkerProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [serviceNames, setServiceNames] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    years_of_experience: '',
    bio: '',
    address: '',
    service_location: '',
    skills: [],
    hourly_rate: '',
    availability: {},
    rating: 0,
    total_reviews: 0,
    completed_jobs: 0,
    profile_picture: ''
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    // Fetch profile and service names
    Promise.all([fetchWorkerMe(), fetchServiceNames()])
      .then(([profileData, services]) => {
        console.log('Profile Data:', profileData); // Debug log
        if (profileData) {
          setProfile({
            name: profileData.name || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            title: profileData.title || '',
            years_of_experience: profileData.years_of_experience || '',
            bio: profileData.bio || '',
            address: profileData.address || '',
            service_location: profileData.service_location || '',
            skills: profileData.skills || [],
            hourly_rate: profileData.hourly_rate || '',
            availability: profileData.availability || {},
            rating: Number(profileData.rating) || 0,
            total_reviews: Number(profileData.total_reviews) || 0,
            completed_jobs: Number(profileData.completed_jobs) || 0,
            profile_picture: profileData.profile_picture || ''
          });
        }
        setServiceNames(services || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load profile.');
        setLoading(false);
      });
  }, []);

  const updateField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (profile.skills.includes(skillInput.trim())) return;
    updateField('skills', [...profile.skills, skillInput.trim()]);
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    updateField('skills', profile.skills.filter(s => s !== skill));
  };

  const updateAvailability = (day, field, value) => {
    updateField('availability', {
      ...profile.availability,
      [day]: { ...(profile.availability?.[day] || {}), [field]: value }
    });
  };

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(\s?(AM|PM))?$/i;

  const validateAvailabilityData = () => {
    for (const day of days) {
      const times = profile.availability?.[day];
      if (!times) continue;
      const { start, end } = times;
      if (!start && !end) continue;
      if ((start && !end) || (!start && end)) {
        return `${day} must have both start and end times, or leave both empty`;
      }
      if (start && !timeRegex.test(start)) {
        return `Invalid start time for ${day}. Use format like "09:00 AM" or "09:00"`;
      }
      if (end && !timeRegex.test(end)) {
        return `Invalid end time for ${day}. Use format like "05:00 PM" or "17:00"`;
      }
    }
    return null;
  };

  const saveChanges = async () => {
    const validationError = validateAvailabilityData();
    if (validationError) {
      setError(validationError);
      showToast(validationError, 'error');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateWorkerProfile({
        name: profile.name,
        phone: profile.phone,
        title: profile.title,
        years_of_experience: Number(profile.years_of_experience) || null,
        bio: profile.bio,
        address: profile.address,
        service_location: profile.service_location,
        skills: profile.skills,
        hourly_rate: profile.hourly_rate,
        availability: profile.availability
      });
      setSuccess(true);
      showToast('Profile updated successfully', 'success');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save changes. Please try again.');
      showToast(err.message || 'Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      const result = await uploadProfilePicture(formData);
      updateField('profile_picture', result.profile_picture);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to upload profile picture.');
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      setPasswordSuccess(true);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  // Generate initials for avatar placeholder
  const getInitials = (name) => {
    if (!name) return 'W';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get profile picture URL
  const getProfilePictureUrl = () => {
    if (profile.profile_picture) {
      // If it starts with /uploads, prepend the API base URL
      if (profile.profile_picture.startsWith('/uploads')) {
        return `http://localhost:4001${profile.profile_picture}`;
      }
      return profile.profile_picture;
    }
    return null;
  };

  if (loading) {
    return (
      <WorkerLayout>
        <div className="p-8">Loading profile...</div>
      </WorkerLayout>
    );
  }

  return (
    <WorkerLayout>
      <div className="space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Profile</h2>
            <p className="text-slate-500 dark:text-slate-400">Manage your personal info, designation, skills, and availability.</p>
          </div>
          <div className="flex items-center gap-6">
          </div>
        </header>

        {/* Alerts */}
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-4 rounded-lg">Changes saved successfully!</div>}

        {/* Profile Picture & Personal Info */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Personal Information</h3>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {getProfilePictureUrl() ? (
                  <img
                    src={getProfilePictureUrl()}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-2 border-slate-200 dark:border-slate-700">
                    {getInitials(profile.name)}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">Uploading...</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureUpload}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-sm text-primary hover:text-primary/80 font-medium disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Change Photo'}
              </button>
            </div>

            {/* Personal Info Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="name">Full Name</label>
                <input
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                  id="name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="email">Email (read-only)</label>
                <input
                  className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-500 cursor-not-allowed"
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="phone">Phone</label>
                <input
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Your phone number"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                >
                  <span className="material-icons text-base">lock</span>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Designation */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Job Designation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="title">Title</label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                id="title"
                value={profile.title}
                onChange={(e) => updateField('title', e.target.value)}
              >
                <option value="">Select a title...</option>
                {serviceNames.map((name, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="experience">Years of Experience</label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                id="experience"
                type="number"
                min="0"
                value={profile.years_of_experience}
                onChange={(e) => updateField('years_of_experience', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Biography</h3>
          <div>
            <label className="sr-only" htmlFor="biography">Biography</label>
            <textarea
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
              id="biography"
              placeholder="Tell us about yourself..."
              rows="4"
              value={profile.bio}
              onChange={(e) => updateField('bio', e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="address">Address</label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                id="address"
                placeholder="e.g., 123 Main St, Anytown, USA"
                type="text"
                value={profile.address}
                onChange={(e) => updateField('address', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="service-location">Location of Service</label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                id="service-location"
                placeholder="e.g., San Francisco Bay Area"
                type="text"
                value={profile.service_location}
                onChange={(e) => updateField('service_location', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Skills */}
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
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Add a new skill and press Enter"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Hourly Rate */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Hourly Rate</h3>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 dark:text-slate-400">$</span>
              <input
                className="w-full pl-7 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                type="text"
                value={profile.hourly_rate}
                onChange={(e) => updateField('hourly_rate', e.target.value)}
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 dark:text-slate-400">/hr</span>
            </div>
          </div>
          {/* Rating */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm flex flex-col justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-800 dark:text-white">{profile.rating}</span>
              <span className="material-icons text-yellow-400">star</span>
            </div>
          </div>
          {/* Total Reviews */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm flex flex-col justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Reviews</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{profile.total_reviews}</p>
          </div>
          {/* Completed Jobs */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm flex flex-col justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Completed Jobs</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{profile.completed_jobs}</p>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Availability</h3>
          <div className="space-y-4">
            {days.map(day => (
              <div key={day} className="grid grid-cols-[100px_1fr_auto_1fr] items-center gap-4">
                <p className="font-medium">{day}</p>
                <input
                  className="w-full text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                  type="text"
                  placeholder="09:00 AM"
                  value={profile.availability?.[day]?.start || ''}
                  onChange={(e) => updateAvailability(day, 'start', e.target.value)}
                />
                <span className="text-slate-400">-</span>
                <input
                  className="w-full text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2"
                  type="text"
                  placeholder="05:00 PM"
                  value={profile.availability?.[day]?.end || ''}
                  onChange={(e) => updateAvailability(day, 'end', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={saveChanges}
            disabled={saving}
            className="bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-icons">close</span>
              </button>
            </div>

            {passwordError && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{passwordError}</div>}
            {passwordSuccess && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">Password changed successfully!</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={changingPassword}
                className="bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {changingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkerLayout>
  );
};

export default WorkerProfile;
