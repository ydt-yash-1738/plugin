require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.js');
const weatherRoutes = require('./routes/weatherRouter.js')
const sqFtRoutes = require('./routes/sqFt.js')

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/weather', weatherRoutes);
app.use('/api/sqft', sqFtRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
