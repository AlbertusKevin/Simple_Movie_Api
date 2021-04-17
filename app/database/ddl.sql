CREATE database movie_api;
use movie_api;

CREATE TABLE users (
	username VARCHAR(25) NOT NULL,
	email VARCHAR(25) NOT NULL,
	name VARCHAR(50) NOT NULL,
	password VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE genre(
    id INT NOT NULL AUTO_INCREMENT,
    genre VARCHAR(25) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE movie (
    movie_id INT NOT NULL AUTO_INCREMENT,
    acc_rating FLOAT NOT NULL,
    duration INT NOT NULL,
    genre INT NOT NULL,
    poster VARCHAR(255),
    synopsis TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    year CHAR(4),
    PRIMARY KEY (movie_id),
    FOREIGN KEY (genre) REFERENCES genre (id)
);

CREATE TABLE watched (
	username VARCHAR(25) NOT NULL,
	movie_id INT NOT NULL,
    PRIMARY KEY (username, movie_id),
	FOREIGN KEY (username) REFERENCES users (username),
	FOREIGN KEY (movie_id) REFERENCES movie (movie_id)
);

CREATE TABLE watchlist (
	username VARCHAR(25) NOT NULL,
	movie_id INT NOT NULL,
    title_list VARCHAR(25) NOT NULL,
    PRIMARY KEY (username, movie_id),
	FOREIGN KEY (username) REFERENCES users (username),
	FOREIGN KEY (movie_id) REFERENCES movie (movie_id)
);

CREATE TABLE rating (
	username VARCHAR(25) NOT NULL,
	movie_id INT NOT NULL,
    stars INT(1) NOT NULL,
    PRIMARY KEY (username, movie_id),
	FOREIGN KEY (username) REFERENCES users (username),
	FOREIGN KEY (movie_id) REFERENCES movie (movie_id)
);

CREATE TABLE comment (
	username VARCHAR(25) NOT NULL,
	movie_id INT NOT NULL,
    comment VARCHAR(255) NOT NULL,
    PRIMARY KEY (username, movie_id),
	FOREIGN KEY (username) REFERENCES users (username),
	FOREIGN KEY (movie_id) REFERENCES movie (movie_id)
);

CREATE TABLE cast (
    id CHAR(9) NOT NULL,
    dob DATE NOT NULL,
    hometown VARCHAR(255) NOT NULL,
    link_profile VARCHAR(255),
    miniBio TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    photo VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE movie_cast(
    actor_id CHAR(9) NOT NULL,
    movie_id INT NOT NULL,
    PRIMARY KEY (actor_id, movie_id),
	FOREIGN KEY (actor_id) REFERENCES cast (id),
	FOREIGN KEY (movie_id) REFERENCES movie (movie_id)
);

CREATE TABLE director(
    director_id CHAR(9) NOT NULL,
    movie_id INT NOT NULL,
    PRIMARY KEY (director_id, movie_id),
	FOREIGN KEY (director_id) REFERENCES cast (id),
	FOREIGN KEY (movie_id) REFERENCES movie (movie_id)
);