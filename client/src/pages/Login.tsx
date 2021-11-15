import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  FormEvent, useState, ChangeEvent, useContext, useEffect,
} from 'react';
import { Link, Redirect } from 'react-router-dom';
import UserContext from '../context/UserContext';
import loginControllers from '../controllers/login';

const Profile: React.FC = () => {
  const userContext = useContext<any>(UserContext);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<string>('');
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => setUsername(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value);

  const handleFormSubmit = (e: FormEvent): void => {
    e.preventDefault();
    setErrors('');
    userContext.setUserDetails('');
    loginControllers.login({
      username,
      password,
    }).then((res): void => {
      if (res.data.user) {
        userContext.setUser(res.data.user);
      } else if (res.data.error_message) {
        setErrors(res.data.error_message);
      }
    });
  };

  useEffect(() => () => {
    userContext.setUserDetails('');
  }, []);

  if (userContext.user) return <Redirect to="/" />;

  return (
    <div className="shadow-lg">
      <div className="bg-blue-900 p-3 flex justify-between items-center">
        <p className="text-white text-base">Lisää aihe</p>
        <Link className="text-white text-sm" to="/"><FontAwesomeIcon icon="arrow-left" color="white" size="lg" /></Link>
      </div>
      <div className="bg-white p-3">
        {errors ? (
          <p className="text-pink-600 mb-2">
            *
            {' '}
            {errors}
          </p>
        ) : null}
        <form onSubmit={handleFormSubmit}>
          {userContext.userDetails.length > 0 ? (<p className="text-xs mb-3.5 text-pink-600">{userContext.userDetails}</p>) : null}
          <p className="text-black text-sm mb-2">Kirjaudu sisään</p>
          <div>
            <input id="email" className="border-solid border border-black rounded mb-1 p-1" onChange={handleUsernameChange} value={username} type="text" name="email" placeholder="Username" />
          </div>
          <div>
            <input id="password" className="border-solid border border-black rounded p-1" onChange={handlePasswordChange} value={password} type="password" name="password" placeholder="Password" />
          </div>
          <button className="bg-blue-900 text-white p-1 text-xs mt-3" type="submit" value="submit">Kirjaudu</button>
        </form>
        <p className="mt-3">
          Etkö ole rekisteröitynyt? Rekisteröidy tästä:
          {' '}
          <Link className="text-blue-900" to="/register">rekisteröidy</Link>
        </p>
      </div>
    </div>
  );
};

export default Profile;
