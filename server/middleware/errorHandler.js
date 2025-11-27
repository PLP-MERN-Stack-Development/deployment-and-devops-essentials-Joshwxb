// A simple, centralized error handler middleware
const errorHandler = (err, req, res, next) => {
    // Log the error for server-side inspection
    console.error(err.stack);

    // Determine the status code and message
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'An unknown server error occurred.';

    // Specific handling for Mongoose CastError (e.g., invalid ID format)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400; // Bad Request
        message = 'Invalid resource ID format.';
    }

    // Specific handling for Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400; // Bad Request
        message = Object.values(err.errors).map(val => val.message).join('; ');
    }

    res.status(statusCode).json({
        message: message,
        // Only include stack trace in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;