CREATE DATABASE usersdb;
USE usersdb;
CREATE TABLE collections (
  user_id int NOT NULL,
  itemName varchar(45) NOT NULL,
  PRIMARY KEY (user_id,itemName)
);

CREATE TABLE friendships (
  friendship_id int NOT NULL AUTO_INCREMENT,
  send_id int NOT NULL,
  receiver_id int NOT NULL,
  status tinyint NOT NULL,
  PRIMARY KEY (friendship_id)
);

CREATE TABLE locations (
  user_id int NOT NULL,
  location_id int NOT NULL,
  PRIMARY KEY (user_id,location_id)
);

CREATE TABLE useraccounts (
  user_id int NOT NULL AUTO_INCREMENT,
  displayName varchar(45) NOT NULL,
  score int NOT NULL,
  leaderboardParticipant tinyint NOT NULL,
  difficulty varchar(45) NOT NULL,
  PRIMARY KEY (user_id)
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mysql';
flush privileges;