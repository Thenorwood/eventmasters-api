import express from 'express';
import cors from 'cors';
import router from '/routes.js';

const port = process.env.PORT || 3000;
const app = express();


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});