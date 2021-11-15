import { createContext } from 'react';

type UserType = {
    name: string;
    id: string;
    email: string;
  };

type UserContextType = {
    user: UserType | null;
    setUser: React.Dispatch<null> | null;
    setUserDetails: React.Dispatch<string> | null;
    userDetails: string;
  };

const UserContext = createContext<UserContextType>({
  user: null, setUser: null, setUserDetails: null, userDetails: '',
});

export default UserContext;
