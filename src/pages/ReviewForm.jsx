"use client"

import { useState } from "react"
// import api from "


const ReviewForm = ({ vendorId, review = null, onReviewAdded, onReviewUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: review?.rating || 5,
    comment: review?.comment || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEditing = !!review

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let response
      if (isEditing) {
        response = await api.put(`/reviews/${review.id}`, formData)
        onReviewUpdated(response.data)
      } else {
        response = await api.post("/reviews", {
          ...formData,
          vendor_id: vendorId,
        })
        onReviewAdded(response.data)
      }
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${isEditing ? "update" : "add"} review`)
      console.error(`Error ${isEditing ? "updating" : "adding"} review:`, error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{isEditing ? "Edit Review" : "Write a Review"}</h3>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
            <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
            <option value={3}>⭐⭐⭐ (3 stars)</option>
            <option value={2}>⭐⭐ (2 stars)</option>
            <option value={1}>⭐ (1 star)</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="4"
            placeholder="Share your experience with this vendor..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditing ? "Update Review" : "Submit Review"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm
