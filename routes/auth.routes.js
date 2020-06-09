const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcryptjs = require('bcryptjs')
const saltRounds = 10;

/* GET auth page */
router.get('/signup', (req, res) => res.render('auth/signup'));
router.post('/signup', (req, res, next) => {
    // req.body contiene:
    const {
        username,
        email,
        password
    } = req.body;

    // obligamos rellnar todos campos
    if (!username || !email || !password) {
        res.render('auth/signup', {
            errorMessage: 'All fields are mandatory. Please provide your username, email and password.'
        });
        return;
    }

    // condiciones de contraseña segura
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    // wrong password
    if (!regex.test(password)) {
        res
            .status(400)
            .render('auth/signup', {
                errorMessage: 'Passwords need to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.'
            });
        return;
    }
    // hasheamos contraseña + creamod user en bbdd
    bcryptjs.genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                email,
                passwordHash: hashedPassword
            })
        })
        .then(user => {
            // user logado OK
            res.redirect('/userProfile');
            console.log(`User created with success! ${user}`)
        })
        .catch(err => {
            if (err instanceof mongoose.Error.ValidationError) {

                res.status(400).render('auth/signup', {
                    errorMessage: err.message
                });
            } else if (error.code === 11000) {
                // mail duplicado, error concreto
                res.status(400).render('auth/signup', {
                    errorMessage: 'Username and email need to be unique. Either username or email is already used.'
                })
            } else {
                next(err);
            }
        })
})

//login 
router.get('/login', (req, res) => {
    console.log('SESSION', req.session);
    res.render('auth/login');
})

router.post('/login', (req, res, next) => {

    const {
        username,
        password
    } = req.body;

    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please, enter your username and password to login'
        });
        return;
    }
})

//logout

router.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
})



module.exports = router;