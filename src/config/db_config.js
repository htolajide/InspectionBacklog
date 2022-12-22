
require('dotenv').config(); 

const config = {
  SECRET : 'password',
  // If using online database
  // development: {
  //   use_env_variable: 'DATABASE_URL'
  // },

  development: {
    host: 'localhost',
    user: 'root',
    password: 'olajide4me',
    database: 'myjob_db',
    port: 3306,
  },

  production: {
    host: 'eu-cdbr-west-02.cleardb.net',
    user: 'b18a122354350a',
    password: '32402bff',
    database: 'heroku_a2c99c895da3419',
  }
};

export default config;

//url: 'mysql://b18a122354350a:32402bff@eu-cdbr-west-02.cleardb.net/heroku_a2c99c895da3419?reconnect=true'