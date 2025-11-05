import express from 'express';

const router = express.Router();

//Get
//Get: concerts
router.get('/', (req, res) => {

    // create an array 
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