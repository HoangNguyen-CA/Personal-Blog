app.use(
  session({
    secret: 'not a good secret',
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equal to 1 day
    },
  })
);
