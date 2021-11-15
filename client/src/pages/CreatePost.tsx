import React, {
  useContext, ChangeEvent, useEffect, useState,
} from 'react';
import {
  Link, useParams, useHistory, Redirect,
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import postControllers from '../controllers/post';
import UserContext from '../context/UserContext';

const CreatePost: React.FC = () => {
  const { id, postId } = useParams<{ id: string, postId: string }>();
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const userContext = useContext(UserContext);

  const history = useHistory();

  useEffect(() => {
    if (postId && id) {
      postControllers.getPost({
        params: {
          parentId: id,
          id: postId,
        },
      }).then((res) => {
        const { data } = res;
        setTitle(data[0].title);
        setText(data[0].content);
      }).catch((err) => {
        if (err.request.status === 401) {
          history.push('/login');
        }
      });
    }
  }, []);

  const redirect = (): void => {
    history.push(`/posts/${id}`);
  };

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const post = {
      title,
      content: text,
      parentId: id,
      id: postId,
      user: userContext.user ? userContext.user.id : null,
    };
    if (postId) {
      postControllers.editPost(post).then(() => {
        redirect();
      });
    } else {
      postControllers.addPost(post).then(() => {
        redirect();
      });
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => setTitle(e.target.value);

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => setText(e.target.value);

  if (!userContext.user) return <Redirect to="/login" />;

  return (
    <div className="shadow-lg">
      <div className="bg-blue-900 p-3 flex justify-between items-center">
        <p className="text-white text-base">Lisää viesti</p>
        <Link className="text-white text-sm" to={`/posts/${id}`}><FontAwesomeIcon icon="arrow-left" color="white" size="lg" /></Link>
      </div>
      <div className="bg-white p-3">
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="title">
              <p className="text-xs">Otsikko:</p>
              <input id="title" onChange={handleTitleChange} className="border-solid border border-black rounded" type="text" value={title} />
            </label>
          </div>
          <div className="pt-3">
            <label htmlFor="textarea">
              <p className="text-xs">Viesti:</p>
              <textarea id="textarea" className="border-solid border border-black rounded" onChange={handleTextareaChange} value={text} />
            </label>
          </div>
          <div className="pt-5">
            <button className="bg-blue-900 p-1 px-2 rounded text-white text-xs" type="submit">Tallenna</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
