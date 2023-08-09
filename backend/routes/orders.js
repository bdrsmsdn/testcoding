const router = require('express').Router();
const Orders = require('../models/orders');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '../.env' });
const secKey = process.env.SECRET_KEY;

router.get('/', async (req, res) => {
  const token = req.headers['x-access-token'];

  try {
    if (!token) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, secKey);

    if (decoded) {
      const orders = await Orders.find().populate('car user');
      res.status(200).json(orders);
    } else {
      res.status(401).json({ error: true, message: 'Unauthorized' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const token = req.headers['x-access-token'];

  try {
    if (!token) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, secKey);

    if (decoded) {
      const orders = await Orders.findById(req.params.id).populate('car user');
      res.status(200).json(orders);
    } else {
      res.status(401).json({ error: true, message: 'Unauthorized' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  const token = req.headers['x-access-token'];
  const userId = req.params.userId;

  try {
    if (!token) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, secKey);

    if (decoded) {
      const orders = await Orders.find({ user: userId }).populate('car user');
      res.status(200).json(orders);
    } else {
      res.status(401).json({ error: true, message: 'Unauthorized' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const token = req.headers['x-access-token'];

  try {
    if (!token) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, secKey);

    if (req.body.dropoffDate < req.body.pickupDate) {
      res.status(401).json({ error: true, message: 'Something went wrong.' });
    }

    if (decoded) {
      const newOrder = {
        pickupLoc: req.body.pickupLoc,
        dropoffLoc: req.body.dropoffLoc,
        pickupDate: req.body.pickupDate,
        dropoffDate: req.body.dropoffDate,
        pickupTime: req.body.pickupTime,
        car: req.body.car,
        user: req.body.user,
      };

      await Orders.create(newOrder);

      res.status(201).json({ error: false, message: 'Add order successfully.' });
    } else {
      res.status(401).json({ error: true, message: 'Unauthorized' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const token = req.headers['x-access-token'];

  try {
    if (!token) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, secKey);

    if (decoded) {
      const updatedOrder = {
        pickupLoc: req.body.pickupLoc,
        dropoffLoc: req.body.dropoffLoc,
        pickupDate: req.body.pickupDate,
        dropoffDate: req.body.dropoffDate,
        pickupTime: req.body.pickupTime,
        car: req.body.car,
        user: req.body.user,
      };

      const order = await Orders.findByIdAndUpdate(req.params.id, updatedOrder, { new: true });

      if (!order) {
        return res.status(404).json({ error: true, message: 'Order not found' });
      }

      res.status(200).json({ error: false, message: 'Update order successfully.' });
    } else {
      res.status(401).json({ error: true, message: 'Unauthorized' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  const token = req.headers['x-access-token'];

  try {
    if (!token) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, secKey);

    if (decoded) {
      const order = await Orders.findByIdAndDelete(req.params.id);

      if (!order) {
        return res.status(404).json({ error: true, message: 'Order not found' });
      }

      res.status(200).json({ error: false, message: 'Delete order successfully.' });
    } else {
      res.status(401).json({ error: true, message: 'Unauthorized' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

module.exports = router;
