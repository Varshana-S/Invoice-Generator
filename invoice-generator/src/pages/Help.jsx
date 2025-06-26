import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Help.css';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showContactForm, setShowContactForm] = useState(false);

  const faqs = [
    {
      id: 1,
      category: 'general',
      q: 'Can I save my invoice?',
      a: 'Invoices are not stored online. You can download them to your device as PDF for safekeeping. This ensures your data remains private and secure.'
    },
    {
      id: 2,
      category: 'export',
      q: 'How do I print or save my invoice as a PDF?',
      a: 'Click the "Download" button on the right panel. Use your browser\'s print menu to save it as PDF. For best results, use Chrome or Edge browsers.'
    },
    {
      id: 3,
      category: 'account',
      q: 'Do I need to sign in?',
      a: 'Yes, signing in is required. You can use all core invoice features without an account. Your data stays in your browser for complete privacy.'
    },
    {
      id: 4,
      category: 'customization',
      q: 'Can I customize the currency?',
      a: 'Yes, use the currency dropdown in the right panel to select your preferred currency symbol. We support USD, EUR, INR, GBP, and many more.'
    },
    {
      id: 5,
      category: 'customization',
      q: 'Can I add my company logo?',
      a: 'At the moment, logo uploads are not supported. We plan to add this feature in a future update to make your invoices even more professional.'
    },
    {
      id: 6,
      category: 'usage',
      q: 'How many line items can I add?',
      a: 'You can add up to 6 line items per invoice. This ensures your invoice fits neatly on one A4 page and remains professional-looking.'
    },
    {
      id: 7,
      category: 'export',
      q: 'Why does my invoice get cut off when printing?',
      a: 'Our layout auto-scales content for print. If it still cuts off, try reducing the number of items or adjusting your browser zoom level.'
    },
    {
      id: 8,
      category: 'privacy',
      q: 'Is my invoice data stored online?',
      a: 'No data is stored or sent to a server. Everything is handled in your browser for complete privacy and security.'
    },
    {
      id: 9,
      category: 'mobile',
      q: 'Can I use this invoice generator on mobile?',
      a: 'Yes! It\'s fully responsive and works well on phones, tablets, and desktops. The interface adapts to your screen size automatically.'
    },
    {
      id: 10,
      category: 'features',
      q: 'Will you add email or export to Excel options?',
      a: 'We\'re working on those features! Stay tuned for updates in future versions. We\'re constantly improving based on user feedback.'
    },
    {
      id: 11,
      category: 'privacy',
      q: 'How secure is my data?',
      a: 'Your data never leaves your device. We use client-side processing only, ensuring maximum privacy and security for your business information.'
    },
    {
      id: 12,
      category: 'features',
      q: 'Can I customize the invoice template?',
      a: 'Currently, we offer a professional template optimized for clarity and readability. Custom templates are planned for future releases.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: '📋' },
    { id: 'general', name: 'General', icon: '❓' },
    { id: 'export', name: 'Export & Print', icon: '📤' },
    { id: 'account', name: 'Account & Login', icon: '👤' },
    { id: 'customization', name: 'Customization', icon: '🎨' },
    { id: 'usage', name: 'Usage', icon: '💡' },
    { id: 'privacy', name: 'Privacy & Security', icon: '🔒' },
    { id: 'mobile', name: 'Mobile', icon: '📱' },
    { id: 'features', name: 'Features', icon: '⭐' }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    alert('Thank you for your message! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setShowContactForm(false);
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>🤝 Help & Support</h1>
        <p>Find answers to common questions and get the support you need</p>
      </div>

      <div className="help-container">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <p className="search-results">
            {searchTerm ? `Found ${filteredFaqs.length} result${filteredFaqs.length !== 1 ? 's' : ''}` : ''}
          </p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <h3>Browse by Category</h3>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          
          {filteredFaqs.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try adjusting your search terms or browse by category</p>
            </div>
          ) : (
            <div className="faq-list">
              {filteredFaqs.map((item, index) => (
                <div key={item.id} className="faq-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="faq-question">
                    <h3>Q: {item.q}</h3>
                    <span className="faq-category">{categories.find(c => c.id === item.category)?.name}</span>
                  </div>
                  <div className="faq-answer">
                    <p><strong>A:</strong> {item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <div className="contact-header">
            <h2>Still Need Help?</h2>
            <p>Can't find what you're looking for? We're here to help!</p>
          </div>

          <div className="contact-options">
            <div className="contact-option">
              <div className="contact-icon">📚</div>
              <h3>Documentation</h3>
              <p>Check out our comprehensive documentation</p>
              <Link to="/docs" className="contact-link">View Docs</Link>
            </div>

            <div className="contact-option">
              <div className="contact-icon">📧</div>
              <h3>Email Support</h3>
              <p>Send us a message and we'll respond quickly</p>
              <button 
                className="contact-link"
                onClick={() => setShowContactForm(!showContactForm)}
              >
                Contact Us
              </button>
            </div>

            <div className="contact-option">
              <div className="contact-icon">💬</div>
              <h3>Live Chat</h3>
              <p>Chat with our support team in real-time</p>
              <button className="contact-link">Start Chat</button>
            </div>
          </div>

          {/* Contact Form */}
          {showContactForm && (
            <div className="contact-form-container">
              <form onSubmit={handleContactSubmit} className="contact-form">
                <h3>Send us a Message</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    rows="5"
                    required
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Send Message
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowContactForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
