// Server bootstrap file
import express from 'express';

const app = express();

// TODO: Add middleware configuration here
app.use(express.json());

// TODO: Add routes here (routes should be defined in adapters/inbound/http)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server is running at http://localhost:${PORT}`);
});

