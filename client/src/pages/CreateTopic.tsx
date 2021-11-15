import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import topicControllers from '../controllers/topic';

const CreateTopic: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const history = useHistory();

  const redirect = (url: string): void => {
    history.push(url);
  };

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const topic = { title };
    topicControllers.createTopic(topic).then(() => {
      redirect('/');
    });
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => setTitle(e.target.value);

  return (
    <div className="shadow-lg">
      <div className="bg-blue-900 p-3 flex justify-between items-center">
        <p className="text-white text-base">Lisää aihe</p>
        <Link className="text-white text-sm" to="/"><FontAwesomeIcon icon="arrow-left" color="white" size="lg" /></Link>
      </div>
      <div className="bg-white p-3">
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="title">
              <p className="text-xs">Otsikko:</p>
              <input id="title" className="border-solid border border-black rounded" type="text" onChange={handleTitleChange} />
            </label>
          </div>
          <div className="pt-5">
            <button disabled={title.length < 1} className="bg-blue-900 p-1 px-2 rounded text-white text-xs" type="submit">Tallenna</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopic;
