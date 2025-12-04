const express = require('express');
const router = express.Router();
const rpgSystem = require('../services/rpgSystem');

// GET /api/profile
// Returns calculated stats and profile data
router.get('/profile', (req, res) => {
  try {
    const data = rpgSystem.calculateStats();
    res.json(data);
  } catch (error) {
    console.error("Error calculating stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/profile/update (Placeholder for future)
router.post('/profile/update', (req, res) => {
  res.json({ message: "Update endpoint ready for implementation" });
});

module.exports = router;
