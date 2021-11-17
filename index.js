const express = require('express');
const app = express(),
    morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;

mongoose.connect('mongodb://localhost:27017/MyFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

let movieList = [
    {
        title: 'The Big Lebowski',
        year: 1998,
        plot: "Two goons mistake 'the Dude' Lebowski for a millionaire Lebowski and urinate on his rug. Trying to recompense his rug from the wealthy Lebowski, he gets entwined in an intricate kidnapping case.",
        genre: ['Comedy', 'Crime'],
        director: [
            {   
                name: 'Joel Coen',
                bio: 'Joel Coen was born on November 29, 1954 in Minneapolis, Minnesota, USA as Joel Daniel Coen. He is a producer and writer, known for The Ballad of Buster Scruggs (2018), Fargo (1996) and Barton Fink (1991). He has been married to Frances McDormand since April 1, 1984. They have one child.',
                dob: 1954-11-29,
                dod: 'alive'
            },
            {   
                name: 'Ethan Coen',
                bio: 'The younger brother of Joel, Ethan Coen is an Academy Award and Golden Globe winning writer, producer and director coming from small independent films to big profile Hollywood films. He was born on September 21, 1957 in Minneapolis, Minnesota. In some films of the brothers- Ethan & Joel wrote, Joel directed and Ethan produced - with both editing under the name of Roderick Jaynes; but in 2004 they started to share the three main duties plus editing. Each film bring its own quality, creativity, art and with one project more daring the other.',
                dob: 1957-9-21,
                dod: 'alive'
            }
        ]
    },
    {        
        title: 'Goodwill Hunting',
        plot: "Will Hunting, a genius in mathematics, solves all the difficult mathematical problems. When he faces an emotional crisis, he takes help from psychiatrist Dr Sean Maguireto, who helps him recover.",
        year: 1997,
        genre: ['Drama', 'Romance'],
        director: {
            name: 'Gus Van Sant',
            bio: 'Gus Van Sant was born on July 24, 1952 in Louisville, Kentucky, USA as Gus Greene Van Sant Junior. He is a director and producer, known for Elephant (2003), Drugstore Cowboy (1989) and Paranoid Park (2007).',
            dob: 1952-7-24,
            dod: 'alive'
        }
    },
    {
        title: 'One Flew Over the Cuckoo\'s Nest',
        year: 1975,
        plot: "In order to escape the prison labour, McMurphy, a prisoner, fakes insanity and is shifted to the special ward for the mentally unstable. In this ward, he must rise up against a cruel nurse, Ratched.",
        genre: ['Drama'],
        director: {
            name: 'Milos Forman',
            bio: "Milos Forman was born Jan Tomas Forman in Caslav, Czechoslovakia, to Anna (Svabova), who ran a summer hotel, and Rudolf Forman, a professor. During World War II, his parents were taken away by the Nazis, after being accused of participating in the underground resistance. His father died in Buchenwald and his mother died in Auschwitz, and Milos became an orphan very early on. He studied screen-writing at the Prague Film Academy (F.A.M.U.). In his Czechoslovakian films, Black Peter (1964), A Blonde in Love (1965), and The Firemen's Ball (1967), he created his own style of comedy. During the invasion of his country by the troops of the Warsaw pact in the summer of 1968 to stop the Prague spring, he left Europe for the United States. In spite of difficulties, he filmed Taking Off (1971) there and achieved his fame later with One Flew Over the Cuckoo's Nest (1975) adapted from the novel of Ken Kesey, which won five Oscars including one for direction. Other important films of Milos Forman were the musical Hair (1979) and his biography of Wolfgang Amadeus Mozart, Amadeus (1984), which won eight Oscars.",
            dob: 1932-2-18,
            dod: 2018-4-13
        }
    },
    {
        title: 'Pulp Fiction',
        year: 1994,
        plot: "In the realm of underworld, a series of incidents intertwines the lives of two Los Angeles mobsters, a gangster's wife, a boxer and two small-time criminals.",
        genre: ['Crime', 'Drama'],
        director: {
            name: 'Quentin Tarantino',
            bio: "Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee. Quentin moved with his mother to Torrance, California, when he was four years old. In January of 1992, first-time writer-director Tarantino's Reservoir Dogs (1992) appeared at the Sundance Film Festival. The film garnered critical acclaim and the director became a legend immediately. Two years later, he followed up Dogs success with Pulp Fiction (1994) which premiered at the Cannes film festival, winning the coveted Palme D'Or Award. At the 1995 Academy Awards, it was nominated for the best picture, best director and best original screenplay. Tarantino and writing partner Roger Avary came away with the award only for best original screenplay. In 1995, Tarantino directed one fourth of the anthology Four Rooms (1995) with friends and fellow auteurs Alexandre Rockwell, Robert Rodriguez and Allison Anders. The film opened December 25 in the United States to very weak reviews. Tarantino's next film was From Dusk Till Dawn (1996), a vampire/crime story which he wrote and co-starred with George Clooney. The film did fairly well theatrically. Since then, Tarantino has helmed several critically and financially successful films, including Jackie Brown (1997), Kill Bill: Vol. 1 (2003), Kill Bill: Vol. 2 (2004), Inglourious Basterds (2009), Django Unchained (2012) and The Hateful Eight (2015).",
            dob: 1963-3-27,
            dod: 'alive'
        }
    },
    {
        title: 'Jaws',
        year: 1975,
        plot: "A police chief, a marine scientist and a fisherman spring into action after a white shark terrorises the inhabitants of Amity, a quiet island.",
        genre: ['Adventure', 'Thriller'],
        director: {
            name: 'Steven Spielberg',
            bio: "One of the most influential personalities in the history of cinema, Steven Spielberg is Hollywood's best known director and one of the wealthiest filmmakers in the world. He has an extraordinary number of commercially successful and critically acclaimed credits to his name, either as a director, producer or writer since launching the summer blockbuster with Jaws (1975), and he has done more to define popular film-making since the mid-1970s than anyone else.",
            dob: 1946-12-18,
            dod: 'alive'
        }
    },
    {        
        title: 'The Dark Knight',
        plot: "After Gordon, Dent and Batman begin an assault on Gotham's organised crime, the mobs hire the Joker, a psychopathic criminal mastermind who offers to kill Batman and bring the city to its knees.",
        year: 2008,
        genre: ['Action', 'Crime', 'Drama'],
        director: {
            name: 'Christopher Nolan',
            bio: "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made. At 7 years old, Nolan began making short movies with his father's Super-8 camera. While studying English Literature at University College London, he shot 16-millimeter films at U.C.L.'s film society, where he learned the guerrilla techniques he would later use to make his first feature, Following (1998), on a budget of around $6,000. The noir thriller was recognized at a number of international film festivals prior to its theatrical release and gained Nolan enough credibility that he was able to gather substantial financing for his next film. Nolan's second film was Memento (2000), which he directed from his own screenplay based on a short story by his brother Jonathan. Starring Guy Pearce, the film brought Nolan numerous honors, including Academy Award and Golden Globe Award nominations for Best Original Screenplay. Nolan went on to direct the critically acclaimed psychological thriller, Insomnia (2002), starring Al Pacino, Robin Williams and Hilary Swank. The turning point in Nolan's career occurred when he was awarded the chance to revive the Batman franchise in 2005. In Batman Begins (2005), Nolan brought a level of gravitas back to the iconic hero, and his gritty, modern interpretation was greeted with praise from fans and critics alike. Before moving on to a Batman sequel, Nolan directed, co-wrote, and produced the mystery thriller The Prestige (2006), starring Christian Bale and Hugh Jackman as magicians whose obsessive rivalry leads to tragedy and murder. In 2008, Nolan directed, co-wrote, and produced The Dark Knight (2008) which went on to gross more than a billion dollars at the worldwide box office. Nolan was nominated for a Directors Guild of America (D.G.A.) Award, Writers Guild of America (W.G.A.) Award and Producers Guild of America (P.G.A.) Award, and the film also received eight Academy Award nominations. In 2010, Nolan captivated audiences with the sci-fi thriller Inception (2010), which he directed and produced from his own original screenplay. The thought-provoking drama was a worldwide blockbuster, earning more than $800,000,000 and becoming one of the most discussed and debated films of the year. Among its many honors, Inception received four Academy Awards and eight nominations, including Best Picture and Best Screenplay. Nolan was recognized by his peers with D.G.A. and P.G.A. Award nominations, as well as a W.G.A. Award for his work on the film. One of the best-reviewed and highest-grossing movies of 2012, The Dark Knight Rises (2012) concluded Nolan's Batman trilogy. Due to his success rebooting the Batman character, Warner Bros. enlisted Nolan to produce their revamped Superman movie Man of Steel (2013), which opened in the summer of 2013. In 2014, Nolan directed, wrote, and produced the science-fiction epic Interstellar (2014), starring Matthew McConaughey, Anne Hathaway and Jessica Chastain. Paramount Pictures and Warner Bros. released the film on November 5, 2014, to positive reviews and strong box-office results, grossing over $670 million dollars worldwide.",
            dob: 1970-7-30,
            dod: 'alive'
        }
    },
    {        
        title: 'Back to the Future',
        year: 1985,
        plot: "Marty travels back in time using an eccentric scientist's time machine. However, he must make his high-school-aged parents fall in love in order to return to the present.",
        genre: ['Adventure', 'Comedy', 'Sci-Fi'],
        director: {
            name: 'Robert Zemeckis',
            bio: "A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films). Usually working with writing partner Bob Gale, Robert's earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985)). His later films have become more serious, with the hugely successful Tom Hanks vehicle Forrest Gump (1994) and the Jodie Foster film Contact (1997), both critically acclaimed movies. Again, these films incorporate stunning effects. Robert has proved he can work a serious story around great effects.",
            dob: 1951-5-14,
            dod: 'alive'
        }
    },
    {
        title: 'Catch Me If You Can',
        year: 2002,
        plot: "Notorious con artist Frank Abagnale has duped people worth millions of dollars with his masterful art of deception. With his scams getting bolder, he is soon pursued by FBI agent Carl Hanratty.",
        genre: ['Biography', 'Crime', 'Drama'],
        director: {
            name: 'Steven Spielberg',
            bio: "One of the most influential personalities in the history of cinema, Steven Spielberg is Hollywood's best known director and one of the wealthiest filmmakers in the world. He has an extraordinary number of commercially successful and critically acclaimed credits to his name, either as a director, producer or writer since launching the summer blockbuster with Jaws (1975), and he has done more to define popular film-making since the mid-1970s than anyone else.",
            dob: 1946-12-18,
            dod: 'alive'
        }
    },
    {
        title: 'The Conjouring',
        year: 2013,
        plot: "The Perron family moves into a farmhouse where they experience paranormal phenomena. They consult demonologists, Ed and Lorraine Warren, to help them get rid of the evil entity haunting them.",
        genre: ['Horror', 'Thriller'],
        director: {
            name: 'James Wan',
            bio: "James Wan (born 26 February 1977) is an Australian film producer, screenwriter and film director of Malaysian Chinese descent. He is widely known for directing the horror film Saw (2004) and creating Billy the puppet. Wan has also directed Dead Silence (2007), Death Sentence (2007), Insidious (2010), The Conjuring (2013) and Furious 7 (2015).",
            dob: 1977-2-26,
            dod: 'alive'
        }
    },
    {
        title: '500 Days of Summer',
        year: 2009,
        plot: "Tom revisits the approximate one year he shared with Summer, the girl he thought he could spend the rest of his life with. She, on the other hand, does not believe in relationships or boyfriends.",
        genre: ['Drama', 'Romance'],
        director: {
            name: 'Marc Webb',
            bio: 'Marc Webb was born on August 31, 1974. He is a producer and director, known for 500 Days of Summer (2009), Gifted (2017) and Crazy Ex-Girlfriend (2015). He has been married to Jane P. Herman since October 4, 2019. They have two children.',
            dob: 1974-08-31,
            dod: 'alive'
        }
    }
];

// logger
app.use(morgan('common'));
// static file response documentation.html file
app.use('/documentation.html', express.static('public/documentation.html'));

// GET REQUESTS

app.get('/', function (req, res) {
    res.send('Welcome to the MyFix App!');
})

// returns a list of all movies
app.get('/movies', (req, res)=>{
    // get all movie documents
    Movies.find({}).then((allMovies=>{
        res.json(allMovies);    
    }))
});

// returns a document about a single movie
app.get('/movies/:title', (req, res)=>{
    // set request param to variable
    const movieTitle = req.params.title;
    // query movies collection by movie title (case insensitive)
    Movies.find({title: movieTitle}).collation({locale:"en", strength: 2}).then((movie)=>{
        res.json(movie);
    });
});

// returns a list by genre
app.get('/genre/:genre', (req, res)=>{
    // set request genre string to lowercase
    let genre = req.params.genre.toLocaleLowerCase();
    // capitalize first letter of genre string
    let movieGenre = genre.charAt(0).toUpperCase() + genre.slice(1);
    // get objectID of genre from request
    Genres.find({name: movieGenre}).then((genre)=>{
        // get objectID of genre in request
        const genreID = genre[0]._id;
        // query movies collection and find all movies that match genreID
        Movies.find({genre: genreID}).then((movies)=>{
            res.json(movies);
        });
    }).catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
});

// return a list of all directors
app.get('/directors', (req, res)=>{
    res.send('Successful GET request to return a list of directors')
 });

// return data about a director (bio, birth year, death year etc.)
app.get('/directors/:director', (req, res)=>{
    res.send('Successful GET request to return data about a director');
});

// POST REQUESTS

// register a new user
app.post('/registration', (req,res)=>{
    res.send('Successful POST request to register user');
});
// add movie to users favorites list
app.post('/:userID/favorites/add/:movie', (req,res)=>{
    res.send('Successful POST request to add a movie to favorites list');
});

// PUT Requests

// update user info
app.put('/:userID/update/user_info', (req,res)=>{
    res.send('Successful PUT request to update user info (username)');
});

// DELETE REQUESTS

// delete movie from user's favorites list
app.delete('/:userID/favorites/delete/:movie', (req,res)=>{
    res.send('Successful DELETE request to remove a movie to favorites list');
});
// deregister an existing user
app.delete('/remove_acct/:userID', (req,res)=>{
    res.send('Successful DELETE request to remove user acct');
});

// error handeler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(8080, ()=>{
    console.log('App is listening on port 8080')
});
