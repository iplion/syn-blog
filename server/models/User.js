const db = require('../db');

class User {
  static create(user) {
    try {
      return new Promise((resolve, reject) => {
        db.insert(user, (err, insertedUser) => {
          if (err) {
            reject(err);
          } else {
            resolve(insertedUser);
          }
        });
      });
    } catch (err) {
      throw new Error(`Creating user error: ${err.message}`);
    }
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.findOne({email: email}, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.findOne({_id: id}, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  static update(id, updatedUser) {
    return new Promise((resolve, reject) => {
      db.update({_id: id}, {$set: updatedUser}, {}, (err, numReplaced) => {
        if (err) {
          reject(err);
        } else {
          resolve(numReplaced);
        }
      });
    });
  }

  static remove(id) {
    return new Promise((resolve, reject) => {
      db.remove({_id: id}, {}, (err, numRemoved) => {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    });
  }
}

module.exports = User;