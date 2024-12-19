# Kiruna-eXplorer
Kiruna eXplorer

---
# Docker Deployment
### Docker Hub
- [https://hub.docker.com/r/mirhajian/kiruna-explorer](https://hub.docker.com/r/mirhajian/kiruna-explorer)
### Prerequisites
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
### Installation
1. Clone the repository
```sh
git clone https://github.com/mohammadrezza/Kiruna-eXplorer.git
```
2. Run docker-compose
```sh
cd Kiruna-eXplorer
docker-compose up --build
```
or alternatively build and run client and server images separately
```sh
cd Kiruna-eXplorer/client
docker build -t kiruna-explorer-client .
docker run -p 3000:80 kiruna-explorer-client
cd Kiruna-eXplorer/server
docker build -t kiruna-explorer-server .
docker run  --rm -v ./kiruna-database:/app/src/database kiruna-explorer-server npm run init-db
docker run -p 3001:3001 -v ./kiruna-uploads:/app/uploads -v ./kiruna-database:/app/src/database kiruna-explorer-server 
```

---
# Manual Deployment
### Prerequisites
- [Node.js](https://nodejs.org/en/)
### Installation
1. Clone the repository
```sh
git clone https://github.com/mohammadrezza/Kiruna-eXplorer.git
```
2. Install NPM packages
```sh
cd Kiruna-eXplorer/client
npm install
cd Kiruna-eXplorer/server
npm install
```
3. Run the server
```sh
cd Kiruna-eXplorer/server
npm start
```
4. Run the client
```sh
cd Kiruna-eXplorer/client
npm start
```
---
Test credentials:
- Urban Planner:
  - username: `MarioRossi`
  - password: `708090`
