const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  // Company Information
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyAddress: {
    type: String,
    required: true,
    trim: true
  },
  companyEmail: {
    type: String,
    required: true,
    trim: true
  },
  companyPhone: {
    type: String,
    trim: true
  },

  // Client Information
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientAddress: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    trim: true
  },
  clientPhone: {
    type: String,
    trim: true
  },

  // Invoice Details
  invoiceNumber: {
    type: String,
    required: true,
    trim: true
  },
  invoiceDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },

  // Items
  items: [{
    description: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    rate: {
      type: Number,
      required: true,
      min: 0
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
  }],

  // Financial Details
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },

  // Currency
  currency: {
    type: String,
    default: 'USD',
    trim: true
  },

  // Additional Information
  notes: {
    type: String,
    trim: true
  },
  terms: {
    type: String,
    trim: true
  },

  // Metadata
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'forms' // Explicitly set collection name
});

// Index for better query performance
formSchema.index({ invoiceNumber: 1 });
formSchema.index({ clientName: 1 });
formSchema.index({ status: 1 });
formSchema.index({ createdAt: -1 });

// Virtual for formatted invoice number
formSchema.virtual('formattedInvoiceNumber').get(function() {
  return `INV-${this.invoiceNumber.padStart(6, '0')}`;
});

// Pre-save middleware to update updatedAt
formSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get invoice statistics
formSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        totalAmount: { $sum: '$total' },
        averageAmount: { $avg: '$total' }
      }
    }
  ]);
  return stats[0] || { totalInvoices: 0, totalAmount: 0, averageAmount: 0 };
};

// Instance method to calculate totals
formSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);
  this.taxAmount = (this.subtotal * this.taxRate) / 100;
  this.total = this.subtotal + this.taxAmount + this.shipping - this.discount;
  return this.total;
};

module.exports = mongoose.model('Form', formSchema); 