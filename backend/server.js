const dotenv = require('dotenv').config();
const path = require('path');
const express = require('express');
const colors = require('colors');
const chalk = require("chalk");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const { logger } = require('./middleware/loggerMiddleware');
const port = process.env.PORT || 5000;
const fs = require("fs");
const rateLimit = require('express-rate-limit');
//connect to db
connectDB();

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
//// built-in middleware for json 
app.use(express.json());
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));
// custom middleware logger
app.use(logger);
//routes

app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/artists', require('./routes/artistRoutes'));
app.use('/api/cities', require('./routes/cityRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theatres', require('./routes/theatreRoutes'));
app.use('/api/eventBooking', require('./routes/eventBookingRoutes'));
app.use('/api/movieBooking', require('./routes/movieBookingRoutes'));
//for error handling middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

console.log("Hello World");