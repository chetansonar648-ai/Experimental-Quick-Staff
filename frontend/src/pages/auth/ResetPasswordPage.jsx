import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const schema = yup.object({
  password: yup.string().min(6).required(),
  confirm: yup.string().oneOf([yup.ref('password')], 'Passwords must match')
})

export default function ResetPasswordPage () {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const [done, setDone] = useState(false)
  const [params] = useSearchParams()
  const token = params.get('token')

  const onSubmit = async () => {
    if (!token) return
    setDone(true)
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <div className="card grid" style={{ gap: 16 }}>
        <h2>Reset password</h2>
        <form className="grid" style={{ gap: 12 }} onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>New password</label>
            <input type="password" {...register('password')} placeholder="••••••" />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input type="password" {...register('confirm')} placeholder="••••••" />
            {errors.confirm && <span className="error">{errors.confirm.message}</span>}
          </div>
          <button className="btn" type="submit">Update password</button>
        </form>
        {done && <div className="card" style={{ background: '#e7f3ff' }}>Password updated.</div>}
      </div>
    </div>
  )
}

