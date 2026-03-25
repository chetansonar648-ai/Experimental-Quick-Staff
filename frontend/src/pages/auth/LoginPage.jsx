import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
})

export default function LoginPage () {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const [serverError, setServerError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const data = await api.login(values)
      login(data)
      navigate('/worker/dashboard')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <div className="card grid" style={{ gap: 16 }}>
        <h2>Login</h2>
        <form className="grid" style={{ gap: 12 }} onSubmit={handleSubmit(onSubmit)}>
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
          {serverError && <div className="error">{serverError}</div>}
          <button className="btn" type="submit">Sign in</button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  )
}

