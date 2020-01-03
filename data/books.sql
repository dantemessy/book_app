DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    author VARCHAR (255),
    title  VARCHAR (255),
    isbn   VARCHAR (255),
    image_url VARCHAR (255),
    description text,
    bookshelf VARCHAR (255)
);



INSERT INTO books (author, title, isbn, image_url, description, bookshelf)
VALUES ('ahmad' , 'insta' , 'testing' , 'Not Found' , 'nothing' , 'whatever');

INSERT INTO books (author, title, isbn, image_url, description, bookshelf)
VALUES ('amer' , 'hungry' , 'testing' , 'Not Found' , 'nothing' , 'whatever');