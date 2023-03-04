const express = require("express")
const router = express.Router();
const movieRouter = require("./movies.js")
const usersRouter = require("./users.js");
const pool = require("../config.js");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require ("jsonwebtoken");
const secretKey = "Rahasia"
const {authentication} = require("../middlewares/auth.js");


router.post("/login", (req, res, next) => {
   const {username, password} = req.body;

   const findUser = `
   SELECT
   *
   FROM users
   WHERE username = $1
   `

   pool.query(findUser, [username], (err, result) => {
    if(err) next(err)

    if(result.rows.length === 0) {
        next({name: "Errornotfound"})
    } else {
        const data = result.rows[0]
        const comparePassword = bcrypt.compareSync(password, data.password);

        if(comparePassword){
        const accessToken = jwt.sign({
            id: data.id,
            email : data.email,
            gender : data.gender,
            role : data.role
        }, secretKey)

        res.status(200).json({
            id: data.id,
            email: data.email,
            accessToken: accessToken
        })
        } else {
            next({name: "Password Salah"})
        }
    }
   })
})

router.post("/register", (req, res, next) => {
    const {email, gender, password, role} = req.body;

    const hash = bcrypt.hashSync(password, salt);

    const insertUser = `
    INSERT INTO users (email, gender, password, role)
    VALUES
    ($1, $2, $3, $4);
    `
    pool.query(insertUser, [email, gender, password, role, hash], (err, result) => {
        if(err) next(err)
        res.status(201).json(
            { message: "User Terdaftar"}
        )

    })
})


router.use(authentication)
router.use("/", movieRouter)

module.exports = router;