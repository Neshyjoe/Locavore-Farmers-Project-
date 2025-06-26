"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import ReviewForm from "../components/ReviewForm"
import ReviewList from "../components/ReviewList"
// import api from "


const VendorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    fetchVendorDetails()
  }, [id])

  const fetchVendorDetails = async () => {
    try {
      const [vendorResponse, reviewsResponse] = await Promise.all([
        api.get(`/vendors/${id}`),
        api.get(`/vendors/${id}/reviews`),
      ])

      setVendor(vendorResponse.data)
      setReviews(reviewsResponse.data || [])
    } catch (error) {
      setError("Failed to fetch vendor details")
      console.error("Error fetching vendor:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVendor = async () => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await api.delete(`/vendors/${id}`)
        navigate("/vendors")
      } catch (error) {
        setError("Failed to delete vendor")
        console.error("Error deleting vendor:", error)
      }
    }
  }

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews])
    setShowReviewForm(false)
    fetchVendorDetails() // Refresh to update average rating
  }

  const handleReviewUpdated = (updatedReview) => {
    setReviews(reviews.map((review) => (review.id === updatedReview.id ? updatedReview : review)))
    fetchVendorDetails() // Refresh to update average rating
  }

  const handleReviewDeleted = (reviewId) => {
    setReviews(reviews.filter((review) => review.id !== reviewId))
    fetchVendorDetails() 
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-xl">Loading vendor details...</div>
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-xl mb-4">{error || "Vendor not found"}</div>
        <Link to="/vendors" className="text-green-600 hover:text-green-700">
          ← Back to Vendors
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/vendors" className="text-green-600 hover:text-green-700 mb-4 inline-block">
          ← Back to Vendors
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{vendor.name}</h1>
            <div className="flex items-center mb-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{vendor.category}</span>
              <span className="ml-4 text-gray-600">📍 {vendor.location}</span>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-500 text-lg">⭐</span>
              <span className="ml-1 text-lg font-medium">
                {vendor.average_rating ? vendor.average_rating.toFixed(1) : "No ratings"}
              </span>
              <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Link
              to={`/edit-vendor/${vendor.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDeleteVendor}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {vendor.description && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{vendor.description}</p>
          </div>
        )}

        {vendor.contact_info && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-700">{vendor.contact_info}</p>
          </div>
        )}

        {vendor.hours && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Hours</h3>
            <p className="text-gray-700">{vendor.hours}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            {showReviewForm ? "Cancel" : "Write Review"}
          </button>
        </div>

        {showReviewForm && (
          <div className="mb-6">
            <ReviewForm
              vendorId={vendor.id}
              onReviewAdded={handleReviewAdded}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        <ReviewList reviews={reviews} onReviewUpdated={handleReviewUpdated} onReviewDeleted={handleReviewDeleted} />
      </div>
    </div>
  )
}

export default VendorDetail
