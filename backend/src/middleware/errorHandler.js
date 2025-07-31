// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // MongoDB errors
  if (err.name === 'MongooseError') {
    return res.status(500).json({
      error: {
        message: 'Database error occurred',
        code: 'DATABASE_ERROR'
      }
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: err.message
      }
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      code: 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler; 