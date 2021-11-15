import React from 'react';
import TopicListItem from './TopicListItem';

interface ItemType {
  id: number,
  length: any,
  title: string;
}

interface Props {
  data: ItemType[],
  setModal: any,
}

const TopicList: React.FC<Props> = ({
  data, setModal,
}) => (
  <div className="bg-white flex flex-col">
    {data.map((item: ItemType, i) => (
      <TopicListItem key={item.id} id={item.id} topic={item.title} border={item.length === i + 1} setModal={setModal} />
    ))}
  </div>
);

export default TopicList;
