import mysql from 'mysql';
import config from '../config/db_config';

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const remote_url = process.env.DB_URL ? process.env.DB_URL : configuration.production.url;

console.log('This is the environment: ', env );
try {
  let databaseCon = mysql.createPool(config.development);
  if (env === 'production') {
    // console.log('Remote URL is: ',remote_url);
    databaseCon = mysql.createPool(config.production);
  } 
  module.exports = databaseCon;
}catch(error){
  console.log(`Database not connected: ${error}`);
}
