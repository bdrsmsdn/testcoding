const router = require('express').Router();
const Cars = require('../models/cars');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '../.env' });
const secKey = process.env.SECRET_KEY;

function getDate() {
  var date = new Date();
  var year = date.toLocaleString('id-ID', { year: 'numeric' });
  var month = date.toLocaleString('id-ID', { month: '2-digit' });
  var day = date.toLocaleString('id-ID', { day: '2-digit' });
  var hour = date.toLocaleString('id-ID', { hour: '2-digit' });
  var minute = date.toLocaleString('id-ID', { minute: '2-digit' });
  var second = date.toLocaleString('id-ID', { second: '2-digit' });
  var formattedDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  return formattedDate;
}

router.post('/', async (req, res) => {
  const token = req.headers['x-access-token'];

  try {
    if (!token) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, secKey);

    if (decoded) {
      const newCar = {
        carName: req.body.carName,
        carType: req.body.carType,
        rating: req.body.rating,
        fuel: req.body.fuel,
        image: req.body.image || '',
        hourRate: req.body.hourRate,
        dayRate: req.body.dayRate,
        monthRate: req.body.monthRate,
      };

      await Cars.create(newCar);

      res.status(201).json({ error: false, message: 'Add data successfully.' });
    } else {
      res.status(401).json({ error: true, message: 'Unauthorized' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  const token = req.headers['x-access-token'];

  try {
    if (!token) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, secKey);

    if (decoded) {
      const cars = await Cars.find();
      res.status(200).json(cars);
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
      const cars = await Cars.findByIdAndDelete(req.params.id);

      if (!cars) {
        return res.status(404).json({ error: true, message: 'Car not found' });
      }

      res.status(200).json({ error: false, message: 'Delete car successfully.' });
    } else {
      res.status(401).json({ error: true, message: 'Unauthorized' });
    }
  } catch (err) {
    console.log(err);
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
      let cars = await Cars.findById(req.params.id);

      const data = {
        carName: req.body.carName || cars.carName,
        carType: req.body.carType || cars.carType,
        rating: req.body.rating || cars.rating,
        fuel: req.body.fuel || cars.fuel,
        image: req.body.image || cars.image,
        hourRate: req.body.hourRate || cars.hourRate,
        dayRate: req.body.dayRate || cars.dayRate,
        monthRate: req.body.monthRate || cars.monthRate,
      };

      cars = await Cars.findByIdAndUpdate(req.params.id, data, { new: true });

      res.status(201).json({ error: false, message: 'Edit data successfully.' });
    } else {
      res.status(401).json({ error: true, message: 'Unauthorized' });
    }
  } catch (err) {
    console.log(err);
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
      let cars = await Cars.findById(req.params.id);
      res.status(200).json(cars);
    } else {
      res.status(401).json({ error: true, message: 'Unauthorized' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

module.exports = router;
