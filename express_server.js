const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

function generateRandomString() {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 1; i <= 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return randomString;
};
// generates random string for short URL

const urlsForUser = function(id) {
  let userURLS = {};
  for (let shortURL in urlDatabase) {
    if (id === urlDatabase[shortURL].userID) {
      userURLS[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLS;
};

app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
//allows our server to use cookie-parser library in express

app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "a" }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});
//this is the home page. ex: http://www.google.com/ <=just one slash at the end

 app.get("/urls", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id], urls: urlsForUser(req.cookies.user_id) };
  res.render("urls_index", templateVars);
});
// loads my URLs page

app.get("/urls/new", (req, res) => {
  if(!req.cookies.user_id) {
    return res.redirect('/login');
  }
  let templateVars = { user: users[req.cookies.user_id] };
  res.render("urls_new", templateVars);
});
//loads Create New URL page

app.get("/urls/:shortURL", (req, res) => {
  let templateVars;
  if (users[req.cookies.user_id]) {
    templateVars = { user: users[req.cookies.user_id], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, userCheckOne: users[req.cookies.user_id].id, userCheckTwo: urlDatabase[req.params.shortURL].userID };
  } else {
    templateVars = { user: users[req.cookies.user_id], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
  }

  res.render("urls_show", templateVars);
});
// Loads edit page for short URLS
//template Vars helps fill out incomplete ejs files so they can run

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.cookies.user_id}
  res.redirect(`/urls/${shortURL}`);
});
//makes random short URL when creating new link
// must put http:// when posting longURL

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});
//if client makes non-existent shortURL request, goes to undefined and page doesn't load

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect(`/urls`);
});
//deletes short URL using delete button

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});
//saves shortURL link as new longURL in input

app.get("/register", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.render("registration", templateVars);
});
//loads register page

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Username and Password field both required.');
  }
  for (let user in users) {
    if (users[user].email === req.body.email) {
      return res.status(400).send('This email has already been registered for an account.');
    }
  }
  const id = generateRandomString();
  users[id] = req.body;
  users[id].id = id;
  res.cookie('user_id', id);
  res.redirect(`/urls`);
});
//when click register on /register page, makes random id, stores email, pw, id into users object, stores id in cookie

app.get("/login", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.render("login", templateVars);
});
//loads login page

app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Username and Password field both required.');
  }
  for (let user in users) {
    if (users[user].email === req.body.email) {
      if (users[user].password === req.body.password) {
        res.cookie('user_id', users[user].id);
        res.redirect(`/urls`)
      } else {
        return res.status(403).send('The inputted password for this email is incorrect.');
      }
    }
  }
  return res.status(403).send('The inputted password for this email is incorrect.');
});
//log in page post functionality

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls')
});
//clears the cookie, logs out user

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));