const { application } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { cookie } = require("express/lib/response");
const  {requireAuth, checkUser}= require('./middleware/authMiddleware')

const app = express();

//to read .env file
require("dotenv/config");

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");


// database connection
const DB_Connection = process.env.Connection_String;
const dbURI =
  "mongodb+srv://hamxa:hamza.ahmad@cluster0.ylvyz.mongodb.net/node-auth?retryWrites=true&w=majority";
mongoose
  .connect(DB_Connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(3000);
    console.log(`Server Started at port 3000`);
  })
  .catch((err) => console.log(err));

  app.get('*',checkUser);
// routes
app.get("/",requireAuth, (req, res) => res.render("home"));
app.get("/smoothies",requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);

// //cookies
// app.get("/set-cookies", (req, res) => {
//   // res.setHeader("Set-Cookie", "newUser=true");
//   res.cookie("newUser", false);
//   res.cookie("isEmployee", true, {
//     maxAge: 1000 * 60 * 60 * 24,
//     secure: true,
//     httpOnly: true,
//   });

//   res.send("You got the cookie");
// });
// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies);
//   res.json(cookies.newUser)
// });
