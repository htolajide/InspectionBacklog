import express from 'express';
import morgan from 'morgan';
import routes from './routes';
import cookieParser from 'cookie-parser';
import jsend from 'jsend';
import dotenv from 'dotenv';

// initialise express app
const app = express();

//user process enviroment variable
dotenv.config();

// to resolve cross origin resource shearing (CORS) error add folowing to te response header 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// wire up jsend
app.use(jsend.middleware);
//log request
app.use(morgan("dev"));
//user cookie parser
app.use(cookieParser())
//create usertable;
//wire up the routes to the app
app.use("/api/v1/", routes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to MyJob Backend Application" });
});
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});