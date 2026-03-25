import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const schema = yup.object({
  name: yup.string().required('Full name required'),
  email: yup.string().email().required('Email required'),
  password: yup.string().min(6).required('Password required'),
  confirm: yup.string().oneOf([yup.ref('password')], 'Passwords must match')
})

export default function ClientRegisterPage () {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const data = await api.register({ name: values.name, email: values.email, password: values.password, role: 'client' })
      login(data)
      navigate('/')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'center' }}>
        <div className="card" style={{ border: '1px solid #e5e8ef', background: '#fff' }}>
          <h2 style={{ fontSize: 30, margin: '0 0 8px' }}>Create Your Client Account</h2>
          <p style={{ color: '#617c89', marginTop: 0 }}>Sign up to post jobs and hire top talent instantly.</p>
          <form className="grid" style={{ gap: 12, marginTop: 16 }} onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Full Name</label>
              <input {...register('name')} placeholder="Enter your full name" />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" {...register('email')} placeholder="Enter your email" />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" {...register('password')} placeholder="Create a password" />
              {errors.password && <span className="error">{errors.password.message}</span>}
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" {...register('confirm')} placeholder="Confirm password" />
              {errors.confirm && <span className="error">{errors.confirm.message}</span>}
            </div>
            <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14, color: '#617c89' }}>
              <input type="checkbox" style={{ width: 16, height: 16, marginTop: 2 }} />
              I agree to the <a href="#" style={{ color: '#005a9c', fontWeight: 700 }}>Terms</a> and <a href="#" style={{ color: '#005a9c', fontWeight: 700 }}>Privacy Policy</a>.
            </label>
            {serverError && <div className="error">{serverError}</div>}
            <button className="btn" type="submit">Create Client Account</button>
          </form>
          <p style={{ color: '#617c89', marginTop: 12 }}>Already have an account? <Link to="/login" style={{ color: '#005a9c', fontWeight: 700 }}>Login here</Link></p>
        </div>

        <div className="card" style={{ background: '#f4f7f9', border: '1px solid #e5e8ef' }}>
          <div style={{ aspectRatio: '1/1', backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuA6SSv1L28FFGZMWp9VGeMlQf53dPJ6CvAm7VKfiZLM7tZ1B-U_Wuq6nOOtuwRjX-t6RgqHe30FEbgzm6iHDztGLJDc-6v93cZLHrGWj7l9TsQ7NI8HCBCTxQFioktA1TrwdFQh0KjTHQzmi_YEJNZb1l94ltNh_0oYuergT8rR97s46LuVcoXWTEA4Po1Gc8PgM8Q3AmKpLm6djjc98NYZrSbxZ2OlN5SeVYBBxksXVhNVWT00QyCV6MEun_IGhfEbw1d8ekfovg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 12, marginBottom: 16 }} />
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Find skilled gig workers, fast.</h3>
          <p style={{ color: '#617c89', marginTop: 8 }}>Your on-demand workforce awaits.</p>
        </div>
      </div>
    </div>
  )
}

