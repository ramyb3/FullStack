# My final fullstack project

You will be able to add/edit/delete movies and members depend on the user permission

### Steps to run the project

there are 3 repositories here: 2 for backend and 1 for frontend.

1. clone this project
2. create mongodb collection with the name subscriptionsDB and copy the url
3. create 2 .env files (in '/Data' & in '/WebServices') with WEB_SERVICE_MONGO_URL = `<'YOUR_URL'>`
4. write in .env file that in '/Data' SUBSCRIPTION_API_URL = http://localhost:8000/subscriptions
5. create .env file in '/Client' with REACT_APP_API_SERVER = http://localhost:7000/data
6. open 3 terminals (one for each repo) and run `npm i`
7. go to '/WebServices' terminal and run `npm start`
8. go to '/Data' terminal and run `npm start`
9. go to '/Client' terminal and run `npm start`
