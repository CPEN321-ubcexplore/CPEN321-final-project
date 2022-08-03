USE testusersdb;

-- PROCEDURES
DROP PROCEDURE IF EXISTS findById;
DELIMITER | 
CREATE PROCEDURE findById (IN id varchar(255)) BEGIN
SELECT *
FROM useraccounts
WHERE user_id = id
LIMIT 1;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS findByName;
DELIMITER | 
CREATE PROCEDURE findByName (IN name varchar(45)) BEGIN
SELECT *
FROM useraccounts
WHERE displayName = name
LIMIT 1;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS createAccount;
DELIMITER | 
CREATE PROCEDURE createAccount (IN id varchar(255), IN name varchar(45)) BEGIN
INSERT INTO useraccounts (user_id, displayName)
VALUES (id, name);
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS getGlobalLeaderboard;
DELIMITER | 
CREATE PROCEDURE getGlobalLeaderboard () BEGIN
SELECT displayName, score
FROM useraccounts
WHERE leaderboardParticipant = 1
ORDER BY score DESC
LIMIT 100;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS participateInLeaderboard;
DELIMITER | 
CREATE PROCEDURE participateInLeaderboard (IN id varchar(255)) BEGIN
UPDATE useraccounts
SET leaderboardParticipant = 1
WHERE user_id = id;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS changeDifficulty;
DELIMITER | 
CREATE PROCEDURE changeDifficulty (IN id varchar(255), IN difficulty varchar(45)) BEGIN
UPDATE useraccounts
SET difficulty = difficulty
WHERE user_id = id;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS getFriends;
DELIMITER | 
CREATE PROCEDURE getFriends (IN id varchar(255)) BEGIN
SELECT displayName
FROM useraccounts
JOIN friendships
ON friendships.send_id = useraccounts.user_id
OR friendships.receiver_id = useraccounts.user_id
WHERE user_id != id
AND status = 1
AND (receiver_id = id OR send_id = id);
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS getIncomingRequests;
DELIMITER | 
CREATE PROCEDURE getIncomingRequests (IN id varchar(255)) BEGIN
SELECT displayName
FROM useraccounts
JOIN friendships
ON friendships.send_id = useraccounts.user_id
OR friendships.receiver_id = useraccounts.user_id
WHERE user_id != id
AND status = 0
AND receiver_id = id;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS getOutgoingRequests;
DELIMITER | 
CREATE PROCEDURE getOutgoingRequests (IN id varchar(255)) BEGIN
SELECT displayName
FROM useraccounts
JOIN friendships
ON friendships.send_id = useraccounts.user_id
OR friendships.receiver_id = useraccounts.user_id
WHERE user_id != id
AND status = 0
AND send_id = id;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS addFriend;
DELIMITER | 
CREATE PROCEDURE addFriend (IN send_id varchar(255), IN receiver_id varchar(255)) BEGIN
INSERT INTO friendships (send_id, receiver_id)
VALUES (send_id, receiver_id);
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS removeFriend;
DELIMITER | 
CREATE PROCEDURE removeFriend (IN id varchar(255), IN friend_id varchar(255)) BEGIN
DELETE FROM friendships
WHERE ((send_id = id AND receiver_id = friend_id)
OR (send_id = friend_id AND receiver_id = id))
AND status = 1;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS acceptRequest;
DELIMITER | 
CREATE PROCEDURE acceptRequest (IN id varchar(255), IN friend_id varchar(255)) BEGIN
UPDATE friendships
SET status = 1
WHERE send_id = friend_id
AND receiver_id = id
AND status = 0;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS denyRequest;
DELIMITER | 
CREATE PROCEDURE denyRequest (IN id varchar(255), IN friend_id varchar(255)) BEGIN
DELETE FROM friendships
WHERE send_id = friend_id
AND receiver_id = id
AND status = 0;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS setDisplayName;
DELIMITER | 
CREATE PROCEDURE setDisplayName (IN id varchar(255), IN name varchar(45)) BEGIN
UPDATE useraccounts
SET displayName = name
WHERE user_id = id;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS getLocations;
DELIMITER | 
CREATE PROCEDURE getLocations (IN id varchar(255)) BEGIN
SELECT LocationName
FROM locations
WHERE id;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS unlockLocation;
DELIMITER | 
CREATE PROCEDURE unlockLocation (IN id varchar(255), IN LocationName varchar(255)) BEGIN
INSERT INTO locations (user_id, LocationName)
VALUES (id, LocationName);
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS getItems;
DELIMITER | 
CREATE PROCEDURE getItems (IN id varchar(255)) BEGIN
SELECT item_id
FROM items
WHERE user_id = id;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS getAchievements;
DELIMITER | 
CREATE PROCEDURE getAchievements (IN id varchar(255)) BEGIN
SELECT achievement_id, type, points, image
FROM achievements
WHERE user_id = id;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS unlockItem;
DELIMITER | 
CREATE PROCEDURE unlockItem (IN id varchar(255), IN item_id int) BEGIN
INSERT INTO items (user_id, item_id)
VALUES (id, item_id);
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS updateAchievements;
DELIMITER | 
CREATE PROCEDURE updateAchievements (IN id varchar(255), IN achievement_id int, IN type varchar(255), IN achievement_points int, IN image varchar(45)) BEGIN
INSERT INTO achievements (achievement_id, user_id, type, points, image)
VALUES (achievement_id, id, type, achievement_points, image)
ON DUPLICATE KEY
UPDATE points = points + achievement_points;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS updateScore;
DELIMITER | 
CREATE PROCEDURE updateScore (IN id varchar(255), IN points int) BEGIN
UPDATE useraccounts
SET score = score + points
WHERE user_id = id;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS getFriendLeaderboard;
DELIMITER | 
CREATE PROCEDURE getFriendLeaderboard (IN id varchar(255)) BEGIN
SELECT displayName, score
FROM useraccounts
JOIN friendships
ON friendships.send_id = useraccounts.user_id
OR friendships.receiver_id = useraccounts.user_id
WHERE user_id != id
AND status = 1
AND (receiver_id = id OR send_id = id)
AND leaderboardParticipant = 1
ORDER BY score DESC
LIMIT 100;
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS getFriendship;
DELIMITER | 
CREATE PROCEDURE getFriendship (IN id varchar(255), IN friend_id varchar(255)) BEGIN
SELECT *
FROM friendships
WHERE (send_id = id AND receiver_id = friend_id)
OR (send_id = friend_id AND receiver_id = id);
END | 
DELIMITER ;

DROP PROCEDURE IF EXISTS validateAchievement;
DELIMITER | 
CREATE PROCEDURE validateAchievement (IN id INT, IN t varchar(45)) BEGIN
SELECT *
FROM achievementlist
WHERE (achievement_id = id AND type = t);
END | 
DELIMITER ;