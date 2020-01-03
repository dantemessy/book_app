'use strict'


const express = require('express');
const app = express();
const PORT = process.env.PORT || 3333;
const superagent = require('superagent');
// const googleKey = process.env.googleKey;

require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => console.log('first Baby Step'));

app.get('/', (req, res) => {
  res.render('pages/index')
});

app.post('/searches', booksHandler);

function booksHandler(req, res) {
  console.log('handler works')
  let book = req.body.bookTitle;
  console.log(book);
  booksData(book)
    .then((conData) => {
      console.log(conData)
      res.status(200).render('pages/searches/show', { result: conData });
      // res.send(conData);
    })
}

function booksData(bookTitle) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}`;
  console.log('data works')

  return superagent.get(url)
    .then(data => {
      // console.log(data.body.items[0].volumeInfo.imageLinks.thumbnail);
      let book = data.body.items.map((one) => {
        // if (one.volumeInfo.imageLinks.smallThumbnail && one.volumeInfo.title && one.volumeInfo.authors && one.volumeInfo.description) {
        // console.log(one.volumeInfo.authors);
        return new Book(one);
        // }
        // console.log(book);
      })
      console.log('hiiii', book);
      return book;
    });
}



/// the constuctor function

function Book(data) {
  this.image = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) ? data.volumeInfo.imageLinks.thumbnail:'https://i.imgur.com/J5LVHEL.jpg';
  this.title = data.volumeInfo.title ? data.volumeInfo.title : 'Title Not Found !!';
  this.author = data.volumeInfo.authors ? data.volumeInfo.authors : 'Author Not Found !!';
  this.description = data.volumeInfo.description ? data.volumeInfo.description : 'Descripton Not Found !!';

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
let message = 'ERROR OCCURED ABORT MISSION!!'
app.get('*', (req, res) => {
  res.status(404).render('./pages/error', { 'message': message }
  )
})


