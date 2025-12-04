import express from 'express';
import sql from 'mssql';
import 'dotenv/config'

const router = express.Router();

const db_connection_string =  process.env.DB_CONNECTION_STRING;

// GET: /api/concerts
router.get('/', async (_req, res) => {
  await sql.connect(db_connection_string);
  const result = await sql.query`
    SELECT
      a.[ConcertId],
      a.[Title],
      a.[Description],
      a.[FileName],
      a.[DateAdded],
      a.[EventDate],
      a.[Location],
      a.[Owner],
      a.[Category]                         AS CategoryName,
      b.[CategoryId],
      b.[Description]                      AS CategoryDescription
    FROM [dbo].[Concert] a
    LEFT JOIN [dbo].[Category] b
      ON a.[Category] = b.[Name]
    ORDER BY a.[EventDate] DESC;
  `;

    res.json(result.recordset);
});

// GET: /api/concerts/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid concert ID' });

  await sql.connect(db_connection_string);
  const result = await sql.query`
    SELECT
      a.[ConcertId],
      a.[Title],
      a.[Description],
      a.[FileName],
      a.[DateAdded],
      a.[EventDate],
      a.[Location],
      a.[Owner],
      a.[Category]                         AS CategoryName,
      b.[CategoryId],
      b.[Description]                      AS CategoryDescription
    FROM [dbo].[Concert] a
    LEFT JOIN [dbo].[Category] b
      ON a.[Category] = b.[Name]
    WHERE a.[ConcertId] = ${id};
  `;
  if (result.recordset.length === 0) return res.status(404).json({ error: 'Concert not found' });
  res.json(result.recordset[0]);
});


// POST: /api/purchases
router.post('/purchases', async (req, res) => {
  try {
    const body = req.body;

    const concertId = Number(body.concertId);
    const quantity = Number(body.quantity);
    const totalAmount = Number(body.totalAmount);

    if (!concertId || isNaN(concertId)) {
        return res.status(400).json({ error: 'concertId is required' });
    }
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'quantity must be greater than zero' });
    }
    if (isNaN(totalAmount)) {
        return res.status(400).json({ error: 'totalAmount must be a number' });
    }

    const customerName = body.customerName || '';
    const email = body.email || '';
    const phone = body.phone || null;
    const cardType = body.cardType || null;

    if (!customerName || !email) {
        return res.status(400).json({ error: 'customerName and email are required' });
    }

    await sql.connect(db_connection_string);

    const result = await sql.query`
      INSERT INTO dbo.Purchase
      (ConcertId, Quantity, CustomerName, Email, Phone, CardType, TotalAmount, CreatedAt)
      VALUES
      (${concertId}, ${quantity}, ${customerName}, ${email}, ${phone}, ${cardType}, ${totalAmount}, GETDATE());
      
      SELECT SCOPE_IDENTITY() AS PurchaseId;
    `;

    const purchaseId = result.recordset[0].PurchaseId;

    res.status(201).json({
      purchaseId,
      concertId,
      quantity,
      totalAmount,
      customerName,
      email,
      cardType
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db_error' });
  }
});

export default router;