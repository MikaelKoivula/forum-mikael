const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Production settings

const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';

const pool = process.env.NODE_ENV === 'development' ? new Pool({
  user: 'user',
  host: 'localhost',
  database: 'db',
  password: 'password',
  port: 3002,
}) : new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
});

const getTopics = (request, response) => {
  pool.query('SELECT * FROM topic', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send({ results: results.rows, cookies: request.cookies });
  });
};

const logOut = async (request, response) => {
  await response.clearCookie('forum');
  await response.status(200).json({ message: 'User logged out' });
};

const login = (request, response) => {
  const { username, password } = request.body;
  pool.query('SELECT * FROM users WHERE email = $1', [username], async (error, results) => {
    // Email not found
    if (results.rows.length === 0) {
      return response.json({ error_message: 'Email not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, results.rows[0].password);

    // If passwords match, create jwt token and response with correct user details
    if (isMatch) {
      const token = jwt.sign({ id: results.rows[0].id, name: results.rows[0].name, email: results.rows[0].email }, 'forum-private-key');
      await response.cookie('forum', token, {
        maxAge: 900000,
      });

      await response.send({
        user: { id: results.rows[0].id, name: results.rows[0].name, email: results.rows[0].email },
        token,
      });
    } else {
      return response.json({
        error_message: 'Password is wrong',
      });
    }
  });
};
const editUser = async (request, response) => {
  const { username, email, password } = request.body;
  if (!username) {
    return response.json({ error_message: 'Nimi on tyhjä' });
  }

  if (!email) {
    return response.json({ error_message: 'Email on tyhjä' });
  }

  if (password && password.length < 6) {
    return response.json({ error_message: 'Password should be at least 6 characters!' });
  }

  if (!password) {
    pool.query('UPDATE users SET name = $1, email = $2 WHERE email = $2', [username, email], (error) => {
      if (error) {
        throw error;
      }
      pool.query('SELECT * FROM users WHERE email = $1', [email], (err, res) => {
        if (err) {
          throw err;
        }
        const token = jwt.sign({ id: res.rows[0].id, name: res.rows[0].name, email: res.rows[0].email }, 'forum-private-key');
        response.cookie('forum', token, {
          maxAge: 900000,
        });

        response.status(200).send(
          { email: res.rows[0].email, name: res.rows[0].name, id: res.rows[0].id },
        );
      });
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query('UPDATE users SET name = $1, email = $2, password = $3 WHERE email = $2', [username, email, hashedPassword], (error) => {
      if (error) {
        throw error;
      }
      pool.query('SELECT * FROM users WHERE email = $1', [email], (err, res) => {
        if (err) {
          throw err;
        }
        const token = jwt.sign({ id: res.rows[0].id, name: res.rows[0].name, email: res.rows[0].email }, 'forum-private-key');
        response.cookie('forum', token, {
          maxAge: 900000,
        });

        response.status(200).send({ email: res.rows[0].email, name: res.rows[0].name });
      });
    });
  }
};
const register = async (request, response) => {
  const { username, email, password } = request.body;
  const errors = [];

  if (!username || !email || !password) {
    errors.push('Please enter all fields');
  }

  if (password.length < 6) {
    errors.push('Password should be at least 6 characters!');
  }
  // if (password !== password2) {
  //   errors.push({ message: 'Passwords do not match' });
  // }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (errors.length) {
    return response.json(errors);
  }

  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
      throw error;
    }
    if (results.rows.length > 0) {
      errors.push('Email already registered');
      return response.json(errors);
    }
    pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password', [username, email, hashedPassword], (err) => {
      if (err) {
        throw err;
      }
      response.status(200).json({ message: 'You are now registered! Please log in.' });
    });
  });
};

const getPosts = (request, response) => {
  const { id } = request.params;
  pool.query(`SELECT post.id, title, content, posted, name, user_id FROM post, users WHERE post.user_id = users.id AND topic_id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

const getPost = (request, response) => {
  const { parentId, id } = request.query;
  pool.query(`SELECT * FROM post WHERE topic_id = ${parentId} AND id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const editPost = (request, response) => {
  const {
    title, content, id, parentId,
  } = request.body;
  const values = [`${title}`, `${content}`, `${id}`, `${parentId}`];
  pool.query('UPDATE post SET title = $1, content = $2 WHERE id = $3 AND topic_id = $4', values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const deletePost = (request, response) => {
  const { id } = request.body;
  pool.query(`DELETE FROM post WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const deleteTopic = (request, response) => {
  const { id } = request.body;
  pool.query(`DELETE FROM topic WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const addTopic = (request, response) => {
  const { title } = request.body;
  const values = [`${title}`];
  pool.query('INSERT INTO topic (title) VALUES ($1)', values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const addPost = (request, response) => {
  const {
    title, content, parentId, user: userID,
  } = request.body;

  const values = [`${title}`, `${content}`, `${parentId}`, `${userID}`];
  pool.query('INSERT INTO post (title, content, topic_id, user_id) VALUES ($1, $2, $3, $4)', values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  addTopic,
  editPost,
  deleteTopic,
  getTopics,
  getPost,
  addPost,
  editUser,
  getPosts,
  deletePost,
  register,
  login,
  logOut,
  pool,
};
