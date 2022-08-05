DROP DATABASE IF EXISTS usersdb;

CREATE DATABASE usersdb;

USE usersdb;

CREATE TABLE items (
    user_id varchar(255) NOT NULL,
    item_id varchar(255) NOT NULL,
    PRIMARY KEY (user_id, item_id)
);

CREATE TABLE achievements (
    achievement_id int NOT NULL,
    user_id varchar(255) NOT NULL,
    `type` varchar(45) DEFAULT NULL,
    points int DEFAULT NULL,
    image varchar(45) DEFAULT NULL,
    PRIMARY KEY (achievement_id, user_id)
);

CREATE TABLE friendships (
    friendship_id int NOT NULL AUTO_INCREMENT,
    send_id varchar(255) NOT NULL,
    receiver_id varchar(255) NOT NULL,
    `status` tinyint NOT NULL DEFAULT 0,
    PRIMARY KEY (friendship_id)
);

CREATE TABLE locations (
    user_id varchar(255) NOT NULL,
    LocationName varchar(255) NOT NULL,
    PRIMARY KEY (user_id, LocationName)
);

CREATE TABLE useraccounts (
    user_id varchar(255) NOT NULL,
    displayName varchar(45) NOT NULL,
    score int NOT NULL DEFAULT 0,
    leaderboardParticipant tinyint NOT NULL DEFAULT 0,
    difficulty varchar(45) NOT NULL DEFAULT 'Easy',
    PRIMARY KEY (user_id)
);

CREATE TABLE useraccounts (
    user_id varchar(255) NOT NULL,
    displayName varchar(45) NOT NULL,
    score int NOT NULL DEFAULT 0,
    leaderboardParticipant tinyint NOT NULL DEFAULT 0,
    difficulty varchar(45) NOT NULL DEFAULT 'Easy',
    PRIMARY KEY (user_id)
);

CREATE TABLE achievementlist (
  achievement_id int NOT NULL,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (achievement_id)
);

ALTER USER 'root' @'localhost' IDENTIFIED WITH mysql_native_password BY 'mysql';
flush privileges;