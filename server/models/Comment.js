const db = require('../db');
const User = require('./User');

class Comment {
  static create(comment) {
    comment.createdAt = new Date();
    comment.type = 'comment';

    return new Promise((resolve, reject) => {
      db.insert(comment, (err, newComment) => {
        if (err) {
          reject(err);
        } else {
          resolve(newComment);
        }
      });
    });
  }

  static findByPostId(postId) {
    return new Promise((resolve, reject) => {
      db.find({postId: postId, type: 'comment'}, async (err, results) => {
        if (err) {
          reject(err);

          return;
        }

        try {
          const comments = await Promise.all(results.map(async (c) => {
            const user = await User.findById(c.userId);

            return {
              _id: c._id,
              content: c.content,
              createdAt: c.createdAt,
              userEmail: user ? user.email : 'anonymous'
            };
          }));

          resolve(comments);
        } catch (error) {

          reject(error);
        }
      });
    });
  }
}


module.exports = Comment;