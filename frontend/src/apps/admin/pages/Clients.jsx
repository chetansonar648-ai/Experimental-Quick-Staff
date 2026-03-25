import { useState, useEffect } from 'react'
import './Clients.css'

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  // --- OPEN ADD CLIENT MODAL ---
  const handleAddClient = () => setShowAddModal(true)

  // --- TOGGLE STATUS ---
  const toggleClientStatus = async (id, currentStatus) => {
    const isActive = currentStatus !== 'Active'
    try {
      const res = await fetch(`${apiBase}/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive })
      })
      if (!res.ok) throw new Error('Failed to update status')

      setClients(prev => prev.map(c => c.id === id ? { ...c, status: isActive ? 'Active' : 'Inactive' } : c))
    } catch (err) {
      console.error(err)
      alert('Could not update status')
    }
  }

  // --- CREATE A NEW CLIENT ---
  const submitClient = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      const res = await fetch(`${apiBase}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: 'client',
          password: 'TempPassword123!'  // you can change this
        })
      })

      if (!res.ok) throw new Error('Failed to create client')

      const created = await res.json()

      // UPDATE UI
      setClients(prev => [
        {
          id: created.id,
          name: created.name,
          email: created.email,
          phone: created.phone,
          status: created.is_active ? 'Active' : 'Inactive',
          bookings: 0,
          spent: '$0'
        },
        ...prev
      ])

      setShowAddModal(false)
      setForm({ name: '', email: '', phone: '' })
      setError('')
    } catch (err) {
      console.error(err)
      setError('Could not add client.')
    } finally {
      setLoading(false)
    }
  }

  // --- GET ALL CLIENTS ---
  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await fetch(`${apiBase}/clients`)
        if (!res.ok) throw new Error('Failed to load clients')

        const data = await res.json()

        setClients(
          data.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            status: c.is_active ? 'Active' : 'Inactive',
            bookings: c.bookings ?? 0,
            spent: c.spent ?? '$0'
          }))
        )

        setError('')
      } catch (err) {
        console.error(err)
        setError('Could not load clients.')
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="clients-page">
      <div className="page-header">
        <h2>Client Management</h2>
        <p>Manage client records, contacts, and spend</p>
      </div>

      <div className="clients-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <button className="add-btn" onClick={handleAddClient}>+ Add Client</button>
      </div>

      <div className="clients-table-container">
        {loading && <div className="no-results"><p>Loading clients...</p></div>}
        {error && !loading && <div className="no-results"><p>{error}</p></div>}

        {!loading && !error && (
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Bookings</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>
                    <span
                      className={`status-badge status-${c.status.toLowerCase()}`}
                      onClick={() => toggleClientStatus(c.id, c.status)}
                      style={{ cursor: 'pointer' }}
                      title="Click to toggle status"
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>{c.bookings}</td>
                  <td className="amount-cell">{c.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD CLIENT MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h3>Add Client</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form className="modal-form" onSubmit={submitClient}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Save</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}

export default Clients
