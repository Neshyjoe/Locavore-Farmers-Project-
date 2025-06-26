"use client"

import { useState } from "react"
import { useData, useAuth } from "../App"
import "../css/ReviewForm.css"

export default function ReviewForm({ vendorId, review, onClose }) {
  const { addReview, updateReview } = useData()
  const { user } = useAuth()
  const isEditing = !!review

  const [formData, setFormData] = useState({
    rating: review?.rating || 5,
    comment: review?.comment || "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      })
    }
  }

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating,
    })
    if (errors.rating) {
      setErrors({
        ...errors,
        rating: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please select a rating"
    }
    if (!formData.comment.trim()) {
      newErrors.comment = "Please write a comment"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const reviewData = {
        ...formData,
        vendorId,
        userId: user.id,
        userName: user.name,
      }

      if (isEditing) {
        updateReview(review.id, reviewData)
      } else {
        addReview(reviewData)
      }

      onClose()
    } catch (error) {
      console.error("Error saving review:", error)
    }

    setLoading(false)
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleRatingChange(i + 1)}
        className={`star-btn ${i < formData.rating ? "filled" : ""}`}
      >
        ★
      </button>
    ))
  }

  return (
    <div className="review-form-container">
      <h3 className="review-form-title">{isEditing ? "Edit Review" : "Write a Review"}</h3>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label className="form-label">Rating *</label>
          <div className="rating-container">
            <div className="stars-container">{renderStars()}</div>
            <span className="rating-text">
              ({formData.rating} star{formData.rating !== 1 ? "s" : ""})
            </span>
          </div>
          {errors.rating && <p className="error-text">{errors.rating}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="comment" className="form-label">
            Comment *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={4}
            className={`form-textarea ${errors.comment ? "error" : ""}`}
            placeholder="Share your experience with this vendor..."
          />
          {errors.comment && <p className="error-text">{errors.comment}</p>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Saving..." : isEditing ? "Update Review" : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  )
}
