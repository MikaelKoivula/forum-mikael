import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosResponse } from 'axios';
import { useCookies } from 'react-cookie';
import TopicList from '../components/TopicList';
import Modal from '../components/Modal';
import topicControllers from '../controllers/topic';
import UserContext from '../context/UserContext';
import axiosMiddleware from '../controllers/middleware';

const Homepage: React.FC = () => {
  const [cookies, setCookies] = useCookies(['forum']);
  const [data, setData] = useState();
  const [modal, setModal] = useState<Record<string, string>>({});
  const closeModal = (): void => setModal({});
  const userContext = useContext(UserContext);

  const getData = (): void => {
    axiosMiddleware(cookies, setCookies, userContext).then(() => {
      topicControllers.getAll().then((res: AxiosResponse) => {
        setData(res.data.results);
      });
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteTopic = (): void => {
    topicControllers.deleteTopic(modal.id).then(() => {
      closeModal();
      getData();
    });
  };

  return (
    <div className="shadow-lg">
      <div className="bg-blue-900 p-3 flex justify-between items-center">
        <p className="text-white text-base">Aiheet</p>
        {userContext.user && <Link className="text-white text-sm" to="/create-topic"><FontAwesomeIcon icon="plus-circle" color="white" size="lg" /></Link>}
      </div>
      {!data
        ? <div className="flex items-center justify-center py-3"><FontAwesomeIcon icon="spinner" color="black" size="lg" spin /></div>
        : <TopicList data={data} setModal={setModal} />}
      <Modal onSubmit={() => deleteTopic()} closeModal={closeModal} visible={!!modal.open} title="topic" text={`Oletko varma, että haluat poistaa topicin otsikolla "${modal.title}" ja myös sen sisällä olevat tekstit?`} />
    </div>
  );
};

export default Homepage;
