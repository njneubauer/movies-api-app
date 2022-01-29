const bodyParser = require('body-parser');
const express = require('express');
const app = express(),
    morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movies;
const Directors = Models.Directors;
const Genres = Models.Genres;
const Users = Models.Users;
require('dotenv').config();
mongoose.connect(process.env.connection_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// logger
app.use(morgan('common'));

// import CORS and define accepted origins
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://nickflixmovieinfo.netlify.app/'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

// import auth.js file and pass express() to it.
let auth = require('./auth')(app);

// require passport module and import passport.js
const passport = require('passport');
require('./passport');

// import express-validator 
const {check, body, validationResult} = require('express-validator');

// static file response documentation.html file
app.use(express.static('public'));
app.use('/documentation.html', express.static('public/documentation.html'));

// GET REQUESTS

app.get('/', function (req, res) {
    res.send('Welcome to the MyFix App!');
})

// returns a list of all movies
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res)=>{
    // get all movie documents
    Movies.aggregate([
       {
            $lookup: {
                from: "genres",
                localField: "genre",
                foreignField: "_id",
                as: "genreNames"
            }
        },
        {
            $lookup: {
                from: "directors",
                localField: "director",
                foreignField: "_id",
                as: "directorInfo"
            }
        },
        {
            $project: {
                title: 1,
                plot: 1,
                year: 1,
                imageCode: 1,
                "directorInfo.name": 1,
                "directorInfo.bio": 1,
                "directorInfo.birthday": 1,
                "genreNames.name": 1,
                "genreNames.description": 1
            }
        }
    ]).then((allMovies)=>{
        res.json(allMovies);    
    });
});

// returns a document about a single movie
app.get('/movies/:movieTitle', passport.authenticate('jwt', {session: false}), (req, res)=>{
    // set request param to variable
    const movieTitle = req.params.movieTitle;
    // query movies collection by movie title (case insensitive)
    Movies.aggregate([
        {
             $lookup: {
                 from: "genres",
                 localField: "genre",
                 foreignField: "_id",
                 as: "genreNames"
             }
         },
         {
             $lookup: {
                 from: "directors",
                 localField: "director",
                 foreignField: "_id",
                 as: "directorInfo"
             }
         },
         {
             $project: {
                 title: 1,
                 plot: 1,
                 year: 1,
                 imageCode: 1,
                 "directorInfo.name": 1,
                 "directorInfo.bio": 1,
                 "genreNames.name": 1,
             }
        }
    ]).then((movie)=>{
        res.json(movie);
    });
});

// returns a list of all genres and their descriptions
app.get('/genres', passport.authenticate('jwt', {session: false}), (req,res)=>{
    Genres.find().then((genres)=>{
        res.json(genres);
    });
});

// returns a single genre and it's description
app.get('/genres/:genre', passport.authenticate('jwt', {session: false}), (req,res)=>{
    Genres.find({name: req.params.genre}).collation({locale: "en", strength:2}).then((genres)=>{        
        res.json(genres);
    });
});

// returns movies by genre
app.get('/movies/genres/:genre', passport.authenticate('jwt', {session: false}), (req, res)=>{
    // find genre by name
    Genres.find({name: req.params.genre}).collation({locale: 'en', strength:2}).then((genre)=>{
        // get objectID of genre in request
        const genreID = genre[0]._id;
        // query movies collection and find all movies that match genreID
        Movies.aggregate([
            {
                $match: {genre: genreID}
            },
            {
                $lookup: {
                    from: "genres",
                    localField: "genre",
                    foreignField: "_id",
                    as: "genreNames"
                }
            },
            {
                $lookup: {
                    from: "directors",
                    localField: "director",
                    foreignField: "_id",
                    as: "directorInfo"
                }
            },
            {
                $project: {
                    title: 1,
                    plot: 1,
                    year: 1,
                    imageCode: 1,
                    "directorInfo.name": 1,
                    "directorInfo.bio": 1,
                    "genreNames.name": 1
                }
            }
        ]).then((movieInfo)=>{
            res.json(movieInfo);
        })
    })
    .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
});

// return a list of all directors
app.get('/directors', passport.authenticate('jwt', {session: false}), (req, res)=>{
    // find & return all director documents
    Directors.find().then((allDir)=>{
        res.json(allDir);
    });
 });

// return data about a director (bio, birth year, death year etc.)
app.get('/directors/:director', passport.authenticate('jwt', {session: false}), (req, res)=>{
    // find director by name (case insensitive) and return document
    Directors.find({name: req.params.director}).collation({ locale: "en", strength: 2 }).then((director)=>{
        res.json(director);
    });
});

app.get('/user/:username', passport.authenticate('jwt', {session: false}), (req, res)=>{
    // find director by name (case insensitive) and return document
    Users.findOne({username: req.params.username}).collation({ locale: "en", strength: 2 }).then((user)=>{
        Users.aggregate([
            {
                $match: {_id: user._id}
            },
            {
                $lookup: {
                    from: "movies",
                    localField: "favoriteMovies",
                    foreignField: "_id",
                    as: "favoriteMoviesInfo"
                }
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    birthday: 1,
                    favoriteMovies: 1,
                    "favoriteMoviesInfo": {
                        _id: 1,
                        title: 1,
                        year: 1
                    }
                }
            }]).then((userFavorites)=>{
                    res.json(userFavorites[0]);
                }).catch((error)=>{
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                });
    });
});

// POST REQUESTS

// register a new user
app.post('/registration',
  // Validation logic for request
  [
    check('username', 'Username is required').isLength({min: 5}),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);
    // find user, IF exists return message message "already exists" ELSE create new user
    Users.findOne({ username: req.body.username }).then((user)=>{
        if (user) {
            return res.status(400).send(req.body.username + ' already exists');
        }
        else {
            Users.create({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                birthday: req.body.birthday
            }).then((user)=>{res.status(200).json(user)})
            .catch((error)=>{
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error)=>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// add movie to users favorites list
app.post('/:username/addmovie/:movieTitle', passport.authenticate('jwt', {session: false}), (req,res)=>{
    // find movie objectID
    Movies.findOne({title: req.params.movieTitle}).collation({locale: "en", strength:2})
    .then((movie)=>{
        let movieID = movie._id;
        return movieID;
    }).then((movieID)=>{
        // use movieID to update user favorites list
        Users.findOneAndUpdate(
            {username: req.params.username},
            {$addToSet: {favoriteMovies: movieID}},
            {new: true},
            (err, updatedFavMovies)=>{
                if (err){
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                }
                else {
                    Users.aggregate([
                        {
                            $match: {_id: updatedFavMovies._id}
                        },
                        {
                            $lookup: {
                                from: "movies",
                                localField: "favoriteMovies",
                                foreignField: "_id",
                                as: "favoriteMoviesInfo"
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                email: 1,
                                favoriteMovies: 1,
                                "favoriteMoviesInfo": {
                                    _id: 1,
                                    title: 1,
                                    year: 1
                                }
                            }
                        }]).then((userFavorites)=>{
                                res.json(userFavorites[0]);
                            }).catch((error)=>{
                                console.error(error);
                                res.status(500).send('Error: ' + error);
                            });
                }
            });
    }).catch((error)=>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// PUT Requests

// update user info
app.put('/user/update/:username', passport.authenticate('jwt', {session: false}),
    [
        body('username', 'Username is required').isLength({min: 5}),
        body('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        body('password', 'Password is required').not().isEmpty(),
        body('email', 'Email does not appear to be valid').isEmail()
    ], (req,res)=>{

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    let hashedPassword = Users.hashPassword(req.body.password);
    // update user info and return updated document
    Users.findOne({username: req.params.username}).then((user)=>{
        if (!user){
            res.status(400).send('user does not exist');
            return;
        }
        else {
            Users.findOneAndUpdate(
                {username: req.params.username},
                {$set:
                    {
                        username: req.body.username,
                        password: hashedPassword,
                        email: req.body.email,
                        birthday: req.body.birthday
                    }
                },
                {new: true},
                (err, updatedUser)=>{
                    if (err){
                        console.error(err);
                        res.status(500).send('Error: ' + err);
                    }
                    else {
                        Users.aggregate([
                            {
                                $match: {_id: updatedUser._id}
                            },
                            {
                                $lookup: {
                                    from: "movies",
                                    localField: "favoriteMovies",
                                    foreignField: "_id",
                                    as: "favoriteMoviesInfo"
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    username: 1,
                                    email: 1,
                                    birthday: 1,
                                    favoriteMovies: 1,
                                    "favoriteMoviesInfo": {
                                        _id: 1,
                                        title: 1,
                                        year: 1
                                    }
                                }
                            }
                        ]).then((updatedUser)=>{
                                    res.json(updatedUser[0]);
                                }).catch((error)=>{
                                    console.error(error);
                                    res.status(500).send('Error: ' + error);
                                });
                    }
                }
            )
        }
    }).catch((error)=>{
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// DELETE REQUESTS

// delete movie from user's favorites list
app.delete('/:username/favorites/delete/:movieTitle', passport.authenticate('jwt', {session: false}), (req,res)=>{
    Movies.findOne({title: req.params.movieTitle}).collation({locale:"en", strength:2}).then((movie)=>{
        let movieID = movie._id;
        return movieID;
        }).then((movieId)=>{
            Users.findOneAndUpdate(
                {username: req.params.username},
                {$pull:{favoriteMovies: movieId}},
                {new: true},
                (err, updatedFavMovies)=>{
                    if (err){
                        console.error(err);
                        res.status(500).send('Error: ' + err);
                    }
                    else {
                        Users.aggregate([
                            {
                                $match: {_id: updatedFavMovies._id}
                            },
                            {
                                $lookup: {
                                    from: "movies",
                                    localField: "favoriteMovies",
                                    foreignField: "_id",
                                    as: "favoriteMoviesInfo"
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    username: 1,
                                    email: 1,
                                    favoriteMovies: 1,
                                    "favoriteMoviesInfo": {
                                        _id: 1,
                                        title: 1,
                                        year: 1
                                    }
                                }
                            }
                        ]).then((userFavorites)=>{
                                    res.json(userFavorites[0]);
                                }).catch((error)=>{
                                    console.error(error);
                                    res.status(500).send('Error: ' + error);
                                });
                    }
                }
            )
        }).catch((error)=>{
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// deregister an existing user
app.delete('/remove/:username', passport.authenticate('jwt', {session: false}), (req,res)=>{
    // remove user by objectID, notify if user doesn't exist
    Users.findOneAndRemove({username: req.params.username}).then((user)=>{
        if (!user){
            res.status(400).send(req.params.username + " user was not found");
        }
        else {
            res.status(200).send(req.params.username + " user has been successfully removed");
        }
    }).catch((err)=>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// error handeler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error: ' + err);
  });

const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',()=>{
    console.log(`App is listening on port ${port}`);
});
