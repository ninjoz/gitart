-- trigger functionality:
--   updating OrderLine.missed_quantity after restocking the out-of-stock-template, then updating in_stock again 
DELIMITER $$
CREATE TRIGGER before_template_update
BEFORE UPDATE
ON Templates FOR EACH ROW
BEGIN
    DECLARE restocked_template_id INT;
    DECLARE missed_q INT;   -- missed quantity before updating it to its new quantity
    DECLARE restock_amount INT; -- store the amount of the restock

    IF NEW.in_stock <> OLD.in_stock AND NEW.in_stock IS NOT NULL THEN
        SET restocked_template_id = NEW.template_id;
        SET restock_amount = NEW.in_stock - COALESCE(OLD.in_stock, 0); -- 10-0
        
        SELECT SUM(ol.missed_quantity) INTO missed_q FROM orderline ol JOIN FinalProduct fp ON ol.fp_id = fp.fp_id
        WHERE
            fp.template_id = restocked_template_id
            AND ol.missed_quantity > 0;

        UPDATE OrderLine ol
        JOIN FinalProduct fp ON ol.fp_id = fp.fp_id
        JOIN Templates t ON fp.template_id = t.template_id
        SET
            ol.missed_quantity = GREATEST(0, ol.missed_quantity - restock_amount)
        WHERE
            fp.template_id = restocked_template_id
            AND ol.missed_quantity > 0;

        SET NEW.in_stock = restock_amount - missed_q;
    END IF;
END $$
DELIMITER ;
