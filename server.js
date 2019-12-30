'use strict'


const express = require('express') ;
const app = express() ;
const PORT = process.env.PORT || 3333 ;
const superagent = require('superagent') ;

require('dotenv').config() ;

app.set('view engine' , 'ejs') ;

app.listen(PORT, () => console.log('first Baby Step'));

app.get('/' , (req , res) => {
  res.render('pages/index')
});



//link the css file
//thank you ayman
app.use( '/public' , express.static( 'public'));



// app.use(express.static('public'));

//test our index !!
app.get( '/test' , (req , res) => {
  res.render('pages/index') ;
})


// errors
app.get('*' , (req , res) => {
  res.status(404).send('Ooops 404 !!!')
})


