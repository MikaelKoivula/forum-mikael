const express = require('express');
const cors = require('cors');

const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./queries');
const auth = require('./auth');

app.use(cookieParser());

const router = new express.Router();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsConfig = {
  credentials: true,
  origin: true,
};

app.use(cors(corsConfig));

app.use(
  router.post('/api/logout', auth, (req, res) => db.logOut(req, res)),
  router.post('/api/login', (req, res) => db.login(req, res)),
  router.get('/api/topics', (req, res) => db.getTopics(req, res)),
  router.post('/api/user/edit', (req, res) => db.editUser(req, res)),
  router.get('/api/posts/:id', (req, res) => db.getPosts(req, res)),
  router.get('/api/post/:id', auth, (req, res) => db.getPost(req, res)),
  router.post('/api/posts/create', auth, (req, res) => db.addPost(req, res)),
  router.post('/api/register', (req, res) => db.register(req, res)),
  router.post('/api/topics/create', (req, res) => db.addTopic(req, res)),
  router.delete('/api/topics/delete', auth, (req, res) => db.deleteTopic(req, res)),
  router.delete('/api/posts/:id/delete', auth, (req, res) => db.deletePost(req, res)),
  router.post('/api/posts/:parent/edit/:id', auth, (req, res) => db.editPost(req, res)),
);

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = app;
