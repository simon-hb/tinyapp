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

app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
//allows our server to use cookie-parser library in express

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  let templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});
// loads my URLs page

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});
//loads Create New URL page

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});
// Loads edit page for short URLS
//template Vars helps fill out incomplete ejs files so they can run

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`);
});
//makes random short URL when creating new link
// must put http:// when posting longURL

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
//if client makes non-existent shortURL request, goes to undefined and page doesn't load

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect(`/urls`);
});
//deletes short URL using delete button

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});
//saves shortURL link as new longURL in input

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls/')
});
//saves username in cookie, logs in user

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls')
});
//clears the cookie, logs out user

app.get("/register", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  users[id] = req.body;
  users[id].id = id;
  res.cookie('user_id', id);
  res.redirect(`/urls/`);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));