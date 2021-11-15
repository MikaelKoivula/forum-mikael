import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosResponse } from 'axios';
import React, {
  ChangeEvent, FormEvent, useContext, useEffect, useState,
} from 'react';
import { Link, Redirect } from 'react-router-dom';
import UserContext from '../context/UserContext';
import userControllers from '../controllers/user';

interface ItemType {
  message: string;
}
const Profile: React.FC = () => {
  const userContext = useContext(UserContext);
  const [errors, setErrors] = useState('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    userControllers.editUser({ username, password, email }).then((res: AxiosResponse) => {
      if (res.data.error_message) {
        setErrors(res.data.error_message);
      } else {
        if (userContext.setUser) userContext.setUser(res.data);
        setEmail(res.data.email);
        setUsername(res.data.name);
        setErrors('');
      }
    });
  };

  useEffect(() => {
    if (userContext.user) {
      setEmail(userContext.user.email);
      setUsername(userContext.user.name);
    }
  }, [userContext]);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value);
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => setUsername(e.target.value);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value);

  if (!userContext.user) return <Redirect to="/login" />;

  return (
    <div className="shadow-lg">
      <div className="bg-blue-900 p-3 flex justify-between items-center">
        <p className="text-white text-base">Lisää viesti</p>
        <Link className="text-white text-sm" to="/"><FontAwesomeIcon icon="arrow-left" color="white" size="lg" /></Link>
      </div>
      <div className="bg-white p-3">
        <div className={errors ? 'mb-2' : ''}>
          {errors
            ? (
              <p key={Math.random()} className="text-pink-600">
                *
                {' '}
                {errors}
              </p>
            )
            : null}
        </div>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="title">
              <p className="text-xs">Nimi:</p>
              <input id="title" onChange={handleUsernameChange} className="border-solid border border-black rounded" type="text" value={username} />
            </label>
          </div>
          <div className="pt-2">
            <label htmlFor="email">
              <p className="text-xs">Email:</p>
              <input id="email" onChange={handleEmailChange} className="border-solid border border-black rounded" type="email" value={email} />
            </label>
          </div>
          <div className="pt-4">
            <label htmlFor="password">
              <p className="text-xs">Vaihda salasana:</p>
              <input id="password" onChange={handlePasswordChange} className="border-solid border border-black rounded" type="password" value={password} />
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

export default Profile;
