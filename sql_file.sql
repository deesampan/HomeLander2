CREATE TABLE admin(
    user_id SERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO admin (name,password) VALUES ('a','123');

CREATE TABLE governor(
    user_id SERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL
);
INSERT INTO governor (name,password) VALUES ('g','123');

CREATE TABLE landlord(
    user_id SERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL
);
CREATE TABLE customer(
    user_id SERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    date TEXT NOT NULL
);

CREATE TABLE blacklist (
    blacklist_id SERIAL PRIMARY KEY NOT NULL,
    user_name TEXT NOT NULL
);

CREATE TABLE favorite(
    fav_id SERIAL PRIMARY KEY NOT NULL,
    land_id INTEGER NOT NULL,
    fav_owner TEXT NOT NULL
);

CREATE TABLE land(
    land_id SERIAL PRIMARY KEY NOT NULL,
    land_name TEXT NOT NULL,
    land_price INTEGER NOT NULL,
    land_type TEXT NOT NULL,
    land_contanct TEXT NOT NULL,
    land_des TEXT NOT NULL,
    land_status TEXT NOT NULL,
    land_owner TEXT NOT NULL,
    land_image TEXT NOT NULL,
    date TEXT NOT NULL,
    checker BOOLEAN NOT NULL
);

CREATE TABLE view_count(
    view_id SERIAL PRIMARY KEY NOT NULL,
    view_type TEXT NOT NULL,
    view_owner TEXT NOT NULL

);