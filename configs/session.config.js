// las configuraciones necesarias para crear una sesion
const session = require("express-session")

module.exports = app => {
    app.use(

        session({
            //4valores require el metodo session
            secret: process.env.SESS_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 60000
            }
        }))
}