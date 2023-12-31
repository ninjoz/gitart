--- 
Title: GitArt High-level Design
Geometry: a4paper, margin=2.5cm
---

 # $${\color{lightgreen}GitArt \space High-Level \space Design}$$



## ${\color{lightgreen}Table \space of \space Contents}$

- [GitArt High-Level Design](#gitart-high-level-design)
    - [Table of Contents](#table-of-contents)
    - [1. Introduction](#GitArt-is-an-online)
    - [2. System Architecture](#2-system-architecture)
        - [Frontend Layer](#frontend-layer)
        - [Database Basic Design](#database-basic-design)
		- [Backend Layer](#backend-layer)
    - [3. Data Storage and Management](#3-data-storage-and-management)
    - [4. Conclusion](#4-conclusion)

## ${\color{lightgreen}1. \space Introduction}$

GitArt is an online marketplace for print-on-demand products based on user-submitted artwork. This high-level design document introduces the architecture GitArt, focusing on the high-level system design. Our goal is to reproduce the functionalities of the popular website, Redbubble.

## ${\color{lightgreen}2. \space System \space Architecture}$

GitArt website follows a client-server architecture. The three main layers of the system architecture are: the frontend layer, the backend layer, and the database layer, interacting together to deliver an immpressive user experience.

### ${\color{lightgreen}Frontend \space Layer}$

Our frontend design is all about creating a user-friendly and good-looking experience. We've used HTML, CSS, and JavaScript to build a system that's easy to navigate, looks great on different devices, and works smoothly. We've connected the frontend with the backend and other services securely, making sure data is exchanged reliably.
- `HTML` : 
	- used to structure content in our project.
- `CSS` :
	- used for styling and presentation in project.
	- used to control layout of elements in the different pages.
	- used to set color scheme and fontsyles.
- `JavaScript` :
	- used to add some interactivity and dynamic behavior to website.
	- used for making forms' validation (ensuring that required fields are filled out correctly before being submitted to server.
	- helped in user interactions (such as clicking buttons.)

#### ${\color{lightgreen}Pages \space Details}$

The user is greeted with a *welcome page* which gives them options to login or register if they are new to the website. Our *home page* has many options to help browse the products, user can search for products, filter by type of product, view new products from artists they follow and view favorite designs. The *profile page* is there to display artworks of artists for others to view. Here the user can change their profile and cover photos and remove designs from their own portfolio. Customer designs are set to private and no one can view them. *Product details*, *design details* are pages to display more information about each one. The user can access them by clicking on a product or a design. The *upload page* is the page where artists and customers can upload their designs, enter their details, and select which products to get displayed on. Customer designs are set to private. The *cart page* contains all the products user has added to their cart. It gives the total and the user has an option to proceed to checkout where they can confirm the order. The *orders page* contians all the orders the user has placed and details about them. Here they can confirm that an order has reached him. The website comes with an *admin panel*, only admins are allowed to view. The panel contains sections for stock management, order processing and viewing important numbers of the website.

### ${\color{lightgreen}Database \space Basic \space Design}$

```mermaid
erDiagram

Users ||--o{ Designs: "has"
Orders }o--|{ FinalProduct: "contains"
Users ||--o{ Orders: "can make"
Designs ||--|{ FinalProduct: "has"
Designs }|--|{ Categories: "belongs to"
FinalProduct }o--|| Templates: "has"
```
The database stores information such as user profiles, designs details, procuts details,authentication credentials and order logs.

### ${\color{lightgreen}Backend \space Layer}$

The backend of our full-stack project serves as the backbone, responsible for handling data processing, business logic, and ensuring communication between the user interface and the server. In our project, we used several backend technologies employed to create a robust and efficient backend infrastructure.

- `Node.js` : 
	- A Javascript runtime environment that powers server-side JavaScript for scalable and speedy applications, handling multiple requests without delays.

- `Express.js` :
	- A NodeJs framework that streamlines the process of handling routes, middleware, and HTTP requests with finesse. 

- `AJAX` : 
	- Improves user experience by fetching and updating data without refreshing the entire page. In Node.js, AJAX enhances data retrieval and updates, making web applications more responsive and efficient.
   
- `EJS` : 
	- A template engine to embed JavaScript directly into HTML enhances the development process. This not only simplifies our code but also boosts efficiency by consolidating logic and presentation in a single file.
 
- `bcrypt` : 
	- A library for NodeJs that boosts security by safely encrypting passwords. Its advanced hashing defends against potential threats, ensuring user credentials remain protected.

## ${\color{lightgreen}3. \space Data \space Storage \space and \space Management}$

Our project utilizes MySQL as the Relational Database Management System (RDBMS) for data storage. The database is designed to capture and organize various aspects of the GitArt website, including user information, product details, and order transactions.

#### ${\color{lightgreen}Database \space Schema}$

The database schema is organized into multiple tables to represent different entities within the system. Key entities include `Users`, `Products`, `Orders`, and `Categories` , etc. Relationships between tables are defined to maintain data integrity and support efficient querying.

![Database Schema](./images/eer.png)

#### ${\color{lightgreen}Business \space Rules}$
 
- A User may add many Designs. Each Design must be added by exactly one User.
- A User may have many CartItem-s. Each CartItem must belong to only one User.
- A User may order many Orders. Each Order must be ordered by exactly one User.
- A User may like many Favorites. A Favorited design must be liked by one or more Users.
- A User may make many Payments. A Payment must be made by exactly one User.
- A User may have many SearchHistory lines. A SearchHistory line must belong to one User.
- A User may follow many Followings. Each Following must be followed by at least one User.
- An Order may contain many OrderLine-s, each OrderLine must exist in exactly one Order.
- Each FinalProduct has exactly one Template, each Template may be used in many FinalProducts.
- Each Design may be printed on many FinalProducts, each FinalProduct must have only one Design.
- Each Design must belong to at least one Category, each Category must have at least one Design.

#### ${\color{lightgreen}Data \space Sources}$
We used the public API of the Art Institute of Chicago as the main source for artworks. The API contains artwork images, titles and other data we scrapped and used in this project. You can find more information about the API [here](https://api.artic.edu/docs/#introduction).

We used a simple [scraper](data_processing/data_scraper.js) to extract titles, image codes, descriptions of the artworks and search tags from the [data dump](https://github.com/art-institute-of-chicago/api-data/tree/master). The scraper basically reads JSON files one by one, then writes extracted attributes to a file. For example, this is a [file](data_processing/image_codes.txt) containing a sample of images codes scraped.

After that, the content of these files is formatted to sql insertion statements in a [spreadsheet](https://docs.google.com/spreadsheets/d/1gUla3A6qMdjd78JRPIcwKTgs9-XzYs1CV3SpVdhZuoM/edit?usp=drive_link), then inserted in our database.

The image codes scraped are used to get direct [IIIF URLs](https://iiif.io/api/image/2.0/) to the artwork images.\
for example, an image with the code: `8307059e-a394-4329-04ee-9158c09b0cc7`\
can be accessed using this IIIF URL: https://www.artic.edu/iiif/2/8307059e-a394-4329-04ee-9158c09b0cc7/full/400,/0/default.jpg \
*notice that the URL contains the code, so we can change the image displayed by just changing the code\

Then we used these URLs to display images in our HTML pages.


Also, some of the artworks used in this project are made by artists in our team. The rest of them are random artworks we found on pinterest. 


## ${\color{lightgreen}4. \space Conclusion}$

The high-level design of GitArt highlights the system architecture, including the frontend, backend, and database layers. It emphasizes the use of JavaScript, Express.js, Node.js, and MySQL to create a scalable and robust web application. We also showed data storage and management strategies optimizing data retrieval and manipulation.
