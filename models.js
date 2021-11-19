const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    year: {type: Number, required: true},
    plot: {type: String, required: true},
    director: [{type: mongoose.Schema.Types.ObjectId, ref: 'Director'}],
    genre: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
    imageUrl: String,
});

let directorSchema = mongoose.Schema({
    name: {type: String, required: true},
    bio: String,
    birthday: {type: Date, required: true},
    deathday: Date
});

let genreSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: String
});

let userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    birthday: {type: Date, required: true},
    favoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movies = mongoose.model('Movie', movieSchema);
let Genres = mongoose.model('Genre', genreSchema);
let Directors = mongoose.model('Director', directorSchema);
let Users = mongoose.model('User', userSchema);

module.exports.Movies = Movies;
module.exports.Users = Users;
module.exports.Genres = Genres;
module.exports.Directors = Directors;