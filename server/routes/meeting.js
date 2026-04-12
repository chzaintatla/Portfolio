const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const supabase = require('../utils/supabase');

// Validation rules
const meetingValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required'),
];

// POST /api/meeting
router.post('/', meetingValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { title, description, startTime, endTime, clientId } = req.body;

    // Save to Supabase (Meetings Table)
    const { data, error: sbError } = await supabase
      .from('meetings')
      .insert([
        { 
          title, 
          description, 
          start_time: startTime, 
          end_time: endTime, 
          client_id: clientId || null,
          status: 'pending'
        }
      ])
      .select();

    if (sbError) {
      console.error('⚠️ Supabase meeting save failed:', sbError.message);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.status(201).json({
      success: true,
      message: 'Meeting requested successfully!',
      data: data[0],
    });
  } catch (error) {
    console.error('Meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule meeting',
    });
  }
});

module.exports = router;
