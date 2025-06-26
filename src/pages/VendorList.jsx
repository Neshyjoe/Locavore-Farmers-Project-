"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useData } from "../App"
import "../css/VendorList.css"

export default function VendorList() {
  const { vendors } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  const categories = [...new Set(vendors.map((vendor) => vendor.category))]

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || vendor.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="vendor-list-container">
      <div className="vendor-list-header">
        <h1 className="page-title">Local Food Vendors</h1>

        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search vendors, descriptions, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-filter"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="vendors-grid">
        {filteredVendors.map((vendor) => (
          <Link key={vendor.id} to={`/vendors/${vendor.id}`} className="vendor-card">
            <img src={vendor.image || "/placeholder.svg"} alt={vendor.name} className="vendor-image" />
            <div className="vendor-content">
              <div className="vendor-header">
                <h3 className="vendor-name">{vendor.name}</h3>
                <span className="vendor-category">{vendor.category}</span>
              </div>
              <p className="vendor-description">{vendor.description}</p>
              <div className="vendor-location">
                <svg className="location-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {vendor.location}
              </div>
              {vendor.hours && (
                <div className="vendor-hours">
                  <svg className="clock-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {vendor.hours}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="empty-state">
          <p className="empty-message">No vendors found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
