import express from 'express';
import bodyParser from 'body-parser';
import userAPI from './api/user';
import cors from 'cors'
import mongoose from 'mongoose';
import companyAPI from './api/company';
import attachmentAPI from './api/attachment';
const app = express();
const port = process.env.PORT || 8888;

const urlencodedParser = bodyParser.urlencoded({extended:false})
app.use(bodyParser.json(), urlencodedParser);
const corsOptions = {
    origin: process.env.FRONT_URI 
}
app.use(cors(corsOptions));
app.use(userAPI)
app.use(companyAPI)
app.use(attachmentAPI)
//Database
try {
    mongoose.set("strictQuery", false);
    mongoose.connect(`${process.env.ATLAS_URI}`);
    console.log(`Connected to Database.`)
  } catch (error) {
    console.log(error)
  }

app.listen(port, () => {
    console.log(`> Ready on http://localhost:`+port);
});