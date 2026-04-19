// // Centralized Express error handler middleware

export const errorHandler = (err, _req, res, _next) => {
  // Basic logging – you can customize this
  // eslint-disable-next-line no-console
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // In non-production, you might want to see the stack
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    return res.status(status).json({
      message,
      stack: err.stack,
    });
  }

  return res.status(status).json({ message });
};
