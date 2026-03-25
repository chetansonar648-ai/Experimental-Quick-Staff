import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const schema = yup.object({
  name: yup.string().required('Full name required'),
  skills: yup.string().required('Profession / skills required'),
  email: yup.string().email().required('Email required'),
  password: yup.string().min(6).required('Password required'),
  confirm: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
  summary: yup.string().max(500).optional(),
  primarySkill: yup.string().optional()
})

export default function WorkerRegisterPage () {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const data = await api.register({ name: values.name, email: values.email, password: values.password, role: 'worker' })
      // store initial skills info in profile
      await api.saveWorkerProfile({
        bio: values.summary || '',
        skills: (values.primarySkill ? [values.primarySkill] : []).concat(values.skills.split(',').map((s) => s.trim()).filter(Boolean))
      })
      login(data)
      navigate('/worker/dashboard')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'center' }}>
        <div className="card" style={{ background: '#005a9c', color: '#fff' }}>
          <h2 style={{ margin: '0 0 8px' }}>Unlock Your Potential. Find Your Next Opportunity.</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
            Join our network of skilled professionals and connect with top clients looking for your expertise. Create your worker account today.
          </p>
        </div>

        <div className="card" style={{ border: '1px solid #e5e8ef' }}>
          <h2 style={{ margin: '0 0 8px' }}>Create Worker Account</h2>
          <p style={{ color: '#617c89', marginTop: 0 }}>Fill in your details to get started.</p>
          <form className="grid" style={{ gap: 12, marginTop: 12 }} onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Full Name</label>
              <input {...register('name')} placeholder="e.g., John Doe" />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label>Profession / Skills</label>
              <input {...register('skills')} placeholder="e.g., Electrician, Graphic Designer" />
              {errors.skills && <span className="error">{errors.skills.message}</span>}
            </div>
            <div className="form-group">
              <label>Primary Skill</label>
              <select {...register('primarySkill')} defaultValue="">
                <option value="" disabled>Select your primary skill...</option>
                <option value="cleaning">House Cleaning</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical Repair</option>
                <option value="gardening">Gardening & Landscaping</option>
                <option value="handyman">Handyman Services</option>
                <option value="painting">Painting</option>
                <option value="moving">Moving Services</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Professional Summary</label>
              <textarea rows="3" {...register('summary')} placeholder="Tell clients about your experience and areas you serve." />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" {...register('email')} placeholder="you@example.com" />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" {...register('password')} placeholder="Create a strong password" />
              {errors.password && <span className="error">{errors.password.message}</span>}
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" {...register('confirm')} placeholder="Repeat your password" />
              {errors.confirm && <span className="error">{errors.confirm.message}</span>}
            </div>
            <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14, color: '#617c89' }}>
              <input type="checkbox" style={{ width: 16, height: 16, marginTop: 2 }} />
              I agree to the <a href="#" style={{ color: '#005a9c', fontWeight: 700 }}>Terms & Conditions</a> and <a href="#" style={{ color: '#005a9c', fontWeight: 700 }}>Privacy Policy</a>.
            </label>
            {serverError && <div className="error">{serverError}</div>}
            <button className="btn" type="submit">Register as Worker</button>
          </form>
          <p style={{ color: '#617c89', marginTop: 12 }}>Already have an account? <Link to="/login" style={{ color: '#005a9c', fontWeight: 700 }}>Log in</Link></p>
        </div>
      </div>
    </div>
  )
}

