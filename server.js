'use strict'


const express = require('express');
const app = express();
const PORT = process.env.PORT || 3333;
const superagent = require('superagent');
// const googleKey = process.env.googleKey;
require('dotenv').config();

//link the css file
//thank you ayman
app.use('/public', express.static('public'));
// app.use('/veiws', express.static('veiws'));

// start database
const DATABASE_URL = process.env.DATABASE_URL ;
const pg = require('pg') ;
const client = new pg.Client(DATABASE_URL) ;



app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => console.log('first Baby Step'));

// the (/) route which should show a list of books from the DB

app.get('/', renderMainPage);

// show detaile about spacific book
app.get('/details/:library_id' , spacificBook);

function spacificBook ( req , res ) {

  console.log('detail function');
  let SQL = 'SELECT * FROM books WHERE id=$1;' ;
  let values = [req.params.library_id] ;
  return client.query(SQL , values)
    .then((tableIdData) => {
      // console.log(tableIdData.rows[0]);
      return res.render('pages/books/detail' , { theChoosenOne : tableIdData.rows[0]})
    })

}

/////////////////////////////////////

function renderMainPage(req, res){

  let sql = `SELECT * FROM books`;
  return client.query(sql)
    .then((tableData) => {
      console.log('tabledata' , tableData.rows.length);
      res.render('pages/index.ejs' , {library : tableData.rows});

    })

}

app.get('/form', (req, res) => {
  res.render('pages/searches/new')
});

app.post('/searches', booksHandler);

function booksHandler(req, res) {
  console.log('handler works')
  let book = req.body.bookTitle;
  let choose = req.body.title;
  // console.log(book);
  booksData(book , choose)
    .then((conData) => {
      // console.log(conData)
      res.status(200).render('pages/searches/show', { result: conData });
      // res.send(conData);
    })
}

function booksData(bookTitle, choose) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}+${choose}`;
  console.log('data works')
  console.log(url)


  return superagent.get(url)
    .then(data => {
      // console.log(data.body.items);
      let book = data.body.items.map((one) => {
        // if (one.volumeInfo.imageLinks.smallThumbnail && one.volumeInfo.title && one.volumeInfo.authors && one.volumeInfo.description) {
        // console.log(one.volumeInfo.authors);
        return new Book(one);
        // }
        // console.log(book);
      })
      // console.log('hiiii', book);
      return book;
    });
}



/// the constuctor function

function Book(data) {
  this.id = data.id ;
  this.image = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) ? data.volumeInfo.imageLinks.thumbnail:'https://i.imgur.com/J5LVHEL.jpg';
  this.title = data.volumeInfo.title ? data.volumeInfo.title : 'Title Not Found !!';
  this.author = data.volumeInfo.authors ? data.volumeInfo.authors : 'Author Not Found !!';
  this.description = data.volumeInfo.description ? data.volumeInfo.description : 'Descripton Not Found !!';

}






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

client.connect()
  .then(() => {
    console.log('AM A LIVE ' , PORT);
  })


