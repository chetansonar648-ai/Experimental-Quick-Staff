import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  role: yup.string().oneOf(['client', 'worker']).required()
})

export default function RegisterPage () {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const [serverError, setServerError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const data = await api.register(values)
      login(data)
      navigate(values.role === 'worker' ? '/worker/dashboard' : '/')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 520 }}>
      <div className="card grid" style={{ gap: 16 }}>
        <h2>Create your account</h2>
        <form className="grid" style={{ gap: 12 }} onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Full name</label>
            <input {...register('name')} placeholder="Jane Doe" />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" {...register('email')} placeholder="you@example.com" />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" {...register('password')} placeholder="••••••" />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          <div className="form-group">
            <label>I am a</label>
            <select {...register('role')}>
              <option value="worker">Worker</option>
              <option value="client">Client</option>
            </select>
            {errors.role && <span className="error">{errors.role.message}</span>}
          </div>
          {serverError && <div className="error">{serverError}</div>}
          <button className="btn" type="submit">Create account</button>
        </form>
        <Link to="/login">Already have an account? Sign in</Link>
      </div>
    </div>
  )
}

