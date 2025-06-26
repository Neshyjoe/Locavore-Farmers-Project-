"use client"

import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useData, useAuth } from "../App"
import ReviewForm from "./ReviewForm"
import "../css/VendorDetail.css"

export default function VendorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { vendors, getVendorReviews, deleteVendor, deleteReview } = useData()
  const { user } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)

  const vendor = vendors.find((v) => v.id === Number.parseInt(id))

  if (!vendor) {
    return (
      <div className="vendor-detail-container">
        <div className="error-state">
          <h2>Vendor not found</h2>
          <Link to="/vendors" className="back-link">
            Back to Vendors
          </Link>
        </div>
      </div>
    )
  }

  const reviews = getVendorReviews(vendor.id)
  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0

  const handleDeleteVendor = () => {
    if (window.confirm("Are you sure you want to delete this vendor? This will also delete all reviews.")) {
      deleteVendor(vendor.id)
      navigate("/vendors")
    }
  }

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview(reviewId)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
        ★
      </span>
    ))
  }

  return (
    <div className="vendor-detail-container">
      <div className="vendor-detail-header">
        <Link to="/vendors" className="back-link">
          <svg className="back-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Vendors
        </Link>
      </div>

      <div className="vendor-info-card">
        <img src={vendor.image || "/placeholder.svg"} alt={vendor.name} className="vendor-hero-image" />
        <div className="vendor-info-content">
          <div className="vendor-info-header">
            <div className="vendor-title-section">
              <h1 className="vendor-title">{vendor.name}</h1>
              <span className="vendor-category-badge">{vendor.category}</span>
            </div>
            {user.id === vendor.userId && (
              <div className="vendor-actions">
                <Link to={`/edit-vendor/${vendor.id}`} className="edit-btn">
                  Edit
                </Link>
                <button onClick={handleDeleteVendor} className="delete-btn">
                  Delete
                </button>
              </div>
            )}
          </div>

          <p className="vendor-description">{vendor.description}</p>

          <div className="vendor-details-grid">
            <div className="detail-item">
              <svg className="detail-icon" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="detail-label">{vendor.location}</p>
                <p className="detail-value">{vendor.address}</p>
              </div>
            </div>

            {vendor.phone && (
              <div className="detail-item">
                <svg className="detail-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <p className="detail-value">{vendor.phone}</p>
              </div>
            )}

            {vendor.email && (
              <div className="detail-item">
                <svg className="detail-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <p className="detail-value">{vendor.email}</p>
              </div>
            )}

            {vendor.hours && (
              <div className="detail-item">
                <svg className="detail-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="detail-value">{vendor.hours}</p>
              </div>
            )}

            {vendor.website && (
              <div className="detail-item">
                <svg className="detail-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </svg>
                <a
                  href={`https://${vendor.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  {vendor.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <div className="reviews-title-section">
            <h2 className="reviews-title">Reviews</h2>
            {reviews.length > 0 && (
              <div className="rating-summary">
                <div className="rating-stars">{renderStars(Math.round(averageRating))}</div>
                <span className="rating-text">
                  {averageRating} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}
          </div>
          <button onClick={() => setShowReviewForm(true)} className="write-review-btn">
            Write Review
          </button>
        </div>

        {(showReviewForm || editingReview) && (
          <ReviewForm
            vendorId={vendor.id}
            review={editingReview}
            onClose={() => {
              setShowReviewForm(false)
              setEditingReview(null)
            }}
          />
        )}

        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-rating">
                    <span className="reviewer-name">{review.userName}</span>
                    <div className="review-stars">{renderStars(review.rating)}</div>
                  </div>
                  <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                {user.id === review.userId && (
                  <div className="review-actions">
                    <button onClick={() => setEditingReview(review)} className="edit-review-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteReview(review.id)} className="delete-review-btn">
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>

        {reviews.length === 0 && !showReviewForm && (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  )
}
