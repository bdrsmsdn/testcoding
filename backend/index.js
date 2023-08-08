const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config({ path: __dirname + '/.env' });
const PORT = process.env.PORT || 5000;

// Connect DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongoDB is connected'))
  .catch((err) => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Route
app.use('/users', require('./routes/users'));
app.use('/cars', require('./routes/cars'));
app.use('/orders', require('./routes/orders'));

app.listen(PORT, () => console.log('Server is running at ' + PORT));
