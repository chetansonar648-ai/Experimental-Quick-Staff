import { Link } from 'react-router-dom'

export default function RegisterChoicePage () {
  return (
    <div className="page" style={{ maxWidth: 960 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, color: '#13a4ec' }}>
            <svg fill="currentColor" viewBox="0 0 48 48"><path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd" /></svg>
          </div>
          <h2 style={{ margin: 0 }}>Quick Staff</h2>
        </div>
        <Link to="/login" className="btn">Login</Link>
      </header>

      <section style={{ textAlign: 'center', margin: '32px 0' }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, margin: 0 }}>Join Quick Staff</h1>
        <p style={{ color: '#617c89', marginTop: 8 }}>Choose your path below. Hire professionals or find your next gig in minutes.</p>
      </section>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
        <div className="card" style={{ textAlign: 'center', border: '1px solid #e5e8ef' }}>
          <div style={{ color: '#13a4ec', fontSize: 50 }} className="material-symbols-outlined">business_center</div>
          <h3 style={{ marginBottom: 6 }}>I&apos;m a Client</h3>
          <p style={{ color: '#617c89', marginTop: 0 }}>Post jobs, find skilled professionals, and manage projects with ease.</p>
          <Link to="/register/client" className="btn" style={{ marginTop: 10 }}>Register as a Client</Link>
        </div>
        <div className="card" style={{ textAlign: 'center', border: '1px solid #e5e8ef' }}>
          <div style={{ color: '#13a4ec', fontSize: 50 }} className="material-symbols-outlined">construction</div>
          <h3 style={{ marginBottom: 6 }}>I&apos;m a Gig Worker</h3>
          <p style={{ color: '#617c89', marginTop: 0 }}>Showcase your skills, find flexible work opportunities, and connect with clients.</p>
          <Link to="/register/worker" className="btn" style={{ marginTop: 10 }}>Register as a Gig Worker</Link>
        </div>
      </div>

      <footer style={{ textAlign: 'center', color: '#617c89', marginTop: 32, borderTop: '1px solid #e5e8ef', paddingTop: 16 }}>
        © 2024 Quick Staff. All rights reserved.
      </footer>
    </div>
  )
}

