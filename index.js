const express = require('express');
const app = express(),
    morgan = require('morgan');

let topMovies = [
    {
        title: 'Big Lebowski, The',
        year: 1998,
    },
    {        
        title: 'Goodwill Hunting',
        year: 1997,
    },
    {
        title: 'One Flew Over the Cuckoo\'s Nest',
        year: 1975,
    },
    {
        title: 'Pulp Fiction',
        year: 1994,
    },
    {
        title: 'Jaws',
        year: 1975,
    },
    {        
        title: 'Dark Knight, The',
        year: 2008,
    },
    {        
        title: 'Back to the Future',
        year: 1985,
    },
    {
        title: 'Catch Me If You Can',
        year: 2002,
    },
    {
        title: 'Conjouring, The',
        year: 2013,
    },
    {
        title: '500 Days of Summer',
        year: 2009,
    }
];
// logger
app.use(morgan('common'));
// static file response documentation.html file
app.use('/documentation.html', express.static('public/documentation.html'));

app.get('/', function (req, res) {
res.send('Welcome to the MyFix App!')
})

app.get('/movies', (req, res)=>{
    res.json(topMovies);
});

// error handeler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(8080, ()=>{
    console.log('App is listening on port 8080')
});
