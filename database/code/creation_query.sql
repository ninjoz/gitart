DROP DATABASE IF EXISTS GitArt;
CREATE DATABASE IF NOT EXISTS  GitArt;
USE GitArt;
CREATE TABLE IF NOT EXISTS Users( user_id INT AUTO_INCREMENT, 
				  user_name VARCHAR(30) NOT NULL UNIQUE, 
				  email VARCHAR(50) NOT NULL UNIQUE, 
				  account_type ENUM("customer", "artist") NOT NULL,
				  gender ENUM("male", "female") NOT NULL, 
				  profile_photo VARCHAR(20) NOT NULL DEFAULT "customer_default.jpg", 
				  cover_photo VARCHAR(20) NOT NULL DEFAULT "cover_default.jpg", 
				  bio VARCHAR(255), 
				  password VARCHAR(255) NOT NULL, 
				  joining_date TIMESTAMP NOT NULL,
				  birth_date TIMESTAMP,
				  followers INT DEFAULT 0,
				  followings INT DEFAULT 0,
				  favorited INT DEFAULT 0,
				  PRIMARY KEY(user_id)
);				  

CREATE TABLE IF NOT EXISTS Designs( design_id INT AUTO_INCREMENT, 
								    user_id INT, 
								    design_price DECIMAL(6,2) NOT NULL, 
									description VARCHAR(10000), 
									posting_date TIMESTAMP NOT NULL, 
									design_title VARCHAR(600) NOT NULL, 
									design_path VARCHAR(100) NOT NULL,
									design_likes INT DEFAULT 0,
									design_privacy ENUM("Public", "Private") DEFAULT "Public",
									design_source ENUM("local", "API") DEFAULT "local",
									PRIMARY KEY(design_id),
									FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Categories( design_id INT, 
									   tags VARCHAR(50),
									   FOREIGN KEY (design_id) REFERENCES Designs(design_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Orders( order_id INT AUTO_INCREMENT, 
								   user_id INT, 
								   order_date TIMESTAMP NOT NULL,
								   order_status ENUM("Pending","Processing","Shipped","Delivered") NOT NULL DEFAULT "Processing",
								   total_price DECIMAL(6, 2) DEFAULT 0,
								   shipment_date TIMESTAMP,
								   delivering_date TIMESTAMP,
								   code INT,
								   PRIMARY KEY(order_id),
								   FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
								   CHECK (order_status <> 'Shipped' OR (order_status = 'Shipped' AND shipment_date IS NOT NULL)),
								   CHECK (order_status <> 'Delivered' OR (order_status = 'Delivered' AND delivering_date IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS Payment( transaction_id INT AUTO_INCREMENT,
									order_id INT, 
                                    payment_method ENUM('Visa', 'Mastercard', 'PayPal', 'InstaPay', 'Vodafone Cash') NOT NULL,
                                    transaction_date TIMESTAMP NOT NULL,
                                    PRIMARY KEY(transaction_id),
                                    FOREIGN KEY(order_id) REFERENCES Orders(order_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS SearchHistory( search_id INT AUTO_INCREMENT,
										  user_id INT NOT NULL,										  
										  search_prompt VARCHAR(100) NOT NULL,
                                          search_date TIMESTAMP NOT NULL,
                                          PRIMARY KEY(search_id),
                                          FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Favorites( design_id INT, 
									  user_id INT,
                                      PRIMARY KEY(design_id, user_id),
                                      FOREIGN KEY(design_id) REFERENCES Designs(design_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                      FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Followings( follower INT, 
									   following INT,
									   FOREIGN KEY(follower) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
									   FOREIGN KEY(following) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
									   PRIMARY KEY(follower, following)
);

CREATE TABLE IF NOT EXISTS Templates( template_id INT AUTO_INCREMENT, 
									  template_name VARCHAR(30) NOT NULL UNIQUE,
									  template_before VARCHAR(30) NOT NULL UNIQUE,
									  template_after VARCHAR(30) NOT NULL UNIQUE,
									  purchase_price DECIMAL NOT NULL,
									  selling_price DECIMAL NOT NULL,
									  in_stock INT NOT NULL, 
									  PRIMARY KEY(template_id)
);

CREATE TABLE IF NOT EXISTS FinalProduct( fp_id INT AUTO_INCREMENT, 
										 design_id INT NOT NULL,
										 template_id INT NOT NULL, 
                                         fp_price DECIMAL(6, 2) DEFAULT 0,
										 size INT DEFAULT 100,
										 PRIMARY KEY(fp_id),
										 FOREIGN KEY(design_id) REFERENCES Designs(design_id) ON DELETE CASCADE ON UPDATE CASCADE,
										 FOREIGN KEY(template_id) REFERENCES Templates(template_id) ON DELETE CASCADE ON UPDATE CASCADE				
);

CREATE TABLE IF NOT EXISTS OrderLine( orderline_id INT AUTO_INCREMENT,
									  order_id INT NOT NULL, 
									  fp_id INT, 
                                      quantity INT DEFAULT 1, 
                                      sub_total DECIMAL(6, 2) DEFAULT 0,
									  missed_quantity INT DEFAULT 0,
									  PRIMARY KEY(orderline_id),
									  FOREIGN KEY(order_id) REFERENCES Orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
									  FOREIGN KEY(fp_id) REFERENCES FinalProduct(fp_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Reviews( review_id INT AUTO_INCREMENT, 
									user_id INT NOT NULL,
                                    fp_id INT NOT NULL,
									review_date TIMESTAMP NOT NULL, 
                                    review_text VARCHAR(350) NOT NULL,
									PRIMARY KEY(review_id),
									FOREIGN KEY (user_id) REFERENCES  Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
									FOREIGN KEY (fp_id ) REFERENCES FinalProduct(fp_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS CartItem( user_id INT NOT NULL, 
									 fp_id INT NOT NULL, 
                                     fp_adding_date TIMESTAMP NOT NULL,
									 quantity INT DEFAULT 1,
									 PRIMARY KEY(user_id, fp_id),
									 FOREIGN KEY (user_id ) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
									 FOREIGN KEY (fp_id ) REFERENCES FinalProduct(fp_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS PostalCodes( order_id INT NOT NULL,
                                       postal_code VARCHAR(50) NOT NULL,
                                       PRIMARY KEY(order_id),
                                       FOREIGN KEY(order_id) REFERENCES Orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE
);
