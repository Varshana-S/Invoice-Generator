import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './InvoiceForm.css';

const InvoiceForm = () => {
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [items, setItems] = useState([{ description: '', qty: 1, price: 0 }]);

  const [from, setFrom] = useState('');
  const [billTo, setBillTo] = useState('');
  const [shipTo, setShipTo] = useState('');
  const [date, setDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('INR (₹)');

  // New state for backend integration
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [currentInvoiceId, setCurrentInvoiceId] = useState(null);

  const getSymbol = () => {
    if (currency.includes('$')) return '$';
    if (currency.includes('₹')) return '₹';
    if (currency.includes('€')) return '€';
    if (currency.includes('¥')) return '¥';
    return '';
  };

  const addItem = () => {
    if (items.length >= 6) return;
    setItems([...items, { description: '', qty: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'description' ? value : Number(value);
    setItems(updated);
  };

  const clearInvoice = () => {
    setItems([{ description: '', qty: 1, price: 0 }]);
    setTax(0);
    setDiscount(0);
    setShipping(0);
    setAmountPaid(0);
    setFrom('');
    setBillTo('');
    setShipTo('');
    setDate('');
    setPaymentTerms('');
    setDueDate('');
    setCurrentInvoiceId(null);
    setError('');
    setSuccess('');
  };

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const taxAmount = (total * tax) / 100;
  const finalTotal = total + shipping + taxAmount - discount;
  const balanceDue = finalTotal - amountPaid;

  const isFormFilled = () => {
    if (!from.trim() || !billTo.trim()) return false;
    return items.some(item => item.description.trim() && item.price > 0);
  };

  // Save invoice to backend
  const saveInvoice = async () => {
    if (!isFormFilled()) {
      setError('Please fill in required fields before saving');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const invoiceData = {
        companyName: from,
        companyAddress: '', // You might want to add this field to the form
        companyEmail: '', // You might want to add this field to the form
        clientName: billTo,
        clientAddress: shipTo,
        clientEmail: '', // You might want to add this field to the form
        invoiceNumber: `INV-${Date.now()}`,
        invoiceDate: date,
        dueDate: dueDate,
        items: items.map(item => ({
          description: item.description,
          quantity: item.qty,
          rate: item.price,
          amount: item.qty * item.price
        })),
        subtotal: total,
        taxRate: tax,
        taxAmount: taxAmount,
        discount: discount,
        shipping: shipping,
        total: finalTotal,
        currency: currency.split(' ')[0], // Extract currency code
        notes: '',
        terms: paymentTerms,
        status: 'draft'
      };

      let response;
      if (currentInvoiceId) {
        // Update existing invoice
        response = await apiService.updateForm(currentInvoiceId, invoiceData);
        setSuccess('Invoice updated successfully!');
      } else {
        // Create new invoice
        response = await apiService.createForm(invoiceData);
        setCurrentInvoiceId(response.data._id);
        setSuccess('Invoice saved successfully!');
      }

      // Refresh saved invoices list
      loadSavedInvoices();
      
    } catch (error) {
      setError(error.message || 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  // Load saved invoices
  const loadSavedInvoices = async () => {
    try {
      const response = await apiService.getForms();
      setSavedInvoices(response.data || []);
    } catch (error) {
      console.error('Failed to load saved invoices:', error);
    }
  };

  // Load a specific invoice
  const loadInvoice = async (invoiceId) => {
    try {
      const response = await apiService.getForm(invoiceId);
      const invoice = response.data;
      
      // Populate form with invoice data
      setFrom(invoice.companyName || '');
      setBillTo(invoice.clientName || '');
      setShipTo(invoice.clientAddress || '');
      setDate(invoice.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split('T')[0] : '');
      setPaymentTerms(invoice.terms || '');
      setDueDate(invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '');
      setCurrency(invoice.currency || 'USD ($)');
      setItems(invoice.items || [{ description: '', qty: 1, price: 0 }]);
      setTax(invoice.taxRate || 0);
      setDiscount(invoice.discount || 0);
      setShipping(invoice.shipping || 0);
      setAmountPaid(0); // This field might not exist in the new schema
      
      setCurrentInvoiceId(invoiceId);
      setSuccess('Invoice loaded successfully!');
      
    } catch (error) {
      setError('Failed to load invoice');
    }
  };

  // Load saved invoices on component mount
  useEffect(() => {
    loadSavedInvoices();
  }, []);

  useEffect(() => {
    const scaleForPrint = () => {
      const el = document.querySelector('.invoice-card');
      const fullHeight = el.scrollHeight;
      if (fullHeight > 1100) {
        el.style.transform = 'scale(0.85)';
      } else {
        el.style.transform = 'scale(1)';
      }
    };
    window.onbeforeprint = scaleForPrint;
    return () => {
      window.onbeforeprint = null;
    };
  }, []);

  return (
    <div className="invoice-page-container">
      <div className="topbar no-print">
        <button
          className="download-btn"
          disabled={!isFormFilled()}
          onClick={() => window.print()}
        >
          ⬇ Download
        </button>

        <div className="currency-select">
          <label>Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option>USD ($)</option>
            <option>INR (₹)</option>
            <option>EUR (€)</option>
            <option>JPY (¥)</option>
            <option>GBP (£)</option>
            <option>BTC (₿)</option>
          </select>
        </div>

        
        <button className="clear-btn" onClick={clearInvoice}>Clear Invoice</button>
      </div>

      {/* Error and Success Messages */}
      {error && <div className="error-message no-print">{error}</div>}
      {success && <div className="success-message no-print">{success}</div>}

      {/* Saved Invoices List */}
      {savedInvoices.length > 0 && (
        <div className="saved-invoices no-print">
          <h3>Saved Invoices</h3>
          <div className="invoices-list">
            {savedInvoices.map((invoice) => (
              <div key={invoice._id} className="invoice-item">
                <span>{invoice.invoiceNumber || 'Invoice'}</span>
                <span>{invoice.clientName || 'No recipient'}</span>
                <span>{invoice.total ? `${getSymbol()} ${invoice.total.toFixed(2)}` : 'No total'}</span>
                <button onClick={() => loadInvoice(invoice._id)}>Load</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="main-layout">
        <div className="invoice-card">
          <div className="invoice-title">INVOICE</div>

          <div className="invoice-grid">
            <div>
              <label className="invoice-label">Who is this from?</label>
              <input
                className="invoice-input"
                placeholder="Your company name"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="invoice-label">Invoice #</label>
              <input className="invoice-input" value="98761" readOnly />
            </div>
            <div>
              <label className="invoice-label">Bill To</label>
              <input
                className="invoice-input"
                placeholder="Who is this to?"
                value={billTo}
                onChange={(e) => setBillTo(e.target.value)}
              />
            </div>
            <div>
              <label className="invoice-label">Ship To</label>
              <input
                className="invoice-input"
                placeholder="(optional)"
                value={shipTo}
                onChange={(e) => setShipTo(e.target.value)}
              />
            </div>
            <div>
              <label className="invoice-label">Date</label>
              <input
                type="date"
                className="invoice-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="invoice-label">Payment Terms</label>
              <input
                className="invoice-input"
                placeholder="e.g., Net 30"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
              />
            </div>
            <div>
              <label className="invoice-label">Due Date</label>
              <input
                type="date"
                className="invoice-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
                <th className="no-print">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td>
                    <input
                      className="invoice-input"
                      value={item.description}
                      onChange={(e) => handleChange(i, 'description', e.target.value)}
                      placeholder="Item/service description"
                    />
                  </td>
                  <td>
                    <input
                      className="invoice-input"
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleChange(i, 'qty', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="invoice-input"
                      type="number"
                      value={item.price}
                      onChange={(e) => handleChange(i, 'price', e.target.value)}
                    />
                  </td>
                  <td>{getSymbol()} {(item.qty * item.price).toFixed(2)}</td>
                  <td className="no-print">
                    <button onClick={() => removeItem(i)}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-actions no-print">
            <button className="line-btn" onClick={addItem}>+ Line Item</button>
          </div>

          <div className="invoice-total-section">
            <div><label>Subtotal:</label> {getSymbol()} {total.toFixed(2)}</div>
            <div>
              <label>Tax (%)</label>
              <input
                type="number"
                className="invoice-input"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Discount ({currency})</label>
              <input
                type="number"
                className="invoice-input"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Shipping ({currency})</label>
              <input
                type="number"
                className="invoice-input"
                value={shipping}
                onChange={(e) => setShipping(Number(e.target.value))}
              />
            </div>
            <div><label>Total:</label> {getSymbol()} {finalTotal.toFixed(2)}</div>
            <div>
              <label>Amount Paid:</label>
              <input
                type="number"
                className="invoice-input"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
              />
            </div>
            <div><label>Balance Due:</label> {getSymbol()} {balanceDue.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
