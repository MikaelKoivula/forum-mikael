import React from 'react';
import { Link } from 'react-router-dom';
import { ModalProps } from '../pages/Posts';
import PostListItem from './PostListItem';

interface PostType {
  // eslint-disable-next-line camelcase
  user_id: string;
  id: number,
  content: string,
  posted: Date,
  name: string,
  title: string,
}

interface Props {
  parentId: string,
    setModal: React.Dispatch<React.SetStateAction<ModalProps>>,
    data: PostType[]
}

const TopicList: React.FC<Props> = ({ parentId, setModal, data }) => (
  <div className="bg-white flex flex-col pt-6 pb-4 px-5">
    {data.length > 0 ? data.map((item, index) => (
      <PostListItem
        key={`${item.title}-${item.id}`}
        setModal={setModal}
        id={item.id}
        parentId={parentId}
        title={item.title}
        time={item.posted}
        index={index}
        userId={item.user_id}
        text={item.content}
        name={item.name}
      />
    )) : (
      <div>
        Ei viestejä. Lisää uusi viesti
        {' '}
        <Link className="underline text-blue-900" to={`/posts/${parentId}/create`}>tästä</Link>
        .
      </div>
    )}
  </div>
);

export default TopicList;
