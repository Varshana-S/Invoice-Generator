import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Create Professional Invoices
            <span className="gradient-text"> in Minutes</span>
          </h1>
          <p className="hero-subtitle">
            Generate beautiful, professional invoices instantly. No signup required. 
            Free, secure, and designed for modern businesses.
          </p>
          <div className="hero-buttons">
            <Link to="/invoice" className="btn btn-primary">
              Create Invoice Now
            </Link>
            <Link to="/docs" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="invoice-preview">
            <div className="preview-header">
              <h3>Sample Invoice</h3>
              <span className="preview-badge">Preview</span>
            </div>
            <div className="preview-content">
              <div className="preview-row">
                <span>Invoice #</span>
                <span>INV-001</span>
              </div>
              <div className="preview-row">
                <span>Date</span>
                <span>Dec 15, 2024</span>
              </div>
              <div className="preview-row">
                <span>Amount</span>
                <span className="amount">$1,250.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our Invoice Generator?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Lightning Fast</h3>
            <p>Create professional invoices in under 2 minutes. No complex setup required.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>100% Secure</h3>
            <p>Your data never leaves your browser. Complete privacy and security guaranteed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Professional Design</h3>
            <p>Clean, modern templates that make your business look professional.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Works perfectly on desktop, tablet, and mobile devices.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Multiple Currencies</h3>
            <p>Support for USD, EUR, INR, and many more currencies worldwide.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>PDF Export</h3>
            <p>Download your invoices as PDF files ready for printing or emailing.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of businesses creating professional invoices with ease.</p>
          <Link to="/invoice" className="btn btn-primary btn-large">
            Start Creating Invoices
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
