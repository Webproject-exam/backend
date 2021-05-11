require('dotenv').config();
require('./auth/user.auth');

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

// Route handlers
const manageRoute = require('./routes/manage.routes');
const profileRoute = require('./routes/profile.routes');
const resetRoute = require('./routes/email.routes');
const authRoute = require('./routes/auth.routes');
const plantRoute = require('./routes/plant.routes');
const formData = require('express-form-data');

// Middlewares
// parse request of content-type - application/json
app.use(express.json({ limit: '50mb' }));
// parse request of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
// read cookie information
app.use(cookieParser());
// Not whitelisted atm, this is for development purposes
if (process.env && process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  app.use(cors({ credentials: true, origin: process.env.FRONTENDHOST }));
} else {
  app.use(cors());
}
app.use(formData.parse());
// Easier to see what requests are sent via postman
app.use(morgan('dev'));
// Authenticate user
const authUser = passport.authenticate('jwt', { session: false });
const hasRole = require('./middleware/role.middleware');
// Add swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', authRoute);
app.use('/manage', authUser, hasRole.Manager, manageRoute);
app.use('/profile', authUser, hasRole.User, profileRoute);
app.use('/reset_password', resetRoute);
app.use('/plants', plantRoute);

// Connect to DB
mongoose
  .connect(process.env.DATABASE_CONNECT_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error));

// Start server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Handle errors.
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error });
});
