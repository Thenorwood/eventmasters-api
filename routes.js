import express from 'express';
import sql from 'mssql';
import 'dotenv/config'

const router = express.Router();

const db_connection_string =  process.env.DB_CONNECTION_STRING;

//Get
// GET: /api/concerts/
router.get('/', async (req, res) => {

    await sql.connect(db_connection_string);

    const result = await sql.query`
        SELECT a.[ConcertId], a.[Title], a.[Description], a.[FileName], a.[DateAdded], a.[EventDate], a.[Location], a.[Owner], b.[CategoryId], b.[Name], AS CategoryName, b.[Description] AS CategoryDescription
        FROM [dbo].[Concert] a
        INNER JOIN [dbo].[Category] b
        ON a.[CategoryId] = b.[CategoryId]
        ORDER BY a.[EventDate] DESC`;

    res.json(result.recordset);
});

// GET: /api/concerts/:id
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid concert ID. It must be a number.' });
    }

    // Get a single concert object from the database
    await sql.connect(db_connection_string);

    const result = await sql.query`
        SELECT a.[ConcertId], a.[Title], a.[Description], a.[FileName], a.[DateAdded], a.[EventDate], a.[Location], a.[Owner], b.[CategoryId], b.[Name], AS CategoryName, b.[Description] AS CategoryDescription
        FROM [dbo].[Concert] a
        INNER JOIN [dbo].[Category] b
        ON a.[CategoryId] = b.[CategoryId]
        WHERE a.[ConcertId] = ${id}`;

    if (result.recordset.length === 0) {
        return res.status(404).json({ error: 'Concert not found.' });
    }

    res.json(result.recordset);
});

export default router;