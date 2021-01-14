const path = require('path') // node core module to deal with file paths
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv') // to use environment variables
const morgan = require('morgan') // to use morgan logger middleware
const exphbs = require('express-handlebars') // used as template engine
const methodOverride = require('method-override') // method override for PUT and DELETE
const passport = require('passport') // authentication middleware
const session = require('express-session') // to use sessions
const MongoStore = require('connect-mongo')(session) // to store session in DB

const connectDB = require('./config/db')

// Load config file
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

// Connect to DB
connectDB()

// Initialize the app
const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies,i.e, hidden input, and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

// setup morgan logger to view HTTP req and res in terminal
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars helpers
const { formatDate } = require('./helpers/hbs')

// Handlebars - template engine
app.engine(
    '.hbs',
    exphbs({
        helpers: { 
            formatDate
        },
        defaultLayout:'main',
        extname: '.hbs'
    })
) // setting extension to .hbs and defaultLayout to main.hbs
app.set('view engine','.hbs') // setting view engine as .hbs files

// Sessions
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname,'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/tasks', require('./routes/tasks'))

const PORT = process.env.PORT || 5000

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode connected to port ${PORT}`)
)