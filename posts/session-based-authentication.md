---
title: 'Session-Based Authentication with Passport'
date: '2021-07-06'
---

I wanted to learn more about backend authentication/authorization to be able to create a wider variety of web apps. I saw that passport is a popular package that handles authentication in Express, so I decided to build a project based around the passport-local strategy. The passport-local strategy uses session-based authentication. The strategy is commonly implemented with templating engines, but I decided to make it compatible with frontend frameworks (React).

## Sessions

I didn't know what sessions were before, so I had to read about them. Sessions are a way to store user-specific data on the server. The server sends a cookie to the client that stores the session id. On subsequent requests, the server uses the session id stored in the browser to get information stored in the session. The express-session package allows for easy setup in an Express app. By default, express-session stores sessions in memory, which is not scalable. Using the connect-mongo package, I can specify express-session to store data in a MongoDB database instead.

```js
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(
  session({
    secret: 'not a good secret',
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equal to 1 day
    },
  })
);
```

The express-session package automatically sets one of the user's cookie values to the session id on a request. On subsequent requests the express-session package checks for the session id stored in the specified cookie. If a session is found, it fetches the session from the store and assigns the data to `req.session`. Routes can then access the `req.session` field to modify session data mutably.

## Passport Configuration

I used the passport-local strategy, which authenticates using username and password data. The passport-local package stores authentication data in sessions, so it requires express-session to be set up.

LocalStrategy takes a parameter `verifyCallback` that is used to authenticate users (used in `passport.authenticate('local')`).

```js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const { validPassword } = require('./util');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    // function used to authenticate a user (verifyCallback)
    // call done(error, user) to pass results
    try {
      // finds user in database
      const user = await User.findOne({ username: username });
      if (!user) return done(null, false, { message: 'User does not exist.' });

      //verify password using bcrypt
      const isValid = await validPassword(password, user.password);
      if (!isValid)
        return done(null, false, { message: 'Invalid password provided.' });

      // remove password to send to user
      user.password = undefined;
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
```

Passport also comes with middleware that handles storing and retrieving data from the current session. This middleware calls the `passport.serializeUser` to store a newly authenticated user into the session. On subsequent requests, if the session contains an authenticated user, the passport calls the `passport.deserializeUser` function and attaches the resulting user to `req.user`.

```js
// serializes user into session
passport.serializeUser((user, done) => {
  // store only user.id into session
  done(null, user.id);
});

// deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    // finds user in database using id in session
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// passport middleware
app.use(passport.initialize());
app.use(passport.session());
```

## Registering

Logic to create a user is not handled by passport. A new document in the `users` collection with a username and password field needs to be created.

```js
const express = require('express');
const router = express.Router();

const User = require('../../models/User.js');
const { genPassword, wrapAsync } = require('../../util');

const AppError = require('../../AppError');

// register a user
router.post(
  '/',
  wrapAsync(async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });
    if (foundUser) throw new AppError(400, 'User already exists.');

    const hash = await genPassword(password);
    const user = new User({ username, password: hash });
    const saved = await user.save();

    saved.password = undefined; // don't send password to user
    res.json(saved);
  })
);

module.exports = router;
```

## Authenticating

Authenticating an user uses the `passport.authenticate` method. Normally, this is passed in as middleware but I used it inside the route handler for custom functionality (error handling). `passport. authenticate` uses the passport `verifyCallback` function (defined in config). `passport. authenticate` looks for the username and password field in `req.body` to be used in the verify callback (can be changed in the config). If authentication is successful, the user is serialized into the session.

```js
//by default, if authentication fails - passport.authenticate returns a 401 unauthorized error with a text message
router.post('/', passport.authenticate('local'), (req, res, next) => {
  res.json(req.user);
});

//using a custom callback, handle errors using custom error handler
router.post(
  '/',
  wrapAsync(async (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
      if (err) return next(err);

      if (!user) return next(new AppError(401, info.message));

      //req.logIn function provided by passport - handles user serializing
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        res.json(user);
      });
    })(req, res, next);
  })
);
```

## Authorization

Custom middleware can be used to protect routes. The middleware can call `req.isAuthenticated` (provided by passport) to check if a user is stored in the current session.

```js
const AppError = require('./AppError');

//Authentication middleware

module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    // given by passport
    next();
  } else {
    next(new AppError(401, 'Not authorized.'));
  }
};
```

## Conclusion

This project taught me a lot about different methods of authentication and how to implement session-based authentication. I have used some JWT authentication (without passport) in the past, and it seems more suitable for integrating with React. It is still good to know how session-based authentication works behind the scenes.
