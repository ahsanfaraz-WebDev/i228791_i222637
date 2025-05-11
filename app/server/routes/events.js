import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
router.post(
  '/',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('category').isIn([
      'workshop',
      'charity',
      'social',
      'networking',
      'conference',
      'other',
    ]).withMessage('Invalid category'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, date, location, category, image } = req.body;

      // Create new event
      const event = new Event({
        title,
        description,
        date,
        location,
        category,
        image,
        creator: req.user._id,
        attendees: [req.user._id], // Creator is automatically an attendee
      });

      await event.save();

      // Add event to user's created events
      await User.findByIdAndUpdate(req.user._id, {
        $push: { createdEvents: event._id, joinedEvents: event._id },
      });

      // Populate creator name
      await event.populate('creator', 'name');

      res.status(201).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      location, 
      date, 
      search,
      limit = 100 // Default limit
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (date) {
      const queryDate = new Date(date);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filter.date = { 
        $gte: queryDate,
        $lt: nextDay
      };
    } else {
      // If no date specified, only show future events
      filter.date = { $gte: new Date() };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(filter)
      .populate('creator', 'name')
      .populate('attendees', 'name')
      .sort({ date: 1 })
      .limit(Number(limit));

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get events created by user
// @route   GET /api/events/created
// @access  Private
router.get('/created', protect, async (req, res) => {
  try {
    const events = await Event.find({ 
      creator: req.user._id,
      date: { $gte: new Date() }
    })
      .populate('creator', 'name')
      .populate('attendees', 'name')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get events user is attending
// @route   GET /api/events/attending
// @access  Private
router.get('/attending', protect, async (req, res) => {
  try {
    const events = await Event.find({ 
      attendees: req.user._id,
      creator: { $ne: req.user._id }, // Exclude events created by the user
      date: { $gte: new Date() }
    })
      .populate('creator', 'name')
      .populate('attendees', 'name')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get past events for the user
// @route   GET /api/events/past
// @access  Private
router.get('/past', protect, async (req, res) => {
  try {
    const events = await Event.find({ 
      attendees: req.user._id,
      date: { $lt: new Date() }
    })
      .populate('creator', 'name')
      .populate('attendees', 'name')
      .sort({ date: -1 }); // Latest past events first

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'name')
      .populate('attendees', 'name');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
router.put(
  '/:id',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('category').isIn([
      'workshop',
      'charity',
      'social',
      'networking',
      'conference',
      'other',
    ]).withMessage('Invalid category'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Check event ownership
      if (event.creator.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this event' });
      }

      const { title, description, date, location, category, image } = req.body;

      // Update event
      event = await Event.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          date,
          location,
          category,
          image,
        },
        { new: true }
      ).populate('creator', 'name').populate('attendees', 'name');

      res.json(event);
    } catch (error) {
      console.error(error);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check event ownership
    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Remove event from users' created events and joined events
    await User.updateMany(
      { $or: [{ createdEvents: event._id }, { joinedEvents: event._id }] },
      { $pull: { createdEvents: event._id, joinedEvents: event._id } }
    );

    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Join an event
// @route   POST /api/events/:id/join
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already attending
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already attending this event' });
    }

    // Add user to attendees
    event.attendees.push(req.user._id);
    await event.save();

    // Add event to user's joined events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { joinedEvents: event._id },
    });

    // Return updated event with populated fields
    const updatedEvent = await Event.findById(req.params.id)
      .populate('creator', 'name')
      .populate('attendees', 'name');

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Leave an event
// @route   DELETE /api/events/:id/join
// @access  Private
router.delete('/:id/join', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the creator
    if (event.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Creator cannot leave the event' });
    }

    // Check if user is attending
    if (!event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Not attending this event' });
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== req.user._id.toString()
    );
    await event.save();

    // Remove event from user's joined events
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { joinedEvents: event._id },
    });

    // Return updated event with populated fields
    const updatedEvent = await Event.findById(req.params.id)
      .populate('creator', 'name')
      .populate('attendees', 'name');

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;