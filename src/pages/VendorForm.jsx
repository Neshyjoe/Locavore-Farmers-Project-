"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useData, useAuth } from "../App"
import "../css/VendorForm.css"

export default function VendorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { vendors, addVendor, updateVendor } = useData()
  const { user } = useAuth()
  const isEditing = !!id

  const vendor = isEditing ? vendors.find((v) => v.id === Number.parseInt(id)) : null

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    hours: "",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&h=200&fit=crop",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const categories = ["Farm", "Bakery", "Butcher", "Dairy", "Seafood", "Specialty", "Restaurant", "Food Truck", "Other"]

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        description: vendor.description || "",
        category: vendor.category || "",
        location: vendor.location || "",
        address: vendor.address || "",
        phone: vendor.phone || "",
        email: vendor.email || "",
        website: vendor.website || "",
        hours: vendor.hours || "",
        image: vendor.image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&h=200&fit=crop",
      })
    }
  }, [vendor])

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.website && !formData.website.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)) {
      newErrors.website = "Please enter a valid website (e.g., example.com)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const vendorData = {
        ...formData,
        userId: user.id,
      }

      if (isEditing) {
        updateVendor(vendor.id, vendorData)
      } else {
        addVendor(vendorData)
      }

      navigate("/vendors")
    } catch (error) {
      console.error("Error saving vendor:", error)
    }

    setLoading(false)
  }

  if (isEditing && !vendor) {
    return (
      <div className="vendor-form-container">
        <div className="error-state">
          <h2>Vendor not found</h2>
          <Link to="/vendors" className="back-link">
            Back to Vendors
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="vendor-form-container">
      <div className="vendor-form-header">
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
        <h1 className="page-title">{isEditing ? "Edit Vendor" : "Add New Vendor"}</h1>
      </div>

      <div className="vendor-form-card">
        <form onSubmit={handleSubmit} className="vendor-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Vendor Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Enter vendor name"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`form-textarea ${errors.description ? "error" : ""}`}
              placeholder="Describe what this vendor offers"
            />
            {errors.description && <p className="error-text">{errors.description}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-select ${errors.category ? "error" : ""}`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Market/Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`form-input ${errors.location ? "error" : ""}`}
                placeholder="e.g., Downtown Farmers Market"
              />
              {errors.location && <p className="error-text">{errors.location}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`form-input ${errors.address ? "error" : ""}`}
                placeholder="Street address"
              />
              {errors.address && <p className="error-text">{errors.address}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="vendor@example.com"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="website" className="form-label">
                Website
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`form-input ${errors.website ? "error" : ""}`}
                placeholder="example.com"
              />
              {errors.website && <p className="error-text">{errors.website}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="hours" className="form-label">
                Hours
              </label>
              <input
                type="text"
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="form-input"
                placeholder="Sat 8AM-2PM, Sun 9AM-1PM"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
            <p className="form-help">Leave blank to use default placeholder image</p>
          </div>

          <div className="form-actions">
            <Link to="/vendors" className="cancel-btn">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Saving..." : isEditing ? "Update Vendor" : "Add Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
