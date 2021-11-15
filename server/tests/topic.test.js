const { expect } = require('chai');
const request = require('supertest');
const db = require('../queries');

describe('Topic', () => {
  let app;

  before('Load app and make termporary table for topics', async () => {
    app = require('../index');
    await db.pool.query('CREATE TEMPORARY TABLE topic (LIKE topic INCLUDING ALL)');
  });

  describe('POST /api/topics', () => {
    it('Should add new topic', async () => {
      async function postTopic(req, status = 200) {
        const { body } = await request(app)
          .post('/api/topics/create')
          .send(req)
          .expect(status);
        return body;
      }

      await postTopic({ title: 'testataan123 title' });
    });

    it('Should get all topics and found 1', async () => {
      const { rows } = await db.pool.query('SELECT * FROM topic');
      expect(rows).lengthOf(1);
    });
  });

  after('Drop temporary tables', async () => {
    await db.pool.query('DROP TABLE IF EXISTS pg_temp.topic');
  });
});
