const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});