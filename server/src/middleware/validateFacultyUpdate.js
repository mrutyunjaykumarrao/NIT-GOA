const validateFacultyUpdate = (req, res, next) => {
  const { body } = req;
  
  // Email validation
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }

  // Phone validation (basic)
  if (body.phone && !/^[\d\s\-\+\(\)]+$/.test(body.phone)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid phone format'
    });
  }

  // URL validation
  const urlFields = ['personal_website', 'linkedin_url', 'google_scholar_url', 'researchgate_url', 'orcid_url'];
  for (let field of urlFields) {
    if (body[field] && body[field] !== '') {
      try {
        new URL(body[field]);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: `Invalid URL format for ${field}`
        });
      }
    }
  }

  // Experience years validation
  if (body.experience_years && (isNaN(body.experience_years) || body.experience_years < 0)) {
    return res.status(400).json({
      success: false,
      error: 'Experience years must be a positive number'
    });
  }

  next();
};

module.exports = validateFacultyUpdate;
