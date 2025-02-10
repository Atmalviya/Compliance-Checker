export const validateLogEvidence = (req, res, next) => {
  const { checkType, status, details } = req.body;
  
  if (!checkType || typeof status !== 'boolean' || !details) {
    return res.status(400).json({
      error: 'Missing required fields: checkType, status, and details'
    });
  }
  
  next();
};

export const validateAutoFix = (req, res, next) => {
  const { fixType, resourceId } = req.body;
  
  if (!fixType || !resourceId) {
    return res.status(400).json({
      error: 'Missing required fields: fixType and resourceId'
    });
  }
  
  if (fixType !== 'ENABLE_RLS') {
    return res.status(400).json({
      error: 'Invalid fixType. Currently only supports: ENABLE_RLS'
    });
  }
  
  next();
}; 