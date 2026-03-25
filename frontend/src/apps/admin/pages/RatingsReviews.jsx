import { useState, useEffect } from 'react'
import './RatingsReviews.css'

const RatingsReviews = () => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')



  /* 
   * FETCH REVIEWS & BOOKINGS
   */
  const [reviews, setReviews] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [newReview, setNewReview] = useState({
    bookingId: '',
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    fetchReviews()
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${apiBase}/bookings`)
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (err) {
      console.error("Error fetching bookings:", err)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${apiBase}/reviews`)
      if (!res.ok) throw new Error('Failed to fetch reviews')
      const data = await res.json()

      const formatted = data.map(r => ({
        id: r.id,
        client: r.reviewer_name || `User #${r.reviewer_id}`,
        service: r.service_name || 'Service',
        rating: r.rating,
        comment: r.comment,
        date: r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
        status: 'Published'
      }))
      setReviews(formatted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateReview = async (e) => {
    e.preventDefault()
    if (!newReview.bookingId) return alert("Select a booking")

    const selectedBooking = bookings.find(b => b.id === parseInt(newReview.bookingId))
    if (!selectedBooking) return

    try {
      const payload = {
        booking_id: selectedBooking.id,
        reviewer_id: selectedBooking.client_id, // Client reviews Worker
        reviewee_id: selectedBooking.worker_id,
        rating: parseInt(newReview.rating),
        comment: newReview.comment
      }

      const res = await fetch(`${apiBase}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert("Review added successfully")
        setShowModal(false)
        setNewReview({ bookingId: '', rating: 5, comment: '' })
        fetchReviews() // Refresh list
      } else {
        alert("Failed to add review")
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleApprove = async (id) => {
    // Mock approval as backend doesn't support status yet
    alert(`Review #${id} approved (Mock)`)
  }

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject/delete this review?')) return
    try {
      const res = await fetch(`${apiBase}/reviews/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete review')
      setReviews(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error(err)
      alert('Could not delete review')
    }
  }

  const handleDelete = (id) => handleReject(id) // Same action for now
  const handleEdit = (id) => alert(`Edit review #${id} (Not implemented)`)
  const handleAddReview = () => setShowModal(true)

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filter === 'all' ||
      (filter === 'published' && review.status === 'Published') ||
      (filter === 'pending' && review.status === 'Pending') ||
      (filter === 'high' && review.rating >= 4) ||
      (filter === 'low' && review.rating <= 2)

    return matchesSearch && matchesFilter
  })

  const averageRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0'

  const renderStars = (rating) => {
    const safeRating = rating || 0
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < safeRating ? 'star filled' : 'star'}>
        {i < safeRating ? '⭐' : '☆'}
      </span>
    ))
  }

  return (
    <div className="ratings-reviews-page">
      <div className="page-header">
        <h2>Ratings & Reviews</h2>
        <p>Manage and monitor customer feedback and ratings</p>
      </div>

      <div className="reviews-overview">
        <div className="overview-card main-stat">
          <div className="stat-content">
            <h3>Average Rating</h3>
            <div className="rating-display">
              <span className="rating-number">{averageRating}</span>
              <div className="stars-large">
                {renderStars(Math.round(parseFloat(averageRating)))}
              </div>
            </div>
            <p className="total-reviews">{reviews.length} Total Reviews</p>
          </div>
        </div>
        <div className="overview-card">
          <h4>5 Stars</h4>
          <p className="stat-value">{reviews.filter(r => r.rating === 5).length}</p>
        </div>
        <div className="overview-card">
          <h4>4 Stars</h4>
          <p className="stat-value">{reviews.filter(r => r.rating === 4).length}</p>
        </div>
        <div className="overview-card">
          <h4>3 Stars</h4>
          <p className="stat-value">{reviews.filter(r => r.rating === 3).length}</p>
        </div>
        <div className="overview-card">
          <h4>2 Stars</h4>
          <p className="stat-value">{reviews.filter(r => r.rating === 2).length}</p>
        </div>
        <div className="overview-card">
          <h4>1 Star</h4>
          <p className="stat-value">{reviews.filter(r => r.rating === 1).length}</p>
        </div>
      </div>

      <div className="reviews-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <button className="add-btn" onClick={handleAddReview}>+ Add Review</button>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
            onClick={() => setFilter('published')}
          >
            Published
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High (4+)
          </button>
          <button
            className={`filter-btn ${filter === 'low' ? 'active' : ''}`}
            onClick={() => setFilter('low')}
          >
            Low (≤2)
          </button>
        </div>
      </div>

      <div className="reviews-list">
        {filteredReviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">{review.client.charAt(0)}</div>
                <div className="reviewer-details">
                  <h4>{review.client}</h4>
                  <p className="service-name">{review.service}</p>
                </div>
              </div>
              <div className="review-meta">
                <div className="rating-stars">
                  {renderStars(review.rating)}
                </div>
                <span className="review-date">{review.date}</span>
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
            <div className="review-footer">
              <span className={`status-badge status-${review.status.toLowerCase()}`}>
                {review.status}
              </span>
              <div className="review-actions">
                <button className="action-btn approve" title="Approve" onClick={() => handleApprove(review.id)}>✓ Approve</button>
                <button className="action-btn reject" title="Reject" onClick={() => handleReject(review.id)}>✗ Reject</button>
                <button className="action-btn edit" title="Edit" onClick={() => handleEdit(review.id)}>✏️ Edit</button>
                <button className="action-btn delete" title="Delete" onClick={() => handleDelete(review.id)}>🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="no-results">
          <p>No reviews found matching your criteria.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add Manual Review</h3>
            <form className="modal-form" onSubmit={handleCreateReview}>
              <div className="form-group">
                <label>Select Booking</label>
                <select
                  value={newReview.bookingId}
                  onChange={e => setNewReview({ ...newReview, bookingId: e.target.value })}
                  required
                >
                  <option value="">-- Select Completed Booking --</option>
                  {bookings.map(b => (
                    <option key={b.id} value={b.id}>
                      #{b.id} - {b.client_name} (Service: {b.service_name})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <select
                  value={newReview.rating}
                  onChange={e => setNewReview({ ...newReview, rating: e.target.value })}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  rows="4"
                  value={newReview.comment}
                  onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RatingsReviews

