import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import loginControllers from '../controllers/login';

interface Props {
  setUser: any,
  user: any
}
const Navbar: React.FC<Props> = ({ setUser, user }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const history = useHistory();

  const handleClickOutside = (event: any): void => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setToggleDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  const logout = (): void => {
    loginControllers.logOut().finally(() => {
      setUser(null);
      history.push('/');
    });
  };

  return (
    (
      wrapperRef && (
      <div className="bg-blue-900 bg px-3 py-5 flex justify-between items-center">
        <Link className="text-white" to="/">Etusivu</Link>
        <div ref={wrapperRef}>
          <button
            type="button"
            onClick={() => setToggleDropdown(!toggleDropdown)}
          >
            {user ? <span className="text-white pr-2 font-bold">{user.name}</span> : null}
            <FontAwesomeIcon
              icon="user-circle"
              color="white"
              size="lg"
            />
          </button>
          <div className={`flex-col dropdown absolute shadow-md bg-white px-2 py-1 rounded-md ${toggleDropdown ? 'show' : 'hide'}`}>
            {user ? (
              <>
                <Link to="/profile" className="dropdown__item text-right">Omat tiedot</Link>
                <button type="button" onClick={() => logout()} className="dropdown__item text-right">Kirjaudu ulos</button>
              </>
            ) : (<Link to="/login" className="dropdown__item text-right">Kirjaudu sisään</Link>)}

          </div>
        </div>
      </div>
      )
    )
  );
};

export default Navbar;
