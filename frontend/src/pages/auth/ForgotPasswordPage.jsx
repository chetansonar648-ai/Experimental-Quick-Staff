import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'

const schema = yup.object({
  email: yup.string().email().required()
})

export default function ForgotPasswordPage () {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const [sent, setSent] = useState(false)

  const onSubmit = async () => {
    setSent(true)
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <div className="card grid" style={{ gap: 16 }}>
        <h2>Forgot password</h2>
        <p>Enter your email to receive reset instructions.</p>
        <form className="grid" style={{ gap: 12 }} onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" {...register('email')} placeholder="you@example.com" />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          <button className="btn" type="submit">Send reset link</button>
        </form>
        {sent && <div className="card" style={{ background: '#e7f3ff' }}>Check your inbox for the link.</div>}
      </div>
    </div>
  )
}

