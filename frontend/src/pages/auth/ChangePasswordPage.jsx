import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { api } from '../../services/api'

const schema = yup.object({
  current_password: yup.string().required(),
  new_password: yup.string().min(6).required(),
  confirm_password: yup.string().oneOf([yup.ref('new_password')], 'Passwords must match')
})

export default function ChangePasswordPage () {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: yupResolver(schema) })
  const [message, setMessage] = useState('')
  const [serverError, setServerError] = useState('')

  const onSubmit = async (values) => {
    setServerError('')
    setMessage('')
    try {
      await api.changePassword({ current_password: values.current_password, new_password: values.new_password })
      setMessage('Password updated.')
      reset({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 960 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
        <div className="card" style={{ background: '#005a9c', color: '#fff' }}>
          <h2 style={{ margin: '0 0 10px' }}>Secure Your Account. Update Your Password.</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)' }}>Use a strong, unique password to protect your information.</p>
        </div>
        <div className="card" style={{ border: '1px solid #e5e8ef' }}>
          <h3 style={{ marginTop: 0 }}>Change Password</h3>
          <form className="grid" style={{ gap: 12, marginTop: 12 }} onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" {...register('current_password')} placeholder="Enter current password" />
              {errors.current_password && <span className="error">{errors.current_password.message}</span>}
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" {...register('new_password')} placeholder="Enter new password" />
              {errors.new_password && <span className="error">{errors.new_password.message}</span>}
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" {...register('confirm_password')} placeholder="Confirm new password" />
              {errors.confirm_password && <span className="error">{errors.confirm_password.message}</span>}
            </div>
            <div style={{ fontSize: 13, color: '#617c89' }}>
              Password must contain: at least 8 characters, upper & lower case letters, and a number.
            </div>
            {serverError && <div className="error">{serverError}</div>}
            <button className="btn" type="submit">Change Password</button>
          </form>
          {message && <div className="card" style={{ background: '#e7f3ff', marginTop: 12 }}>{message}</div>}
        </div>
      </div>
    </div>
  )
}

