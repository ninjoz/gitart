-- trigger functionality:
--   inserting final product price
DELIMITER $$ 
CREATE TRIGGER fp_price_update
BEFORE INSERT
ON FinalProduct FOR EACH ROW
	BEGIN
		DECLARE template_p DECIMAL;
        DECLARE design_p DECIMAL;
        SELECT selling_price INTO template_p FROM Templates WHERE Templates.template_id = NEW.template_id;
        SELECT design_price INTO design_p FROM Designs WHERE Designs.design_id = NEW.design_id;
		SET NEW.fp_price = template_p + design_p;
	END $$
DELIMITER ;


-- trigger functionality:
--   setting default value to sticker's size
DELIMITER $$
CREATE TRIGGER before_insert_sticker_finalproduct
BEFORE INSERT
ON FinalProduct FOR EACH ROW
BEGIN 
	IF NEW.template_id = 7 THEN 
		SET NEW.size = 20;
	END IF;
END $$
DELIMITER ;

