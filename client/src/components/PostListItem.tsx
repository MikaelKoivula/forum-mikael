import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { ModalProps } from '../pages/Posts';

interface Props {
  parentId: string,
  id: number,
  index: number,
  setModal: React.Dispatch<React.SetStateAction<ModalProps>>,
  text: string,
  time: Date,
  title: string,
  userId: string,
  name: string
}

const PostListItem: React.FC<Props> = ({
  parentId, id, index, setModal, text, time, title, name, userId,
}) => {
  const userContext = useContext(UserContext);
  const date = new Date(time);
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

  // Year Month Day
  const YMD = `${date.toLocaleString('de-DE', {
    year: 'numeric', timeZone,
  })}-${date.toLocaleString('de-DE', {
    month: '2-digit', timeZone,
  })}-${date.toLocaleString('de-DE', {
    day: '2-digit', timeZone,
  })}`;

  // Hour Minutes Seconds
  const HMS = `${date.toLocaleTimeString('de-DE', {
    timeZone,
  })}`;

  return (
    <div>
      <div className="width-full px-3 py-1 text-xs flex justify-between bg-blue-600 font-bold text-white">
        {`${YMD} | ${HMS}`}
        <span>
          #
          {index + 1}
        </span>
      </div>
      <div className="bg-white p-3 mb-3 shadow-md">
        <h2 className="border-b border-gray-400 border-solid text-base font-black">{title}</h2>
        <p className="text-xs py-3">{text}</p>
        <div className="border-t border-gray-400 text-xs">
          <div className="flex justify-between pt-2">
            <div>{name}</div>
            {userContext.user && (userContext.user.id === userId.toString()) && (
            <div>
              <button
                type="button"
                className="uppercase font-bold"
                style={{ fontSize: '9px' }}
                onClick={() => setModal({
                  text, title, id, open: true,
                })}
              >
                poista
              </button>
              <Link
                type="button"
                className="uppercase font-bold pl-1"
                style={{ fontSize: '9px' }}
                to={`/posts/${parentId}/edit/${id}`}
              >
                muokkaa
              </Link>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
