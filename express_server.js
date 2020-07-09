const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
//const cookieParser = require('cookie-parser'); NO LONGER USE COOKI PARSER
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

const generateRandomString = function() {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
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
//returns urlDatabase containing only shortURLS created id in input

app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser()); NO LONGER USE COOKIE PARSER
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
//allows our server to use cookie-sessionlibrary in express

app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "a" }
};
//just testing to make sure this doesn't show up when new account

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});
//this is the home page. ex: http://www.google.com/ <=just one slash at the end

app.get("/urls", (req, res) => {
  let templateVars = { user: users[req.session.user_id], urls: urlsForUser(req.session.user_id) };
  res.render("urls_index", templateVars);
});
// loads my URLs page only if logged in

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
    return;
  }
  let templateVars = { user: users[req.session.user_id] };
  res.render("urls_new", templateVars);
});
//loads Create New URL page only if logged in

app.get("/urls/:shortURL", (req, res) => {
  let currentUser = users[req.session.user_id];
  let currentURLUser = urlDatabase[req.params.shortURL];
  
  let templateVars = { user: currentUser, shortURL: req.params.shortURL, longURL: currentURLUser && currentURLUser.longURL, userCheckOne: currentUser && currentUser.id, userCheckTwo: currentURLUser && currentURLUser.userID };

  res.render("urls_show", templateVars);
});
// Loads edit page for short URLS only if logged in user created the shortURL
//template Vars helps fill out incomplete ejs files so they can run

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id};
  res.redirect(`/urls/${shortURL}`);
});
//makes random short URL when creating new link
// must put http:// when posting longURL

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});
//loads longURL for the shortURL

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect(`/urls`);
});
//deletes short URL using delete button  only if logged in user created the shortURL

app.post("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  }
  res.redirect(`/urls/${req.params.shortURL}`);
});
//saves shortURL link as new longURL in input only if logged in user created the shortURL

app.get("/register", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  res.render("registration", templateVars);
});
//loads register page

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Username and Password field both required.');
    return;
  }
  for (let user in users) {
    if (users[user].email === req.body.email) {
      res.status(400).send('This email has already been registered for an account.');
      return;
    }
  }
  const id = generateRandomString();
  users[id] = {};
  users[id].id = id;
  users[id].email = req.body.email;
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users[id].password = hashedPassword;
  console.log(users);
  req.session.user_id = id;
  res.redirect(`/urls`);
});
//when click register on /register page, makes random id, stores email, HASHED pw, id into users object, stores id in cookie

app.get("/login", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  res.render("login", templateVars);
});
//loads login page

app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Username and Password field both required.');
    return;
  }
  for (let user in users) {
    if (users[user].email === req.body.email) {
      if (bcrypt.compareSync(req.body.password, users[user].password)) {
        req.session.user_id = users[user].id;
        res.redirect(`/urls`);
      } else {
        res.status(403).send('The inputted password for this email is incorrect.');
        return;
      }
    }
  }
  res.status(403).send('The inputted password for this email is incorrect.');
});
//log in page post functionality

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});
//clears the cookie, logs out user

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));