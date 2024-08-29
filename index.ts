import express from 'express';
import bodyParser from 'body-parser';
import userAPI from './api/user';
import cors from 'cors'
const app = express();
const port = process.env.PORT || 8888;
const urlencodedParser = bodyParser.urlencoded({extended:false})
app.use(bodyParser.json(), urlencodedParser);
const corsOptions = {
    origin: process.env.FRONT_URI 
}
app.use(cors(corsOptions));

app.use(userAPI)
app.listen(port, () => {
    console.log(`> Ready on http://localhost:3000`);
});