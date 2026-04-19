import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { api } from '../../services/api'

const schema = yup.object({
  email: yup.string().email().required(),
  otp: yup.string().length(6).optional()
})

export default function VerifyEmailPage () {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const [step, setStep] = useState(1)
  const [message, setMessage] = useState('')
  const [serverError, setServerError] = useState('')

  const onSubmit = async (values) => {
    setServerError('')
    setMessage('')
    try {
      if (step === 1) {
        await api.requestOtp({ email: values.email, purpose: 'verify_email' })
        setStep(2)
        setMessage('OTP sent to your email.')
      } else {
        await api.verifyOtp({ email: values.email, code: values.otp })
        setMessage('Email verified successfully.')
      }
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 520 }}>
      <div className="card" style={{ border: '1px solid #e5e8ef' }}>
        <h2 style={{ marginTop: 0 }}>Verify Your Email</h2>
        <p style={{ color: '#617c89' }}>Enter your email to receive a verification code.</p>
        <form className="grid" style={{ gap: 12, marginTop: 12 }} onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" {...register('email')} placeholder="Enter your email" />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          {step === 2 && (
            <div className="form-group">
              <label>Verification Code</label>
              <input maxLength="6" {...register('otp')} placeholder="Enter 6-digit code" />
              {errors.otp && <span className="error">{errors.otp.message}</span>}
            </div>
          )}
          {serverError && <div className="error">{serverError}</div>}
          <button className="btn" type="submit">{step === 1 ? 'Send OTP' : 'Verify OTP'}</button>
        </form>
        {message && <div className="card" style={{ background: '#e7f3ff', marginTop: 12 }}>{message}</div>}
      </div>
    </div>
  )
}

