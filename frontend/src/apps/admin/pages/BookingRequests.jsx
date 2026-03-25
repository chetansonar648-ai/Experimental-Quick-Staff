import { useState, useEffect } from 'react'
import './BookingRequests.css'

const BookingRequests = () => {
    const [requests, setRequests] = useState([])
    const [filterStatus, setFilterStatus] = useState('All')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [clients, setClients] = useState([])
    const [workers, setWorkers] = useState([])
    const [services, setServices] = useState([])

    // ... (formData state remains the same)
    const [formData, setFormData] = useState({
        client_id: '',
        worker_id: '',
        service_id: '',
        title: '',
        description: '',
        requested_date: '',
        preferred_time: 'Morning',
        budget: '',
        status: 'pending'
    })

    useEffect(() => {
        fetchRequests()
        fetchDropdownData()
    }, [filterStatus, startDate, endDate])

    const fetchRequests = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filterStatus !== 'All') params.append('status', filterStatus)
            if (startDate) params.append('startDate', startDate)
            if (endDate) params.append('endDate', endDate)

            const res = await fetch(`http://localhost:4000/requests?${params.toString()}`)
            const data = await res.json()
            setRequests(data)
        } catch (error) {
            console.error("Error fetching requests:", error)
        } finally {
            setLoading(false)
        }
    }

    // ... (fetchDropdownData, handleAction, handleCreate remain the same)
    const fetchDropdownData = async () => {
        try {
            // Parallel fetches for dropdowns
            const [cRes, wRes, sRes] = await Promise.all([
                fetch('http://localhost:4000/clients'),
                fetch('http://localhost:4000/workers'),
                fetch('http://localhost:4000/services')
            ])
            setClients(await cRes.json())
            setWorkers(await wRes.json())
            setServices(await sRes.json())
        } catch (error) {
            console.error("Error fetching dropdowns:", error)
        }
    }

    const handleAction = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this request?`)) return

        try {
            const res = await fetch(`http://localhost:4000/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                alert(`Request ${status} successfully!`)
                fetchRequests()
            } else {
                alert("Failed to update request")
            }
        } catch (error) {
            console.error("Error updating request:", error)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:4000/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                alert("Request created successfully!")
                setShowModal(false)
                fetchRequests()
                setFormData({
                    client_id: '', worker_id: '', service_id: '',
                    title: '', description: '', requested_date: '',
                    preferred_time: 'Morning', budget: '', status: 'pending'
                })
            } else {
                alert("Failed to create request")
            }
        } catch (error) {
            console.error("Error creating request:", error)
        }
    }

    return (
        <div className="booking-requests-page">
            <div className="page-header">
                <h2>Booking Requests</h2>
                <div className="header-actions">
                    <div className="date-filters">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="From Date"
                            title="From Date"
                        />
                        <span>to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="End Date"
                            title="End Date"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="All">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Request</button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="requests-table-container">
                    <table className="requests-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Client</th>
                                <th>Worker</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.id}>
                                    <td>{req.title}</td>
                                    <td>{req.client_name || req.client_id}</td>
                                    <td>{req.worker_name || req.worker_id}</td>
                                    <td>{req.service_name || req.service_id}</td>
                                    <td>{new Date(req.requested_date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${req.status}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td>
                                        {req.status === 'pending' && (
                                            <>
                                                <button className="action-btn accept" onClick={() => handleAction(req.id, 'accepted')}>✓</button>
                                                <button className="action-btn reject" onClick={() => handleAction(req.id, 'rejected')}>✗</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && <tr><td colSpan="7">No requests found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Create New Request</h3>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Title</label>
                                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Client</label>
                                    <select required value={formData.client_id} onChange={e => setFormData({ ...formData, client_id: e.target.value })}>
                                        <option value="">Select Client</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Worker</label>
                                    <select required value={formData.worker_id} onChange={e => setFormData({ ...formData, worker_id: e.target.value })}>
                                        <option value="">Select Worker</option>
                                        {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Service</label>
                                <select required value={formData.service_id} onChange={e => setFormData({ ...formData, service_id: e.target.value })}>
                                    <option value="">Select Service</option>
                                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" required value={formData.requested_date} onChange={e => setFormData({ ...formData, requested_date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Budget</label>
                                    <input type="number" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="submit-btn">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BookingRequests
