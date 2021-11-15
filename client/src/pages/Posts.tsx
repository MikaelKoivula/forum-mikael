import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosResponse } from 'axios';
import { useCookies } from 'react-cookie';
import PostList from '../components/PostList';
import Modal from '../components/Modal';
import UserContext from '../context/UserContext';
import postControllers from '../controllers/post';
import axiosMiddleware from '../controllers/middleware';

export type ModalProps = {
    text: string,
    title: string,
    id: number,
    open: boolean
} | null;

const Posts: React.FC = () => {
  const [cookies, setCookies] = useCookies(['forum']);
  const [data, setData] = useState();
  const { id } = useParams<{ id: string }>();
  const [modal, setModal] = useState<ModalProps>(null);
  const closeModal = (): void => setModal(null);
  const userContext = useContext(UserContext);

  const getData = (): void => {
    axiosMiddleware(cookies, setCookies, userContext).then(() => {
      postControllers.getPosts(id).then((res: AxiosResponse) => {
        const { data: resData } = res;
        setData(resData);
      });
    });
  };

  useEffect(() => {
    if (!data) {
      getData();
    }
  }, []);

  const deletePost = (): void => {
    postControllers.deletePost({
      data: {
        id: modal?.id,
      },
    }).then(() => { closeModal(); getData(); });
  };

  return (
    <div className="shadow-lg">
      <div className="bg-blue-900 p-3 flex justify-between items-center">
        <p className="text-white text-base">Viestit</p>
        <div>
          <Link className="text-white text-sm pr-2" to="/"><FontAwesomeIcon icon="arrow-left" color="white" size="lg" /></Link>
          {userContext.user && <Link className="text-white text-sm" to={`/posts/${id}/create`}><FontAwesomeIcon icon="plus-circle" color="white" size="lg" /></Link>}
        </div>
      </div>
      {data && <PostList parentId={id} setModal={setModal} data={data} />}
      <Modal onSubmit={() => deletePost()} closeModal={closeModal} visible={!!modal} title="post" text={`Oletko varma, että haluat poistaa viestin otsikolla "${modal && modal.title}"?`} />
    </div>
  );
};

export default Posts;
