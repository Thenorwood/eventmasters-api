import express from 'express';
import sql from 'mssql';
import 'dotenv/config'

const router = express.Router();

const db_connection_string =  process.env.DB_CONNECTION_STRING;

//Get
//Get: concerts
router.get('/', async (req, res) => {

    // get collection of objects from the database
    await sql.connect(db_connection_string);

    const result = await sql.query`SELECT * FROM concerts`;
    //add table here

    res.json(result.recordset);

    const photos = [
        {
            id: '1',
            title: 'NIN',
            description: 'NIN canadian tour',
            url: 'https://example.com/nin.jpg'
        },
        {
            id: '1',
            title: 'Metallica' ,
            description: 'Metallica halifax concert',
            url: 'https://example.com/metallica.jpg'
        }
    ]
    
    // send the array as JSON
    res.json(concerts);
});

//get /api/:id
router.get('concerts/:id', (req, res) => {
     const id = req.params.id; 

      const photo = {
        id: id,
        title: 'NIN',
        description: 'NIN canadian tour',
        url:  'https://example.com/nin.jpg'
    }

    //send object as json
    res.json(concert);

});

export default router;