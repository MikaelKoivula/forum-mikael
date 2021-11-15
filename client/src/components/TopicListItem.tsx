import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserContext from '../context/UserContext';

interface Props {
  id: number,
  border: boolean,
  topic: string,
  setModal: any
}

const TopicListItem: React.FC<Props> = ({
  id, border, topic, setModal,
}) => {
  const userContext = useContext(UserContext);
  return (
    <div className={`bg-white p-3 flex justify-between items-center ${!border ? 'border-b' : ''}`}>
      <Link
        to={`/posts/${id}`}
        className="border-l-4 border-blue-600 pl-2 py-1 text-sm block w-full"
      >
        {topic}
      </Link>
      {userContext.user && (
      <div>
        <FontAwesomeIcon
          role="button"
          onClick={() => setModal({
            title: topic, id, open: true,
          })}
          icon="times"
          color="black"
          size="lg"
        />
      </div>
      )}
    </div>
  );
};

export default TopicListItem;
