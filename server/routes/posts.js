const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const router = express.Router();
const authMiddleware = require('../middleware/jwtAuth');

router.post('/', authMiddleware, async (req, res) => {
  const post = {...req.body, userId: req.userId};
  try {
    const newPost = await Post.create(post);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({msg: 'Post creation error', err});
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findVisible();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({msg: 'Error receiving posts', err});
  }
});

router.get('/user', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.findByUser(req.userId);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({msg: 'Error receiving user posts', err});
  }
});

router.get('/:postId', async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({msg: 'Error receiving post', err});
  }
});

router.put('/:postId', authMiddleware, async (req, res) => {
  const postId = req.params.postId;
  const updatedPost = req.body;

  try {
    const numReplaced = await Post.update(postId, req.userId, updatedPost);
    res.status(200).json({msg: 'Post updated', numReplaced});
  } catch (err) {
    res.status(500).json({msg: 'Error updating messages', err});
  }
});

router.delete('/:postId', authMiddleware, async (req, res) => {
  const postId = req.params.postId;
  try {
    const numRemoved = await Post.remove(postId, req.userId);
    res.status(200).json({msg: 'Post deleted', numRemoved});
  } catch (err) {
    res.status(500).json({msg: 'Error deleting post', err});
  }
});

router.post('/:postId/comment', authMiddleware, async (req, res) => {
  const postId = req.params.postId;
  const comment = {...req.body, userId: req.userId, postId: postId};

  try {
    const newComment = await Comment.create(comment);
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({msg: 'Comment creation error', err});
  }
});

router.get('/:postId/comments', async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await Comment.findByPostId(postId);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({msg: 'Error receiving comments', err});
  }
});


module.exports = router;
