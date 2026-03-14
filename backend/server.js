

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');


const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const pollRoutes = require('./routes/polls');

const app = express();

connectDB();


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static('uploads'));



app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/polls', pollRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'NeoConnect API is running' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
