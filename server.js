require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./movies-data.json')


const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next){
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized!' })
  }
  next()
})

app.get('/movies', function handleGetMovies(req, res) {
  let result = MOVIEDEX.movies;

  if (req.query.country) {
    result = result.filter(movies =>
      movies.country.toLowerCase().includes(req.query.country.toLowerCase())
      )
  }
  if (req.query.genre) {
    result = result.filter(movies => 
      movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
      )
  }
  if (req.query.avg_vote) {
    result = result.filter(movie =>
      Number(movie.avg_vote) >= Number(req.query.avg_vote)
      )
    
  }

  res.json(result)
})

app.listen(8001, () => {
  console.log('server listening at port 8001')
})


