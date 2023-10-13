require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



const getArtist = async (req, res) => {
  
  try {
  
    const artist = req.query.artist;
    
    const data = await spotifyApi.searchArtists(artist);

    

    res.render('artist-search-results', data.body.artists.items);

  } catch (err) {
    console.log('The error while searching artists occurred: ', err)
  }


}


const getArtistAlbums = async (req, res) => {
  
  try {
  

   
    const artistId = req.params.artistId;
    
    const data = await spotifyApi.getArtistAlbums(artistId);

    
    res.render('albums', data.body.items);

  } catch (err) {
    console.log('The error while searching artists occurred: ', err)
  }


}

const getAlbumTracks = async (req, res) => {
  
  try {
  

   
    const trackId = req.params.trackId;
    
    const data = await spotifyApi.getAlbumTracks(trackId);

    console.log('The received data from the API: ', data.body);

    
    res.render('tracks', data.body.items);

  } catch (err) {
    console.log('The error while searching artists occurred: ', err)
  }


}


// Our routes go here:


app.get('/', (req, res, next) => {
  res.render('index');
})

app.get('/artist-search', (req, res, next) => {
    getArtist(req, res);
  });


app.get('/albums/:artistId', (req, res, next) => {
    getArtistAlbums(req, res);
  });

app.get('/tracks/:trackId', (req, res, next) => {
  getAlbumTracks(req, res);
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
