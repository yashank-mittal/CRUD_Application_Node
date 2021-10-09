const express = require('express');
const route = express.Router()
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash');
const services = require('../services/render');
const controller = require('../controller/controller');

/**
 *  @description Root Route
 *  @method GET /
 */

//auth

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []


route.get('/', checkAuthenticated, (req, res) => {
    route.render('auth/index.ejs');
    })
    
    route.get('/login', checkNotAuthenticated, (req, res) => {
      res.render('auth/login.ejs')
    })
    
    route.post('/login', checkNotAuthenticated, passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }))
    
    route.get('/register', checkNotAuthenticated, (req, res) => {
      res.render('auth/register.ejs')
    })
    
    route.post('/register', checkNotAuthenticated, async (req, res) => {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
          id: Date.now().toString(),
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        })
        res.redirect('/login')
      } catch {
        res.redirect('/register')
      }
    })
    
    route.delete('/logout', (req, res) => {
      req.logOut()
      res.redirect('/login')
    })
    
    function checkAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }
    
      res.redirect('/login')
    }
    
    function checkNotAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return res.redirect('/')
      }
      next()
    }

route.get('/', services.homeRoutes);

/**
 *  @description add users
 *  @method GET /add-user
 */
route.get('/add-user', services.add_user)

/**
 *  @description for update user
 *  @method GET /update-user
 */
route.get('/update-user', services.update_user)


// API
route.post('/api/users', controller.create);
route.get('/api/users', controller.find);
route.put('/api/users/:id', controller.update);
route.delete('/api/users/:id', controller.delete);




module.exports = route