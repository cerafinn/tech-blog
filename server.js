const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({ });
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new sequelizeStore({ db: sequelize })
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});