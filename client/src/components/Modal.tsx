import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './modal.css';

interface Props {
    closeModal: any,
    onSubmit: any,
    visible: boolean,
    title: string,
    text: string
}

const Modal: React.FC<Props> = ({
  visible, closeModal, title, onSubmit, text,
}) => (
  <div
    className={`modal ${visible ? 'show' : 'hide'}`}
    onClick={() => {
      // close modal when outside of modal is clicked
      closeModal({});
    }}
    aria-hidden="true"
  >
    <div className="flex justify-center items-center h-full">
      <div
        className="bg-white w-full"
        style={{ maxWidth: '300px' }}
        onClick={(e) => {
          // do not close modal if anything inside modal content is clicked
          e.stopPropagation();
        }}
        aria-hidden="true"
      >
        <div className="border-b border flex justify-between items-center p-2">
          <div>{title}</div>
          <FontAwesomeIcon role="button" onClick={() => closeModal({})} icon="times" color="black" size="lg" />
        </div>
        <div className="px-3 py-5">
          <p>{text}</p>
        </div>
        <div className="border-t border p-2">
          <button className="rounded p-1 bg-blue-900 text-white text-xs mr-1" onClick={() => closeModal({})} type="button">Peruuta</button>
          <button className="rounded p-1 bg-blue-900 text-white text-xs" onClick={() => onSubmit()} type="button">Kyllä</button>
        </div>
      </div>
    </div>
  </div>
);

export default Modal;
