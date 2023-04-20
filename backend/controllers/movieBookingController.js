// Import the required modules
const fs = require('fs');
const asyncHandler = require('express-async-handler')
const path = require('path');
const pdfkit = require('pdfkit');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const BookingForMovie = require('../models/bookingForMovieModel');
const mongoose = require('mongoose');
const User = require('../models/userModel')
const Show = require('../models/showModel')

let movieName = '';
let date = '';
let time = '';
let seatNumbers = [];
let userEmail = '';
let totalPrice = 0;
let status = '';
let userName = '';
let seatNos = [];

// @desc    Set movie booking
// @route   POST /api//movieBooking/
// @access  Private
const setMovieBooking = asyncHandler(async (req, res) => {
  // get data from the request body
  const { totalPrice, seatNos, showId, movieName, bookingDate, status, noOfSeats, bookingTime } = req.body;
  const userId = req.id;
  // create a new booking object
  const booking = {
    userId,
    totalPrice,
    seatNos,
    showId,
    bookingDate,
    status,
    noOfSeats,
    bookingTime,
    movieName
  };


  if (!req.body.totalPrice && !req.body.seatId && !req.body.showId && !req.body.bookingDate && !req.body.status && !req.body.noOfSeats && !req.body.bookingTime) {
    res.status(400)
    throw new Error('Please add booking fields')
  }

  const movieBooking = await BookingForMovie.create(booking)

  res.status(201).json(movieBooking)
})

// @desc    send movie booking ticket
// @route   GET /api/movieBooking/sendTicketAsEmail
// @access  Private
const sendMovieBookingTicketByMail = asyncHandler(async (req, res) => {
  console.log("in movieBooking ticket");
  const userId = req.id;
  // const userIdObj = new mongoose.Types.ObjectId(userId);
  // console.log(userIdObj);
  const bookingDetails = await BookingForMovie.find({ "userId": userId });
  console.log(bookingDetails);
  totalPrice = bookingDetails[0].totalPrice;
  status = bookingDetails[0].status;
  seatNos = bookingDetails[0].seatNos;
  seatNumbers = bookingDetails[0].seatNos;
  movieName = bookingDetails[0].movieName;
  console.log(seatNos);
  const showId = bookingDetails[0].showId;
  console.log(showId);
  console.log(totalPrice);
  const user = await User.find({ "_id": userId });
  console.log(user);
  userEmail = user[0].email;
  userName = user[0].name;

  const show = await Show.find({ "_id": showId });
  console.log(show);
  time = show[0].startTime;
  date = show[0].date;

  // Step 1: Create a PDF file with the movie seat booking details
  const doc = new pdfkit();
  const filename = `${movieName}.pdf`;
  console.log("filename " + filename);
  console.log("dirname " + __dirname);
  const filepath = path.join(__dirname, filename);

  console.log("filepath " + filepath);

  doc.pipe(fs.createWriteStream(filepath));
  doc
  .fontSize(18)
  .text(`Name: ${userName}`, 100, 100)
  .moveDown()
  .text(`Movie Name: ${movieName}`, 100, 150)
  .moveDown()
  .text(`Date: ${date}`, 100, 200)
  .text(`Time: ${time}`, 100, 250)
  .text(`Total Price: ${totalPrice}`, 100, 420)
  .text(`Booking Status: ${status}`, 100, 470)
  .text('Seat Numbers:', 100, 300);

seatNumbers.forEach((seatNumber, index) => {
  doc.text(`Seat ${index + 1}: ${seatNumber}`, 150, 320 + index * 20);
});

doc.end();

  //Step 2: Create a Nodemailer transporter
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: 'yourgmailaccount@gmail.com',
  //     pass: 'yourgmailpassword'
  //   }
  //});
  let transporter = nodemailer.createTransport({
    host: 'webmail.evolvingsols.com',
    port: 25, // or 587 for non-SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'FET@evolvingsols.com',
      pass: 'Gmail#@5689'
    }
  });

  // Step 3: Create an email template that includes the PDF file as an attachment
  const emailTemplatePath = path.join(__dirname, 'email-template.html');
  const source = fs.readFileSync(emailTemplatePath, 'utf8');
  const template = handlebars.compile(source);

  const emailData = {
    movieName: movieName,
    date: date,
    time: time,
    userName: userName,
    seatNos: seatNos,
    totalPrice: totalPrice,
    status: status
  };

  const emailHtml = template(emailData);

  // Step 4: Send the email with the PDF attachment
  transporter.sendMail({
    from: 'FET@evolvingsols.com',
    to: userEmail,
    subject: 'Movie Seat Booking Details',
    html: emailHtml,
    attachments: [
      {
        filename: filename,
        path: filepath
      }
    ]
  }, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
      res.status(200).json({ message: "Movie Ticket  sent successfully via Email" })
    }

    // Remove the PDF file after sending the email
    fs.unlinkSync(filepath);
  });



})




module.exports = { sendMovieBookingTicketByMail, setMovieBooking }