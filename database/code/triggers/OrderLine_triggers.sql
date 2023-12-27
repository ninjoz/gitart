-- trigger functionality:
--   setting sub_total attribute, updating templates.in_stock and Orders.order_status attributes after comparing with quantity
DELIMITER $$
CREATE TRIGGER update_order_line
BEFORE INSERT
ON OrderLine FOR EACH ROW
BEGIN
    DECLARE stock INT;
    DECLARE price DECIMAL;

    SELECT fp_price INTO price FROM FinalProduct WHERE FinalProduct.fp_id = NEW.fp_id;
    SET NEW.sub_total = NEW.quantity * price;

    SELECT t.in_stock INTO stock
    FROM Templates t
    JOIN FinalProduct fp ON t.template_id = fp.template_id
    WHERE fp.fp_id = NEW.fp_id;

    IF stock >= NEW.quantity THEN
        UPDATE Templates SET in_stock = in_stock - NEW.quantity
        WHERE template_id = (SELECT template_id FROM FinalProduct WHERE fp_id = NEW.fp_id);
    ELSE
        UPDATE Templates SET in_stock = 0
        WHERE template_id = (SELECT template_id FROM FinalProduct WHERE fp_id = NEW.fp_id);
        SET NEW.missed_quantity = NEW.quantity - stock;
        UPDATE Orders SET order_status = 'Pending' WHERE Orders.order_id = NEW.order_id;
    END IF;
END $$
DELIMITER ;


-- trigger functionality:
--   deleting from cartitem after inserting into orderline, setting Orders.total_price attribute
DELIMITER $$
CREATE TRIGGER delete_cart_item
BEFORE INSERT 
ON OrderLine FOR EACH ROW
    BEGIN
        DECLARE cart_quantity INT;
        DECLARE userid INT;
        SELECT user_id INTO userid FROM Orders WHERE Orders.order_id = NEW.order_id;
        
        SELECT quantity INTO cart_quantity FROM CartItem WHERE user_id = userid AND fp_id = NEW.fp_id;
        
        SET NEW.quantity = cart_quantity;
        
        DELETE FROM CartItem WHERE user_id = userid AND fp_id = NEW.fp_id;
        
        UPDATE Orders SET total_price = total_price + NEW.sub_total WHERE Orders.order_id = NEW.order_id;
    END $$
DELIMITER ;


-- trigger functionality:
--   checking if a pending order must be in the processing status if there's no missed_quantity on it all 
DELIMITER $$
CREATE TRIGGER after_orderline_update
AFTER UPDATE
ON OrderLine FOR EACH ROW
BEGIN
    DECLARE order_id_to_update INT;

    SELECT order_id INTO order_id_to_update
    FROM Orders
    WHERE Orders.order_id = NEW.order_id;

    IF (SELECT COUNT(*) FROM OrderLine WHERE order_id = order_id_to_update AND missed_quantity > 0) = 0 THEN
        UPDATE Orders
        SET order_status = 'Processing'
        WHERE Orders.order_id = order_id_to_update AND Orders.order_status = 'Pending';
    END IF;
END $$
DELIMITER ;
