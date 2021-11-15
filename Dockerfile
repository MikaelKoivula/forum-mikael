FROM node:14
EXPOSE 3001
WORKDIR /usr/src/app
COPY client client
COPY server server
RUN cd client; npm install; 
RUN cd client; npm run build;
RUN cd server; npm install;
CMD cd server; npm run startProd;
