const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules for form data
const formValidation = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('companyAddress').trim().notEmpty().withMessage('Company address is required'),
  body('companyEmail').isEmail().withMessage('Valid company email is required'),
  body('clientName').trim().notEmpty().withMessage('Client name is required'),
  body('clientAddress').trim().notEmpty().withMessage('Client address is required'),
  body('invoiceNumber').trim().notEmpty().withMessage('Invoice number is required'),
  body('invoiceDate').isISO8601().withMessage('Valid invoice date is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.description').trim().notEmpty().withMessage('Item description is required'),
  body('items.*.quantity').isFloat({ min: 0 }).withMessage('Valid quantity is required'),
  body('items.*.rate').isFloat({ min: 0 }).withMessage('Valid rate is required'),
  body('items.*.amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Valid subtotal is required'),
  body('total').isFloat({ min: 0 }).withMessage('Valid total is required'),
  handleValidationErrors
];

// @route   GET /api/forms
// @desc    Get all forms with pagination and filtering
// @access  Public (for now, can be made private later)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.clientName) {
      filter.clientName = { $regex: req.query.clientName, $options: 'i' };
    }
    if (req.query.invoiceNumber) {
      filter.invoiceNumber = { $regex: req.query.invoiceNumber, $options: 'i' };
    }

    // Build sort object
    const sort = {};
    if (req.query.sortBy) {
      const order = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[req.query.sortBy] = order;
    } else {
      sort.createdAt = -1; // Default sort by creation date
    }

    const forms = await Form.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Form.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: forms,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching forms'
    });
  }
});

// @route   GET /api/forms/:id
// @desc    Get single form by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).select('-__v');
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    res.json({
      success: true,
      data: form
    });

  } catch (error) {
    console.error('Error fetching form:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid form ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching form'
    });
  }
});

// @route   POST /api/forms
// @desc    Create new form
// @access  Public
router.post('/', formValidation, async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();

    res.status(201).json({
      success: true,
      message: 'Form created successfully',
      data: form
    });

  } catch (error) {
    console.error('Error creating form:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Invoice number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating form'
    });
  }
});

// @route   PUT /api/forms/:id
// @desc    Update form
// @access  Public
router.put('/:id', formValidation, async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    res.json({
      success: true,
      message: 'Form updated successfully',
      data: form
    });

  } catch (error) {
    console.error('Error updating form:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid form ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating form'
    });
  }
});

// @route   DELETE /api/forms/:id
// @desc    Delete form
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    res.json({
      success: true,
      message: 'Form deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting form:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid form ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting form'
    });
  }
});

// @route   GET /api/forms/stats/overview
// @desc    Get form statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Form.getStats();
    
    // Get status distribution
    const statusStats = await Form.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly totals for the last 6 months
    const monthlyStats = await Form.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats,
        statusDistribution: statusStats,
        monthlyStats: monthlyStats
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router; 