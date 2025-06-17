import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs:
    (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10) || 15) *
    60 *
    1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10) || 100,
});
app.use(limiter);
app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

