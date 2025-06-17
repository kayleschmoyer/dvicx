import express from 'express';
import routes from './routes';

const app = express();
app.use(express.json());
app.use('/api', routes); // TODO: secure routes with authentication

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
