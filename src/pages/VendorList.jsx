"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
// import api from "


const VendorList = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const response = await api.get("/vendors")
      setVendors(response.data)
    } catch (error) {
      setError("Failed to fetch vendors")
      console.error("Error fetching vendors:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-xl">Loading vendors...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Local Food Vendors</h1>
        <Link
          to="/add-vendor"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Add New Vendor
        </Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search vendors by name, location, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {filteredVendors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No vendors found.</p>
          <Link to="/add-vendor" className="text-green-600 hover:text-green-700 mt-2 inline-block">
            Be the first to add a vendor!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{vendor.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{vendor.category}</span>
                </div>

                <p className="text-gray-600 mb-2">📍 {vendor.location}</p>

                {vendor.description && <p className="text-gray-700 mb-4 line-clamp-3">{vendor.description}</p>}

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-yellow-500">⭐</span>
                    <span className="ml-1 text-sm text-gray-600">
                      {vendor.average_rating ? vendor.average_rating.toFixed(1) : "No ratings"}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">({vendor.review_count || 0} reviews)</span>
                  </div>

                  <Link to={`/vendors/${vendor.id}`} className="text-green-600 hover:text-green-700 font-medium">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorList
