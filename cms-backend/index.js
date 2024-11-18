require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));



app.use(express.json());
const loginRoutes = require('./routes/auth');
app.use('/api/login', loginRoutes);

const addAnnouncements = require('./routes/addAnnouncements');
app.use('/api/add-announcement',addAnnouncements);

const register = require('./routes/register');
app.use('/api/register',register);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define a basic route
app.get('/', (req, res) => {
  console.log("hello user");
  res.send("College Management System Backend");
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
