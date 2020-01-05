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

//using method over ride
const methodOverride = require('method-override');

app.set('view engine', 'ejs');


// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')) ;


app.listen(PORT, () => console.log('first Baby Step'));




// new route to update the database values ///////
app.put('/update/:book_id', updateValues) ;
function updateValues( req , res ){
  let { title, author, isbn, image, description, bookshelf} = req.body ;
  let SQL = 'UPDATE books SET author=$1, title=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7 ;';
  let values =[author, title, isbn, image, description ,bookshelf, req.params.book_id];
  return client.query(SQL, values)
    .then(() => {

      return res.redirect(`/details/${values[6]}`);
    })
}



// new route to delete data from database
app.delete('/delete/:the_book' , deleteFunction) ;
function deleteFunction(req , res){
  let SQL = 'DELETE FROM books WHERE id=$1 ;' ;
  let values = [req.params.the_book] ;

  return client.query(SQL , values)
    .then(() => {

      return res.redirect('/');
    })

}





// new route to add book to DB
app.post('/books' , addToDatabase) ;
function addToDatabase(req , res){

  let {title, author, id, image, info, shelf} = req.body ;
  let SQL = 'INSERT INTO books(author, title, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4 ,$5 ,$6);' ;
  let values = [title, author, id, image, info, shelf] ;
  return client.query(SQL , values)
    .then(() => {
      return res.redirect('/');
    })
}


// show detaile about spacific book in the main page
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
// the (/) route which should show a list of books from the DB
app.get('/', renderMainPage);

function renderMainPage(req, res){

  let sql = `SELECT * FROM books`;
  return client.query(sql)
    .then((tableData) => {
      // console.log('tabledata' , tableData.rows);
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
        return new Book(one);
      })
      // console.log('hiiii', book);
      return book;
    });
}



/// the constuctor function

function Book(data) {
  this.tag= data.etag ;
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


