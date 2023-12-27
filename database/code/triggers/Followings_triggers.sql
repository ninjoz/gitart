-- trigger functionality:
--   increasing followers and followings
DELIMITER $$
CREATE TRIGGER insert_update_followers
BEFORE INSERT
ON followings
FOR EACH ROW
BEGIN
 DECLARE er INT; -- follower
 DECLARE ed INT; -- following
    -- er follows ed
 SET er = NEW.follower;
 SET ed =  NEW.following;

 UPDATE users
    SET followers = followers + 1
    WHERE users.user_id = ed;
    
    UPDATE users
    SET followings = followings + 1
    WHERE users.user_id = er;
END$$
DELIMITER ;


-- trigger functionality:
--   decreasing number of followers and followings 
DELIMITER $$
CREATE TRIGGER delete_update_followers
BEFORE DELETE
ON followings
FOR EACH ROW
BEGIN
 DECLARE er INT; -- follower
 DECLARE ed INT; -- following
    -- er follows ed
 SET er = OLD.follower;
 SET ed =  OLD.following;

 UPDATE users
    SET followers = followers - 1
    WHERE users.user_id = ed;
    
    UPDATE users
    SET followings = followings - 1
    WHERE users.user_id = er;
END$$
DELIMITER ;
