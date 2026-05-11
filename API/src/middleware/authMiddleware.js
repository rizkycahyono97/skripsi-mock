export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid API Key'
    });
  }
  next();
};
