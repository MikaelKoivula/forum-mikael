import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosResponse } from 'axios';
import React, {
  ChangeEvent, FormEvent, useContext, useState,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext';
import userControllers from '../controllers/user';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<any>();
  const userContext = useContext<any>(UserContext);
  const history = useHistory();

  interface ItemType {
    message: string;
  }

  const redirect = (url: string): void => {
    history.push(url);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => setUsername(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value);

  const handleFormSubmit = (e: FormEvent): void => {
    e.preventDefault();
    setErrors('');
    userControllers.register({ username, password, email }).then((res: AxiosResponse) => {
      if (res.status === 200 && res.data.message) {
        // User has registered
        redirect('/login');
        userContext.setUserDetails(res.data.message);
      } else {
        setErrors(res.data);
      }
    });
  };

  return (
    <div className="shadow-lg">
      <div className="bg-blue-900 p-3 flex justify-between items-center">
        <p className="text-white text-base">Rekisteröidy</p>
        <Link className="text-white text-sm" to="/"><FontAwesomeIcon icon="arrow-left" color="white" size="lg" /></Link>
      </div>
      <div className="bg-white p-3">
        <div className={errors ? 'mb-2' : ''}>
          {errors ? errors.map((msg: ItemType) => (
            <p key={Math.random()} className="text-pink-600">
              *
              {' '}
              {msg}
            </p>
          )) : null}
        </div>
        <form className="w-full" style={{ maxWidth: '200px' }} onSubmit={handleFormSubmit}>
          <p className="text-black text-sm mb-2">Rekisteröidy</p>
          <div className="flex flex-col">
            <input id="title" className="border-solid border border-black rounded mb-1 p-1" onChange={handleUsernameChange} value={username} type="text" placeholder="Username" />
            <input id="email" className="border-solid border border-black rounded mb-1 p-1" onChange={handleEmailChange} value={email} type="email" placeholder="Email" />
            <input id="password" className="border-solid border border-black rounded p-1" onChange={handlePasswordChange} value={password} type="password" placeholder="Password" />
          </div>
          <button className="bg-blue-900 text-white p-1 text-xs mt-3" type="submit">Rekisteröidy</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
