import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import { CookiesProvider, useCookies } from 'react-cookie';
// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft, faPlusCircle, faUserCircle, faTimes, faSpinner,
} from '@fortawesome/free-solid-svg-icons';

// Components
import axios from 'axios';
import Navbar from './components/Navbar';

// Pages
import Profile from './pages/Profile';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTopic from './pages/CreateTopic';
import CreatePost from './pages/CreatePost';
import Posts from './pages/Posts';

// Context
import UserContext from './context/UserContext';

library.add(faPlusCircle, faUserCircle, faArrowLeft, faTimes, faSpinner);

interface Token {
  id: string,
  name: string,
  email: string,
}

const App: React.FC = () => {
  const [userDetails, setUserDetails] = useState('');
  const [user, setUser] = useState<Token | null>(null);
  const [cookies] = useCookies(['forum']);

  useEffect(() => {
    // Check if cookie exists
    if (cookies.forum) {
      const token = cookies.forum;
      const decodedToken: Token = jwt_decode(token);
      const { id, name, email } = decodedToken;
      setUser({ id, name, email });
    }
  }, []);

  // Set withCredentials true for every axios request
  axios.defaults.withCredentials = true;

  return (
    <div className="App bg-gray-200" style={{ minHeight: '100vh' }}>
      <CookiesProvider>
        <UserContext.Provider value={{
          userDetails, setUserDetails, user, setUser,
        }}
        >

          <Router>
            <Navbar user={user} setUser={setUser} />
            <div className="container mx-auto  py-7 px-3">
              <Switch>
                <Route component={Login} path="/login" />
                <Route component={Register} path="/register" />
                <Route component={Profile} path="/profile" />
                <Route component={CreateTopic} path="/create-topic" />
                <Route component={CreatePost} path="/posts/:id/create" />
                <Route component={CreatePost} path="/posts/:id/edit/:postId" />
                <Route component={Posts} path="/posts/:id" />
                <Route exact component={Homepage} path="/" />
              </Switch>
            </div>
          </Router>

        </UserContext.Provider>
      </CookiesProvider>
    </div>
  );
};

export default App;
