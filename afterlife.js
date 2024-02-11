require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connect');
const authenticateUser = require('./middlewares/authentication');

const cors = require('cors');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const expressRateLimit = require('express-rate-limit');


const app = express();

// routers
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');


// error handler
const notFoundMiddleware = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/errorHandler');

app.use(express.json());

// security packages
app.set('trust proxy', 1);

app.use(
    expressRateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    })
  );

app.use(cors());
app.use(helmet());
app.use(xssClean());

app.get('/' ,(req,res) =>
{
  res.send('JobsApi');
})

// routes
app.use('/users', authRoutes);
app.use('/jobs',authenticateUser, jobRoutes);

//error middlewares

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () =>
{
    try
    {
        await connectDB(process.env.mongoURI);
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    }
    catch (error)
    {
        console.log(error);
    }
};

start();
