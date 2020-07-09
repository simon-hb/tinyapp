const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
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
    const user = getUserByEmail("user@example.com", users)
    const expectedOutput = "userRandomID";
    assert.deepEqual(user, users[expectedOutput]);
  });

  it('should return undefined for invalid email', function() {
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
    const user = getUserByEmail("haha@example.com", users)
    const expectedOutput = undefined;
    assert.strictEqual(user, undefined);
  });
});