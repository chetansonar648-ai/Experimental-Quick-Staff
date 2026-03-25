import { useState, useEffect } from 'react'
import './Bookings.css'

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('bookings') // 'bookings' | 'requests'

  // --- BOOKINGS STATE ---
  const [searchTerm, setSearchTerm] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState({
    client_id: '', worker_id: '', service_id: '',
    booking_date: '', duration_hours: '', total_price: '',
    status: 'pending', payment_status: 'pending', payment_method: '',
  })

  // --- REQUESTS STATE ---
  const [requests, setRequests] = useState([])
  const [reqFilterStatus, setReqFilterStatus] = useState('All')
  const [reqStartDate, setReqStartDate] = useState('')
  const [reqEndDate, setReqEndDate] = useState('')
  const [showReqModal, setShowReqModal] = useState(false)
  const [reqForm, setReqForm] = useState({
    client_id: '', worker_id: '', service_id: '',
    title: '', description: '', requested_date: '',
    preferred_time: 'Morning', budget: '', status: 'pending'
  })

  // --- SHARED DATA ---
  const [clients, setClients] = useState([])
  const [dbWorkers, setDbWorkers] = useState([])
  const [services, setServices] = useState([])

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  // Initial Data Load
  useEffect(() => {
    fetchSharedData()
    fetchBookings()
  }, [])

  // Fetch Requests when Tab/Filters change
  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests()
    }
  }, [activeTab, reqFilterStatus, reqStartDate, reqEndDate])

  const fetchSharedData = async () => {
    try {
      const [resClients, resWorkers, resServices] = await Promise.all([
        fetch(`${apiBase}/clients`),
        fetch(`${apiBase}/workers`),
        fetch(`${apiBase}/services`)
      ])
      if (resClients.ok) setClients(await resClients.json())
      if (resWorkers.ok) setDbWorkers(await resWorkers.json())
      if (resServices.ok) setServices(await resServices.json())
    } catch (err) {
      console.error("Error loading shared data", err)
    }
  }

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiBase}/bookings`)
      if (!res.ok) throw new Error('Failed to fetch bookings')
      const data = await res.json()
      setBookings(formatBookings(data))
    } catch (err) {
      setError('Could not load bookings.')
    } finally {
      setLoading(false)
    }
  }

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (reqFilterStatus !== 'All') params.append('status', reqFilterStatus)
      if (reqStartDate) params.append('startDate', reqStartDate)
      if (reqEndDate) params.append('endDate', reqEndDate)

      const res = await fetch(`${apiBase}/requests?${params.toString()}`)
      const data = await res.json()
      setRequests(data)
    } catch (err) {
      console.error("Error fetching requests:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatBookings = (data) => {
    return (data || []).map((b) => ({
      id: b.id,
      client: b.client_name || `Client #${b.client_id}`,
      worker: b.worker_name || `Worker #${b.worker_id}`,
      service: b.service_name || `Service #${b.service_id}`,
      date: b.booking_date ? new Date(b.booking_date).toLocaleDateString() : '',
      time: b.booking_date ? new Date(b.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      status: b.status || 'pending',
      amount: b.total_price != null ? `$${Number(b.total_price).toFixed(2)}` : '$0',
      pStatus: b.payment_status // keep raw for internal logic if needed
    }))
  }

  // --- BOOKING HANDLERS ---
  const handleAddBooking = () => setShowAddModal(true)
  const submitBooking = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch(`${apiBase}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      await fetchBookings()
      setShowAddModal(false)
      setForm({ client_id: '', worker_id: '', service_id: '', booking_date: '', duration_hours: '', total_price: '', status: 'pending', payment_status: 'pending', payment_method: '' })
    } catch (err) {
      alert('Failed to create booking')
    } finally {
      setLoading(false)
    }
  }
  const handleCancelBooking = async (id) => {
    if (!confirm("Delete this booking?")) return
    await fetch(`${apiBase}/bookings/${id}`, { method: 'DELETE' })
    setBookings(prev => prev.filter(b => b.id !== id))
  }
  const handleEditBooking = (id) => {
    const b = bookings.find(x => x.id === id)
    const s = prompt("New status?", b.status)
    if (s && s !== b.status) updateBookingStatus(id, s)
  }
  const updateBookingStatus = async (id, status) => {
    await fetch(`${apiBase}/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }
  const filteredBookings = bookings.filter(b =>
    (b.client && b.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.worker && b.worker.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // --- REQUEST HANDLERS ---
  const handleReqCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${apiBase}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqForm)
      })
      if (res.ok) {
        alert("Request created!")
        setShowReqModal(false)
        fetchRequests()
        setReqForm({ client_id: '', worker_id: '', service_id: '', title: '', description: '', requested_date: '', preferred_time: 'Morning', budget: '', status: 'pending' })
      }
    } catch (e) { console.error(e) }
  }

  const handleReqAction = async (id, status) => {
    if (!confirm(`Mark request as ${status}?`)) return
    const res = await fetch(`${apiBase}/requests/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
    })
    if (res.ok) {
      fetchRequests()
      if (status === 'accepted') fetchBookings() // Update bookings list if a booking was created
    }
  }

  const handleReqDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this request? This action cannot be undone.")) return
    try {
      const res = await fetch(`${apiBase}/requests/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert("Request deleted successfully!")
        fetchRequests()
      } else {
        alert("Failed to delete request")
      }
    } catch (err) {
      console.error("Error deleting request:", err)
      alert("Error deleting request")
    }
  }

  return (
    <div className="bookings-page">
      <div className="page-header">
        <h2>Booking Management</h2>
        <div className="tabs">
          <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
          <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Requests</button>
        </div>
      </div>

      {/* --- BOOKINGS TAB --- */}
      {activeTab === 'bookings' && (
        <>
          <div className="bookings-toolbar">
            <div className="search-box">
              <input type="text" placeholder="Search bookings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <span className="search-icon">🔍</span>
            </div>
            <button className="add-btn" onClick={handleAddBooking}>+ New Booking</button>
          </div>
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>ID</th><th>Client</th><th>Worker</th><th>Service</th><th>Date</th><th>Status</th><th>Amount</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>#{b.id}</td><td>{b.client}</td><td>{b.worker}</td><td>{b.service}</td><td>{b.date} {b.time}</td>
                    <td><span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span></td>
                    <td>{b.amount}</td>
                    <td>
                      <button className="action-icon-btn" onClick={() => handleEditBooking(b.id)}>✏️</button>
                      <button className="action-icon-btn" onClick={() => handleCancelBooking(b.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 && <p className="no-text">No bookings found.</p>}
          </div>
        </>
      )}

      {/* --- REQUESTS TAB --- */}
      {activeTab === 'requests' && (
        <>
          <div className="bookings-toolbar">
            <div className="request-filters">
              <input type="date" value={reqStartDate} onChange={e => setReqStartDate(e.target.value)} />
              <span>to</span>
              <input type="date" value={reqEndDate} onChange={e => setReqEndDate(e.target.value)} />
              <select value={reqFilterStatus} onChange={e => setReqFilterStatus(e.target.value)} className="filter-select">
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <button className="add-btn" onClick={() => setShowReqModal(true)}>+ Add Request</button>
          </div>
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>ID</th><th>Title</th><th>Client</th><th>Worker</th><th>Service</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td>#{req.id}</td>
                    <td><strong>{req.title}</strong></td>
                    <td>{req.client_name}</td>
                    <td>{req.worker_name}</td>
                    <td>{req.service_name}</td>
                    <td>{new Date(req.requested_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${req.status}`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && <p className="no-text">No requests found.</p>}
          </div>
        </>
      )}

      {/* --- MODALS --- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>New Booking</h3>
            <form onSubmit={submitBooking}>
              <div className="form-group"><label>Client</label><select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}><option value="">Select</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div className="form-group"><label>Worker</label><select value={form.worker_id} onChange={e => setForm({ ...form, worker_id: e.target.value })}><option value="">Select</option>{dbWorkers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
              <div className="form-group"><label>Service</label><select value={form.service_id} onChange={e => setForm({ ...form, service_id: e.target.value })}><option value="">Select</option>{services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              <div className="form-group"><label>Date</label><input type="datetime-local" value={form.booking_date} onChange={e => setForm({ ...form, booking_date: e.target.value })} /></div>
              <div className="form-group"><label>Price</label><input type="number" value={form.total_price} onChange={e => setForm({ ...form, total_price: e.target.value })} /></div>
              <div className="modal-actions"><button type="button" onClick={() => setShowAddModal(false)}>Cancel</button><button type="submit">Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showReqModal && (
        <div className="modal-overlay modal-enhanced" onClick={() => setShowReqModal(false)}>
          <div className="modal-content modal-request-enhanced" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-enhanced">
              <div className="modal-icon">📝</div>
              <h3>Create New Booking Request</h3>
              <button className="modal-close-btn" onClick={() => setShowReqModal(false)}>×</button>
            </div>
            <form onSubmit={handleReqCreate} className="modal-form-enhanced">
              <div className="form-row-enhanced">
                <div className="form-group">
                  <label>📋 Request Title</label>
                  <input
                    value={reqForm.title}
                    onChange={e => setReqForm({ ...reqForm, title: e.target.value })}
                    required
                    placeholder="Enter request title..."
                    className="input-enhanced"
                  />
                </div>
              </div>
              <div className="form-row-enhanced two-col">
                <div className="form-group">
                  <label>👤 Client</label>
                  <select
                    value={reqForm.client_id}
                    onChange={e => setReqForm({ ...reqForm, client_id: e.target.value })}
                    className="select-enhanced"
                    required
                  >
                    <option value="">Select Client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>🧑‍🔧 Worker</label>
                  <select
                    value={reqForm.worker_id}
                    onChange={e => setReqForm({ ...reqForm, worker_id: e.target.value })}
                    className="select-enhanced"
                    required
                  >
                    <option value="">Select Worker</option>
                    {dbWorkers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row-enhanced">
                <div className="form-group">
                  <label>🛠️ Service</label>
                  <select
                    value={reqForm.service_id}
                    onChange={e => setReqForm({ ...reqForm, service_id: e.target.value })}
                    className="select-enhanced"
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row-enhanced two-col">
                <div className="form-group">
                  <label>📅 Requested Date</label>
                  <input
                    type="date"
                    value={reqForm.requested_date}
                    onChange={e => setReqForm({ ...reqForm, requested_date: e.target.value })}
                    className="input-enhanced"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>💰 Budget (Optional)</label>
                  <input
                    type="number"
                    value={reqForm.budget}
                    onChange={e => setReqForm({ ...reqForm, budget: e.target.value })}
                    placeholder="Enter budget..."
                    className="input-enhanced"
                  />
                </div>
              </div>
              <div className="modal-actions-enhanced">
                <button type="button" className="btn-cancel-enhanced" onClick={() => setShowReqModal(false)}>
                  <span>✗</span> Cancel
                </button>
                <button type="submit" className="btn-submit-enhanced">
                  <span>✓</span> Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bookings
