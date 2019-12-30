'use strict'


const express = require('express');
const app = express();
const PORT = process.env.PORT || 3333;
const superagent = require('superagent');
// const googleKey = process.env.googleKey;

require('dotenv').config();

app.set('view engine', 'ejs');
// app.use(express.urlencoded());


app.listen(PORT, () => console.log('first Baby Step'));

app.get('/', (req, res) => {
  res.render('pages/index')
});

app.get('/searches', booksHandlers);

function booksHandlers(req, res) {
  console.log('handler works')
  let book = req.query['bookTitle'];
  console.log(book);
  booksData(book)
    .then((conData) => {
      app.post('/searches', (req, res) => {
        res.status(200).sendFile('./show.ejs');
      })
      res.send(conData);
    })
}

function booksData(bookTitle) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}`;
  console.log('data works')

  superagent.get(url)
    .then(data => {
      // console.log(data.body.items[0].volumeInfo.imageLinks.thumbnail);
      let book = {};
      book = data.body.items.map((one) => {
        if (one.volumeInfo.imageLinks.smallThumbnail && one.volumeInfo.title && one.volumeInfo.authors && one.volumeInfo.description) {
          console.log(one.volumeInfo.authors);
          return new Book(one);
        }
        console.log(book);
      })
      // console.log('hiiii', book);
      return book;
    });
}



/// the constuctor function

function Book(data) {

  this.image = data.volumeInfo.imageLinks.smallThumbnail;
  this.title = data.volumeInfo.title;
  this.author = data.volumeInfo.authors;
  this.description = data.volumeInfo.description;

}




//link the css file
//thank you ayman
app.use('/public', express.static('public'));



// app.use(express.static('public'));

//test our index !!
// app.get( '/test' , (req , res) => {
//   res.render('pages/index') ;
// })


// errors
app.get('*', (req, res) => {
  res.status(404).send('Ooops 404 !!!')
})


