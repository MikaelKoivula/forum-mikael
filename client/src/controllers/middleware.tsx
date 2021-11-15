const axiosMiddleware = (cookies:any, setCookies: any, userContext: any): any => {
  if (!cookies.forum && userContext.user !== null) {
    if (typeof userContext.setUser === 'function') { userContext.setUser(null); }
  }
  return Promise.resolve(true);
};

export default axiosMiddleware;
