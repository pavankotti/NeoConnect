

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Case = require('../models/Case');
const { protect, authorize } = require('../middleware/auth');


const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },


  filename: function (req, file, cb) {


    const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(7);
    cb(null, 'case-' + uniqueSuffix + path.extname(file.originalname));

  }
});


const fileFilter = (req, file, cb) => {

  const allowedTypes = /jpeg|jpg|png|pdf/;


  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());


  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .png, and .pdf files are allowed'));
  }
};


const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});


const generateTrackingId = async () => {


  const year = new Date().getFullYear();


  const latestCase = await Case.findOne({
    trackingId: new RegExp(`^NEO-${year}-`)
  }).sort({ createdAt: -1 });

  let nextNumber = 1;

  if (latestCase) {


    const lastNumber = parseInt(latestCase.trackingId.split('-')[2]);
    nextNumber = lastNumber + 1;
  }


  const paddedNumber = nextNumber.toString().padStart(3, '0');

  return `NEO-${year}-${paddedNumber}`;
};



router.post('/', protect, authorize('staff'), upload.single('attachment'), async (req, res) => {




  try {
    const { category, department, location, severity, description, isAnonymous } = req.body;


    if (!category || !department || !location || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }


    const trackingId = await generateTrackingId();


    const caseData = {
      trackingId,
      category,
      department,
      location,
      severity: severity || 'Low',
      description,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      status: 'New'
    };


    if (!caseData.isAnonymous) {
      caseData.submittedBy = req.user._id;
    }


    if (req.file) {
      caseData.attachmentUrl = req.file.path;
    }


    const newCase = await Case.create(caseData);


    await newCase.populate('submittedBy', 'name email department');



    res.status(201).json({
      success: true,
      case: newCase
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



router.get('/', protect, async (req, res) => {
  try {
    let query = {};


    if (req.user.role === 'staff') {

      query = {
        $or: [
          { submittedBy: req.user._id },
          { isAnonymous: true, department: req.user.department }
        ]
      };
    } else if (req.user.role === 'case_manager') {

      query = { assignedTo: req.user._id };
    }



    const cases = await Case.find(query)
      .populate('submittedBy', 'name email department')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cases.length,
      cases
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/:id', protect, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate('submittedBy', 'name email department')
      .populate('assignedTo', 'name email');

    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }


    const canView =
      req.user.role === 'admin' ||
      req.user.role === 'secretariat' ||
      (req.user.role === 'case_manager' && caseItem.assignedTo && caseItem.assignedTo._id.toString() === req.user._id.toString()) ||
      (req.user.role === 'staff' && caseItem.submittedBy && caseItem.submittedBy._id.toString() === req.user._id.toString());

    if (!canView) {
      return res.status(403).json({ message: 'Not authorized to view this case' });
    }

    res.json({
      success: true,
      case: caseItem
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.put('/:id/assign', protect, authorize('secretariat', 'admin'), async (req, res) => {
  try {
    const { caseManagerId } = req.body;

    if (!caseManagerId) {
      return res.status(400).json({ message: 'Please provide case manager ID' });
    }


    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }


    caseItem.assignedTo = caseManagerId;
    caseItem.status = 'Assigned';

    await caseItem.save();


    await caseItem.populate('assignedTo', 'name email');

    res.json({
      success: true,
      case: caseItem
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.put('/:id/status', protect, authorize('case_manager', 'secretariat', 'admin'), async (req, res) => {
  try {
    const { status, response } = req.body;

    const validStatuses = ['In Progress', 'Pending', 'Resolved', 'Escalated'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }


    if (req.user.role === 'case_manager') {
      if (!caseItem.assignedTo || caseItem.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this case' });
      }
    }


    caseItem.status = status;

    if (response) {
      caseItem.response = response;
      caseItem.lastResponseAt = new Date();
    }

    if (status === 'Resolved') {
      caseItem.resolvedAt = new Date();
    }

    await caseItem.save();

    res.json({
      success: true,
      case: caseItem
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/public/resolved', async (req, res) => {
  try {
    const resolvedCases = await Case.find({ status: 'Resolved' })
      .select('trackingId category department description response resolvedAt')
      .sort({ resolvedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      cases: resolvedCases
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
