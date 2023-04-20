// Import the required modules
const fs = require('fs');
const asyncHandler = require('express-async-handler')
const path = require('path');
const pdfkit = require('pdfkit');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const BookingForEvent = require('../models/bookingForEventModel');
const mongoose = require('mongoose');
const User = require('../models/userModel')
const Show = require('../models/showModel')

let eventName = '';
let date = '';
let time = '';
let totalSeats = '';
let userEmail = '';
let totalPrice = 0;
let status = '';
let userName = '';


// @desc    Set event booking
// @route   POST /api/eventBooking/
// @access  Private
const setEventBooking = asyncHandler(async (req, res) => {
  // get data from the request body
  const { totalPrice, totalSeats, eventName, bookingDate, status, bookingTime } = req.body;
  const userId = req.id;
  // create a new booking object
  const booking = {
    userId,
    totalPrice,
    bookingDate,
    status,
    totalSeats,
    bookingTime,
    eventName
  };

  const eventBooking = await BookingForEvent.create(booking)

  res.status(201).json(eventBooking)
})

// @desc    send event booking ticket
// @route   GET /api/eventBooking/sendTicketAsEmail
// @access  Private
const sendEventBookingTicketByMail = asyncHandler(async (req, res) => {
  console.log("in movieBooking ticket");
  const userId = req.id;
  const bookingDetails = await BookingForEvent.find({ "userId": userId });
  console.log(bookingDetails);
  totalPrice = bookingDetails[0].totalPrice;
  status = bookingDetails[0].status;
  totalSeats = bookingDetails[0].totalSeats;
  eventName = bookingDetails[0].eventName;
  const user = await User.find({ "_id": userId });
  console.log(user);
  userEmail = user[0].email;
  userName = user[0].name;
  time = bookingDetails[0].bookingTime;
  date = bookingDetails[0].bookingDate;

  // Step 1: Create a PDF file with the movie seat booking details
  const doc = new pdfkit();
  const filename = `${eventName}.pdf`;
  console.log("filename " + filename);
  console.log("dirname " + __dirname);
  const filepath = path.join(__dirname, filename);

  console.log("filepath " + filepath);

  doc.pipe(fs.createWriteStream(filepath));
  doc
  .fontSize(18)
  .text(`Name: ${userName}`, 100, 100)
  .moveDown()
  .text(`Event Name: ${eventName}`, 100, 150)
  .moveDown()
  .text(`Date: ${date}`, 100, 200)
  .text(`Time: ${time}`, 100, 250)
  .text(`Total Price: ${totalPrice}`, 100, 350)
  .text(`Booking Status: ${status}`, 100, 400)
  .text(`Total Seats: ${totalSeats}`, 100, 300);
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
  const emailTemplatePath = path.join(__dirname, 'email-template-event.html');
  const source = fs.readFileSync(emailTemplatePath, 'utf8');
  const template = handlebars.compile(source);

  const emailData = {
    eventName: eventName,
    date: date,
    time: time,
    userName: userName,
    totalSeats: totalSeats,
    totalPrice: totalPrice,
    status: status
  };

  const emailHtml = template(emailData);

  // Step 4: Send the email with the PDF attachment
  transporter.sendMail({
    from: 'FET@evolvingsols.com',
    to: userEmail,
    subject: 'Event Seat Booking Details',
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
      res.status(200).json({ message: "Event Ticket  sent successfully via Email" })
    }

    // Remove the PDF file after sending the email
    fs.unlinkSync(filepath);
  });



})




module.exports = { sendEventBookingTicketByMail, setEventBooking }