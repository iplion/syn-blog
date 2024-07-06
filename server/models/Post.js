const db = require('../db');
const User = require('./User');

class Post {
  static create(post) {
    post.createdAt = new Date();
    post.type = 'post';

    return new Promise((resolve, reject) => {
      db.insert(post, (err, newPost) => {
        if (err) {
          reject(err);
        } else {
          resolve(newPost);
        }
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.findOne({_id: id}, (err, post) => {
        if (err) {
          reject(err);
        } else {
          resolve(post);
        }
      });
    });
  }

  static findByUser(userId) {
    return new Promise((resolve, reject) => {
      db.find({userId: userId, type: 'post'}, (err, posts) => {
        if (err) {
          reject(err);
        } else {
          resolve(posts);
        }
      });
    });
  }

  static findVisible() {
    return new Promise((resolve, reject) => {
      db.find({ isHidden: false }, async (err, posts) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          const visiblePosts = await Promise.all(posts.map(async (post) => {
            const user = await User.findById(post.userId);
            return {
              _id: post._id,
              content: post.content,
              createdAt: post.createdAt,
              userEmail: user ? user.email : 'anonymous'
            };
          }));

          resolve(visiblePosts);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  static update(id, userId, updatedPost) {
    return new Promise((resolve, reject) => {
      db.update({_id: id, userId: userId}, {$set: updatedPost}, {}, (err, numReplaced) => {
        if (err) {
          reject(err);
        } else {
          resolve(numReplaced);
        }
      });
    });
  }

  static remove(id, userId) {
    return new Promise((resolve, reject) => {
      db.remove({_id: id, userId: userId}, {}, (err, numRemoved) => {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    });
  }
}

module.exports = Post;