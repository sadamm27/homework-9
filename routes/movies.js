const express = require("express")
const router = express.Router();
const pool = require("../config.js");
const {authorization} = require("../middlewares/auth.js");
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
router.get("/movies", (req, res, next) => {
    const {limit, page} = req.query;

    let resultLimit = limit ? +limit : DEFAULT_LIMIT;
    let resultPage = page ? +page : DEFAULT_PAGE;

    const findQuery = `
        SELECT 
        * 
        FROM MOVIES
        ORDER BY movies.id
        LIMIT ${resultLimit} OFFSET ${(resultPage - 1) *resultLimit}
        `
    pool.query(findQuery, (err, result) => {
        if(err) next(err)

        res.status(200).json(result.rows);
    })
})

router.get("/movies/:id", (req, res, next) => {
    
    const {id} = req.params;
    const findOneQuery = `
        SELECT
        * FROM movies
        WHERE movies.id = $1
        `

        pool.query(findOneQuery, [id], (err, result) =>{
            if (err) next(err)
            
            if(result.rows.length === 0) {
                next({name: "ErrorNotFound"})
            } else{
                res.status(200).json(result.rows[0]);
            }
            
        })
})

router.get("/users", (req, res, next) => {

    const findQuery = `
        SELECT 
        * 
        FROM USERS
        ORDER BY users.id;
    `
    pool.query(findQuery, (err, result) => {
        if(err) next(err)

        res.status(200).json(result.rows);
    })
})

router.get("/users/:id", (req, res, next) => {
    
    const {id} = req.params;
    const findOneQuery = `
        SELECT
        * FROM users
        WHERE users.id = $1
        `

        pool.query(findOneQuery, [id], (err, result) =>{
            if (err) next(err)
            
            if(result.rows.length === 0) {
                next({name: "ErrorNotFound"})
            } else{
                res.status(200).json(result.rows[0]);
            }
            
        })
})

router.post("/users", authorization, (req, res, next) => {
    const {email, gender, password, role} = req.body;

    const createUsers =`
    INSERT INTO users (email, gender, password, role)
        VALUES
        ($1, $2, $3, $4)
        RETURNING*;
    `

pool.query(createUsers, authorization, [email, gender, password, role], (err, result) => {
        if(err) next(err)
        const data = result.rows[0]

router.post("/movies", (req, res, next) => {
    const {title, genres, year} = req.body;

    const createMovies =`
    INSERT INTO movies (title, genres, year)
        VALUES
        ($1, $2, $3)
        RETURNING*;
    `

pool.query(createMovies, [title, genres, year], (err, result) => {
        if(err) next(err)
        const data = result.rows[0]
        // let insertGenres = `
        // INSERT INTO movies_genres (movie_id, genre_id)
        // VALUES`

        // for( let i = 0; i < genres.length; i++) {
        //     let temp = '(${data.id}, ${genres[i]})'
        //     if (i === genres.length - 1) {
        //         temp += ';'
        //     } else {
        //         temp += ';'
        //     } insertGenres += temp;
        // }
        // pool.query(insertGenres, (err, result) => {
        //     if(err) next(err)

        //     res.status(201).json({
        //         message: "movies created successfully"
        //     })
    })
})
})
})

router.put("/movies/:id", (req, res, next) =>{
    const {title, genres, id} = req.body;

    const updateMovies = `
    UPDATE movies
    SET title = $1,
    genres = $2
    WHERE id = $3;
    `

    pool.query(updateMovies, [title, genres, id], (err, result) => {
        if(err) next(err)

        res.status(200).json({
            message: "update berhasil"})

 router.put("/users/:id", (req, res, next) =>{
    const {email, gender, password, role, id} = req.body;
            
        const updateUsers = `
        UPDATE users
        SET email = $1,
        gender = $2,
        password = $3,
        role = $4
        WHERE id = $5;
        `
            
        pool.query(updateUsers, [email, gender, password, role, id], (err, result) => {
                    if(err) next(err)
            
                    res.status(200).json({
                        message: "update berhasil"
        })
    })
})
        })
    })

    router.delete("/movies/:id", (req, res, next) => {
        const {id} = req.params;
        const deleteMovies =`
        DELETE FROM movies
        WHERE id = $1;
`
        pool.query(deleteMovies, [id], (err, result) => {
            if(err) next(err)

            res.status(200).json({
                message: "movie berhasil dihapus"
            })
        })
    })

    router.delete("/users/:id", (req, res, next) => {
        const {id} = req.params;
        const deleteUsers =`
        DELETE FROM users
        WHERE id = $1;
`
        pool.query(deleteUsers, [id], (err, result) => {
            if(err) next(err)

            res.status(200).json({
                message: "User berhasil dihapus"
            })
        })
    })
module.exports = router;
