if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const ExpressError = require('./utilities/ExpressError');
const userRoutes = require('./routes/users');
const spotgroundRoutes = require('./routes/spotgrounds');
const reviewRoutes = require('./routes/reviews');

const app = express();
const dbUrl = process.env.DB_URL;

// Connect to Mongoose
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB Connected");
});

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'https://exploretoronto.onrender.com'],
    credentials: true,
}));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.use(mongoSanitize());

// Helmet CSP configuration
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: ["'self'", "blob:", "data:", "https://res.cloudinary.com/djgibqxxv/", "https://images.unsplash.com/"],
        fontSrc: ["'self'", ...fontSrcUrls],
    },
}));

// Session configuration
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: { secret: 'thisshouldbeabettersecret!' },
});

store.on('error', function (error) {
    console.log('MongoStore Error:', error);
});

const sessionConfig = {
    store,
    name: 'Session',
    secret: 'thisisasecret',
    resave: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    saveUninitialized: true
};

app.use(session(sessionConfig));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for logging
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

// Middleware for flash messages
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', userRoutes);
app.use('/spotgrounds/', spotgroundRoutes);
app.use('/spotgrounds/:id/reviews', reviewRoutes);

// Authentication check route
app.get('/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// Home route
app.get('/', (req, res) => {
    res.render('home');
});

// Catch-all route for single-page app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Error handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found -- Invalid Route', 404));
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(status).render('error', { err });
});

// Start server
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
