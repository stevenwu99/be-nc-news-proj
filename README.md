# Northcoders News API

1. A link to the hosted version.

https://nc-news-waad.onrender.com

2. A summary of what the project is.

The user can use this system to query the articles, their comments, topics and users.
The system mainly provided a topic and a relative ID (for example, article id and comment id ) for filtering and also provided different sorts and orders to match different request. 

3. How to clone, install dependencies

(1) Clone the repo
    -- Make a directory or cd to an existing folder where you want to install this project and the run 
       the following command to clone the repo (assume your computer there is permission to connect to GitHub)
    -- git clone https://github.com/stevenwu99/be-nc-news-proj.git

(2) nmp install 

  Locate to the folder where you clone the repo and then run the following command

--Install express

npm install express

--Install node-postgres

npm install pg

--Install pg-format 

npm install pg-format

--Install dotenv

npm install dotenv

--Install jest and supertest

npm install -D jest 

npm install -D jest-sorted

npm install -D supertest

4. Create the two .env files.
   At the top level of the folder, create following two .env file
   --.env.development
       add this command to the file : PGDATABASE=nc_news
   --.env.test 
       add this command to the file : PGDATABASE=nc_news_test

5. Seed local database, and run tests

(1)Seed local database
  -- Go to package.json file ,add the following commands to tht scripts (if they do not exist):
     "setup-dbs": "psql -f ./db/setup.sql"
     "seed": "node ./db/seeds/run-seed.js"
  -- Locate to the folder and then "run npm seed"  
(2) run test
  -- Go to package.json file, change value of property "test" to "jest"
  -- Locate to the folder and then "npm test 

6. The minimum versions of Node.js, and Postgres needed to run the project.

   --Minimum versions of Node.js : v20.0.0
   --Minimum versions of postgres: v14.8















1. Crate a file .env.development for accessing dev data (dev database)and put the following at this file:
PGDATABASE=nc_news

2. Crate a file .env.test for accessing test data (test database) and put the following at this file:
PGDATABASE=nc_news_test
