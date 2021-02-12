// Tested with Postman

const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

app.use(cookieParser());

const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");

// *** Refer to the comments inside login.js ***  Login and signup routing with just cookie parsing.
// Having issues when using "app.use" for the routes, so I used "app.get" for now.

app.get("/signup", signupRouter);
app.get("/login", loginRouter);

// Test user login and signup with password hashing and verification. testUser.js is my mock DB. 
// Good working signup link http://localhost:8080/signup/bob@gmail.com/passwd1
// Good working login link http://localhost:8080/login/bob@gmail.com/passwd1

const user = require("./testUser");
let user1 = user[0];

app.post("/signup/:email/:password", (req, res, next) => {
  const { email, password } = req.params;
  let epCheck = 0;
  if (email.includes("@") && password.length > 6 && (epCheck = 2)) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      console.log(hash);
      user1.hash = hash;    // Store hash in DB (Kanban)
      console.log(user1);  
    });
    res.status(201).send({ msg: "Email and password received." });
  }
  epCheck !== 2 &&
    res
      .status(401)
      .send({ msg: "Email must contain '@' and password must be > 6." });
  next();
});

app.post("/login/:email/:password", (req, res, next) => {
  console.log(req.params);
  const { email, password } = req.params;
  if (user1.email === email && user1.password === password) {
    bcrypt.compare(password, user1.hash, (err, result) => {
      console.log(result);
      if (result) {
        console.log("Let them in!");
        // Get user data from the DB and send to client for rendering
        res.status(200).send({ msg: "In database!" });
        next();
      } else res.status(401).send({ msg: "Check your credentials!" });
    });
  } else res.status(401).send({ msg: "Check your credentials!" });
});

// Server listener
app.listen(8080, () => console.log("Server listening ..."));
