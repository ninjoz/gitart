-- trigger functionality:
--   setting default value to artist's profile_photo
DELIMITER $$
CREATE TRIGGER before_insert_artists
BEFORE INSERT 
ON Users FOR EACH ROW
BEGIN
    IF NEW.account_type = 'artist' THEN
        SET NEW.profile_photo = 'artist_default.jpg';
    END IF;
END $$
DELIMITER ;

