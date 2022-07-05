CREATE DATABASE world_database;
USE world_database;
DROP TABLE messages;
CREATE TABLE locations(
	ID int NOT NULL AUTO_INCREMENT,
    CoordinateLatitude int NOT NULL,
    CoordinateLongtitude int NOT NULL,
    LocationName varchar(255) NOT NULL,
    FunFacts text ,
    RelatedLinks text,
    About text,
    Image text,
    UserAccountId int NOT NULL,    
    PRIMARY KEY (ID)
    
);
CREATE TABLE messages(
	ID int NOT NULL AUTO_INCREMENT,
    CoordinateLatitude int NOT NULL,
    CoordinateLongtitude int NOT NULL,
    Message varchar(255) NOT NULL, 
    UserAccountIdmessages int NOT NULL,    
    PRIMARY KEY (ID)    
);
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mysql';
flush privileges;


