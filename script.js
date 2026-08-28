const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());
const bookings = [];

app.get('/', (req, res) => {
  res.send('Cafe booking server is running!');
});

app.post('/booking', (req, res) => {
  const { name, phone, date, time, guests } = req.body;

  const newBooking = { name, phone, date, time, guests };
  bookings.push(newBooking);

  console.log('New booking received:', newBooking);

  res.send('Thanks ' + name + ', your booking is confirmed!');
});

app.get('/bookings', (req, res) => {
  res.json(bookings);
});

app.listen(3000, () => {
  console.log('Cafe booking server is running on http://localhost:3000');
});
