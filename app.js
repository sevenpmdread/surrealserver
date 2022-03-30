require('dotenv').config();
require('express-async-errors');
const express = require('express');
var bodyParser = require('body-parser')

const app = express();

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const answerRouter = require('./routes/answers')
const metaRouter = require('./routes/Meta')
const connectDB = require('./db/connect')
var jsonParser = bodyParser.json()
const authmiddleware = require('./middleware/authentication')

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser())
// app.use("api/v1/questions/:id",function (req, res, next) {
//   console.log('Request Type:', req.method);
//   //next();
// })
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/questions',authmiddleware,jobsRouter)
app.use("/api/v1/answers",authmiddleware,answerRouter)
app.use("/api/v1/meta",authmiddleware,metaRouter)

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages



// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
    console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
