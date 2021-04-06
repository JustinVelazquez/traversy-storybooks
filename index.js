const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//Load config
dotenv.config({ path: './config/config.env' });

//passport config
require('./config/passport')(passport);

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Logging
process.env.NODE_ENV === 'development'
  ? app.use(morgan('dev'))
  : app.use(morgan('common'));

//Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon} = require('./routes/helpers/hbs')

//handlebars
app.engine('.hbs', exphbs({ helpers: {
  formatDate,
  stripTags,
  truncate,
  editIcon,
}, defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global Var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next();
})

//Routes
app.use('/', require('./routes/routes'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});
