import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Docs.css';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      content: (
        <div>
          <p>
            Welcome to the Invoice Generator! This powerful tool is designed for simplicity and efficiency. 
            No signup is required — just open the editor and begin filling out your invoice. 
            Your data remains in your browser for complete privacy.
          </p>
          <div className="feature-highlight">
            <h4>Key Features:</h4>
            <ul>
              <li>✅ Instant invoice creation</li>
              <li>✅ Complete data privacy</li>
              <li>✅ Professional templates</li>
        </ul>
          </div>
        </div>
      )
    },
    {
      id: 'editing-invoice',
      title: 'Editing Your Invoice',
      icon: '📝',
      content: (
        <div>
          <p>
            Creating an invoice is straightforward and intuitive. Follow these steps to generate your professional invoice:
          </p>
          <div className="step-list">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Basic Information</h4>
                <p>Add your company name, client details, invoice number, and dates in the header section.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Line Items</h4>
                <p>Enter product or service descriptions, quantity, and rate for each item.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Add More Items</h4>
                <p>Use the "+ Line Item" button to add more entries (up to 6 items).</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tax-discount-shipping',
      title: 'Tax, Discount & Shipping',
      icon: '💰',
      content: (
        <div>
          <p>
            Below the items table, you can configure additional charges and deductions:
          </p>
          <div className="feature-grid">
            <div className="feature-item">
              <h4>Tax Percentage</h4>
              <p>Enter applicable tax rate (e.g., 8.5% for sales tax)</p>
            </div>
            <div className="feature-item">
              <h4>Flat Discount</h4>
              <p>Apply fixed amount discounts to the subtotal</p>
            </div>
            <div className="feature-item">
              <h4>Shipping Fees</h4>
              <p>Add delivery or handling charges</p>
            </div>
          </div>
          <div className="info-box">
            <strong>💡 Pro Tip:</strong> All totals are updated in real-time as you type, so you can see the final amount immediately.
          </div>
        </div>
      )
    },
    {
      id: 'currency-selection',
      title: 'Currency Selection',
      icon: '💱',
      content: (
        <div>
          <p>
            Choose your preferred currency from the dropdown on the right panel. We support multiple currencies worldwide:
          </p>
          <div className="currency-grid">
            <div className="currency-item">
              <span className="currency-symbol">$</span>
              <span>USD - US Dollar</span>
            </div>
            <div className="currency-item">
              <span className="currency-symbol">€</span>
              <span>EUR - Euro</span>
            </div>
            <div className="currency-item">
              <span className="currency-symbol">₹</span>
              <span>INR - Indian Rupee</span>
            </div>
            <div className="currency-item">
              <span className="currency-symbol">£</span>
              <span>GBP - British Pound</span>
            </div>
            <div className="currency-item">
              <span className="currency-symbol">¥</span>
              <span>JPY - Japanese Yen</span>
            </div>
            <div className="currency-item">
              <span className="currency-symbol">₿</span>
              <span>BTC - Bitcoin</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'exporting',
      title: 'Exporting Your Invoice',
      icon: '📤',
      content: (
        <div>
          <p>
            To save or print your invoice, follow these simple steps:
          </p>
          <div className="export-steps">
            <div className="export-step">
              <div className="export-icon">1️⃣</div>
              <p>Click the "Download" button in the right panel</p>
            </div>
            <div className="export-step">
              <div className="export-icon">2️⃣</div>
              <p>Your browser's print dialog will open</p>
            </div>
            <div className="export-step">
              <div className="export-icon">3️⃣</div>
              <p>Select "Save as PDF" from the destination options</p>
            </div>
            <div className="export-step">
              <div className="export-icon">4️⃣</div>
              <p>Choose your save location and click "Save"</p>
            </div>
          </div>
          <div className="warning-box">
            <strong>⚠️ Note:</strong> For best results, use Chrome or Edge browsers. The PDF will maintain the exact layout and formatting of your invoice.
          </div>
        </div>
      )
    },
    {
      id: 'mobile-friendly',
      title: 'Mobile Friendly',
      icon: '📱',
      content: (
        <div>
          <p>
            This app is fully responsive and optimized for all devices:
          </p>
          <div className="device-grid">
            <div className="device-item">
              <div className="device-icon">💻</div>
              <h4>Desktop</h4>
              <p>Full-featured experience with all tools accessible</p>
            </div>
            <div className="device-item">
              <div className="device-icon">📱</div>
              <h4>Mobile</h4>
              <p>Touch-optimized interface for on-the-go invoicing</p>
            </div>
            <div className="device-item">
              <div className="device-icon">📟</div>
              <h4>Tablet</h4>
              <p>Perfect balance of portability and functionality</p>
            </div>
          </div>
          <div className="info-box">
            <strong>🌐 Cross-Platform:</strong> Works seamlessly across Windows, macOS, iOS, and Android devices.
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="docs-page">
      <div className="docs-header">
        <h1>📄 Documentation</h1>
        <p>Everything you need to know about creating professional invoices</p>
      </div>

      <div className="docs-container">
        <nav className="docs-sidebar">
          <div className="sidebar-header">
            <h3>Quick Navigation</h3>
          </div>
          <ul className="sidebar-nav">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  className={`sidebar-link ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="section-icon">{section.icon}</span>
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="docs-content">
          {sections.map((section) => (
            <section
              key={section.id}
              className={`docs-section ${activeSection === section.id ? 'active' : ''}`}
            >
              <div className="section-header">
                <span className="section-icon-large">{section.icon}</span>
                <h2>{section.title}</h2>
              </div>
              <div className="section-body">
                {section.content}
              </div>
      </section>
          ))}
        </main>
      </div>

      <div className="docs-footer">
        <div className="cta-section">
          <h3>Ready to Create Your First Invoice?</h3>
          <p>Start generating professional invoices in minutes</p>
          <Link to="/invoice" className="btn btn-primary">
            Create Invoice Now
          </Link>
        </div>
        
        <div className="support-section">
          <h4>Need Help?</h4>
          <p>
            Can't find what you're looking for? Check out our{' '}
            <Link to="/help" className="link">Help Center</Link> or{' '}
            <a href="mailto:support@invoicegenerator.com" className="link">contact support</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Docs;
