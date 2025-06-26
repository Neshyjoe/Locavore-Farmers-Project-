import { Link } from "react-router-dom"
import { useData } from "../App"
import "../css/Home.css"

export default function Home() {
  const { vendors, reviews } = useData()

  const recentVendors = vendors.slice(-3).reverse()
  const recentReviews = reviews.slice(-3).reverse()

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">🥕 Welcome to Locavore</h1>
        <p className="hero-subtitle">Discover amazing local food vendors and farmers markets in your area</p>
        <div className="hero-actions">
          <Link to="/vendors" className="btn-primary">
            Browse Vendors
          </Link>
          <Link to="/add-vendor" className="btn-secondary">
            Add Your Vendor
          </Link>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <h3 className="stat-number">{vendors.length}</h3>
          <p className="stat-label">Local Vendors</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{reviews.length}</h3>
          <p className="stat-label">Customer Reviews</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{new Set(vendors.map((v) => v.category)).size}</h3>
          <p className="stat-label">Categories</p>
        </div>
      </div>

      <div className="content-grid">
        <div className="recent-section">
          <h2 className="section-title">Recently Added Vendors</h2>
          <div className="vendor-grid">
            {recentVendors.map((vendor) => (
              <Link key={vendor.id} to={`/vendors/${vendor.id}`} className="vendor-card">
                <img src={vendor.image || "/placeholder.svg"} alt={vendor.name} className="vendor-image" />
                <div className="vendor-info">
                  <h3 className="vendor-name">{vendor.name}</h3>
                  <span className="vendor-category">{vendor.category}</span>
                  <p className="vendor-location">{vendor.location}</p>
                </div>
              </Link>
            ))}
          </div>
          {recentVendors.length === 0 && <p className="empty-state">No vendors yet. Be the first to add one!</p>}
        </div>

        <div className="reviews-section">
          <h2 className="section-title">Latest Reviews</h2>
          <div className="reviews-list">
            {recentReviews.map((review) => {
              const vendor = vendors.find((v) => v.id === review.vendorId)
              return (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="reviewer-name">{review.userName}</span>
                    <div className="rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`star ${i < review.rating ? "filled" : ""}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  {vendor && (
                    <Link to={`/vendors/${vendor.id}`} className="vendor-link">
                      {vendor.name}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
          {recentReviews.length === 0 && <p className="empty-state">No reviews yet.</p>}
        </div>
      </div>
    </div>
  )
}
