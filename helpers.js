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

const getUserByEmail = function(email, database) {
  for (let userId in database) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
};
//gets user based on their email

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
//user database


module.exports = { generateRandomString, urlsForUser, getUserByEmail, urlDatabase, users };