DROP DATABASE IF EXISTS pourControlDB;

CREATE DATABASE pourControlDB;
USE pourControlDB;

DROP TABLE IF EXISTS cocktail;
CREATE TABLE cocktail (
    cid INT,
    cocktail_name VARCHAR(30) NOT NULL,
    instructions MEDIUMTEXT,
    CONSTRAINT PK_cocktail PRIMARY KEY (cid)
);

DROP TABLE IF EXISTS ingredient;
CREATE TABLE ingredient (
    iid INT,
    ingredient_name VARCHAR(30) NOT NULL,
    ml_in_stock DECIMAL DEFAULT 0,
    ml_target DECIMAL DEFAULT 0,
    CONSTRAINT PK_ingredient PRIMARY KEY (iid)
);

DROP TABLE IF EXISTS ingredient_in_cocktail;
CREATE TABLE ingredient_in_cocktail (
    id INT AUTO_INCREMENT,
    ingredient_id INT NOT NULL,
    cocktail_id INT NOT NULL,
    ml_required DECIMAL(10, 2) NOT NULL,
    CONSTRAINT PK_ingredient_in_cocktail PRIMARY KEY (id),
    CONSTRAINT UQ_cocktail_ingredient UNIQUE (cocktail_id, ingredient_id),
    CONSTRAINT FK_ingredient_for_cocktail FOREIGN KEY (ingredient_id)
        REFERENCES ingredient (iid),
    CONSTRAINT FK_cocktail_for_ingredient FOREIGN KEY (cocktail_id)
        REFERENCES cocktail (cid)
);

DROP TABLE IF EXISTS daily_sale;
CREATE TABLE daily_sale (
    sid INT AUTO_INCREMENT,
    cocktail_id INT NOT NULL,
    date DATE NOT NULL,
    qty_sold INT NOT NULL,
    CONSTRAINT PK_daily_sale PRIMARY KEY (sid),
    CONSTRAINT FK_cocktail_sale FOREIGN KEY (cocktail_id)
        REFERENCES cocktail (cid)
);

DROP TABLE IF EXISTS daily_audit;
CREATE TABLE daily_audit (
    aid INT AUTO_INCREMENT,
    ingredient_id INT NOT NULL,
    date DATE NOT NULL,
    start_ml DECIMAL DEFAULT 0,
    end_ml DECIMAL DEFAULT 0,
    CONSTRAINT PK_daily_audit PRIMARY KEY (aid),
    CONSTRAINT FK_ingredient_audit FOREIGN KEY (ingredient_id)
        REFERENCES ingredient (iid)
);

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    uid INT AUTO_INCREMENT,
    username VARCHAR(25) NOT NULL,
    email VARCHAR(35) NOT NULL,
    -- the length of this will depend on the hash we use
    -- this is for SHA-256. change to 32 if we want to use MD5
    -- or whatever output length of the hash we end up using
    password_hash VARCHAR(64) NOT NULL,
    CONSTRAINT PK_user PRIMARY KEY (uid)
);
