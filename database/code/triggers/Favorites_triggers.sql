-- trigger functionality:
--   increasing number of Users.favorited and Designs.design_likes attributes
DELIMITER $$
CREATE TRIGGER update_design_likes_and_favorited
AFTER INSERT
ON Favorites FOR EACH ROW
	BEGIN
		DECLARE artist_id INT;
        SELECT user_id INTO artist_id from Designs where Designs.design_id = NEW.design_id;
		UPDATE Designs SET design_likes = design_likes + 1 where Designs.design_id = NEW.design_id;
        UPDATE Users SET favorited = favorited + 1 where user_id = artist_id;
	END $$
DELIMITER ;


-- trigger functionality:
--   decreasing number of Users.favorited and Designs.design_likes attributes
DELIMITER $$
CREATE TRIGGER delete_design_likes_and_favorited
BEFORE DELETE
ON Favorites FOR EACH ROW
	BEGIN
		DECLARE artist_id INT;
        SELECT user_id INTO artist_id from Designs where Designs.design_id = OLD.design_id;
		UPDATE Designs SET design_likes = design_likes - 1 where Designs.design_id = OLD.design_id;
        UPDATE Users SET favorited = favorited - 1 where user_id = artist_id;
	END $$
DELIMITER ;
