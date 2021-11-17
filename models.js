const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    year: {type: Number, required: true},
    description: {type: String, required: true},
    genre: {
        name: String,
        description: String
    },
    director: {
        name: String,
        bio: String
    },
    actors: [String],
    imageUrl: String,
    featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, reuqired: true},
    Password: {type: String, reuqired: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let genreSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: String
});

let Movie = mongoose.model('movies', movieSchema,);
let User = mongoose.model('users', userSchema);
let Genre = mongoose.model('genres', genreSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;