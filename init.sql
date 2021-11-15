CREATE TABLE topic (title TEXT, id SERIAL PRIMARY KEY);
CREATE TABLE post (id SERIAL PRIMARY KEY, title TEXT, content TEXT, posted TIMESTAMPTZ, topic_id integer, CONSTRAINT post_topic_fkey FOREIGN KEY(topic_id) REFERENCES topic(id) ON DELETE CASCADE);
INSERT INTO topic (title) VALUES ('Testi topic');
INSERT INTO post (title, content, posted, topic_id) VALUES ('Testititle', 'Lorem ipsum', '2020-01-01', (SELECT id FROM topic WHERE title = 'Testi topic'));
CREATE TABLE testusers (id BIGSERIAL PRIMARY KEY NOT NULL, name VARCHAR(200) NOT NULL, email VARCHAR(200) NOT NULL, password VARCHAR(200) NOT NULL, UNIQUE (email));
ALTER TABLE post ADD COLUMN user_id INTEGER, ADD CONSTRAINT post_user_fkey FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE;
