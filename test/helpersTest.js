const { assert } = require('chai');

const { getUserByEmail, generateRandomString, urlsForUser, urlDatabase } = require('../helpers.js');

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
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", users);
    const expectedOutput = "userRandomID";
    assert.deepEqual(user, users[expectedOutput]);
  });

  it('should return undefined for invalid email', function() {
    const user = getUserByEmail("haha@example.com", users);
    const expectedOutput = undefined;
    assert.strictEqual(user, expectedOutput);
  });
});

describe('generateRandomString', function() {
  it('should be 6 characters long', function() {
    const randomString = generateRandomString();
    const expectedOutput = 6;
    assert.strictEqual(randomString.length, expectedOutput);
  });

  it('should return a string value', function() {
    const randomString = generateRandomString();
    const expectedOutput = 'string';
    assert.strictEqual(typeof randomString, expectedOutput);
  });
});

describe('urlsForUser', function() {
  it('should return all the key-value pairs that belong to particular id from urlDatabase', function() {
    const urlForID = urlsForUser('a');
    const expectedOutput = urlDatabase;
    assert.deepEqual(urlForID, expectedOutput);
  });

  it('should return empty object if no shortURLS belong to the id', function() {
    const urlForID = urlsForUser('hello!');
    const expectedOutput = {};
    assert.deepEqual(urlForID, expectedOutput);
  });
});