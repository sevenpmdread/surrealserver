require('dotenv').config();
require('express-async-errors');
const express = require('express');
var bodyParser = require('body-parser')

const app = express();

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const answerRouter = require('./routes/answers')
const metaRouter = require('./routes/Meta')
const PinsRouter = require('./routes/pins')
const connectDB = require('./db/connect')
var jsonParser = bodyParser.json({ limit: "50mb" })

const authmiddleware = require('./middleware/authentication')

// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false })
//app.use(urlencodedParser)
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 }))
app.use(express.json());
// app.use("api/v1/questions/:id",function (req, res, next) {
//   console.log('Request Type:', req.method);
//   //next();
// })
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/questions',authmiddleware,jobsRouter)
app.use("/api/v1/answers",authmiddleware,answerRouter)
app.use("/api/v1/meta",authmiddleware,metaRouter)
app.use("/api/v1/pin",authmiddleware,PinsRouter)



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
