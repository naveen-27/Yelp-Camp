# Yelp-Camp
  
Yelp Camp is a campground reviewing app where the owners can post their campgrounds for reviewing <br>
from the users of the app. This full stack application is made as a part of the <br>
Web Developer Bootcamp course by Colt Steele.

### Features:
<hr>

1. Users(without authentication) have access to all campgrounds published with all info avaliable to them.
2. Users(with authentication) can post their campground reviews and add campgrounds.
3. Create, Read, Update, Delete (CRUD) is availabe for the below mentioned:
    1. Campgrounds
    2. Users
    3. Comments
4. Session of users logged in will be maintained for seemless usability.
5. Custom written middleware takes care of illegal access of privately owned data/permissions <br>
   by the user so that only ***Authenticated and Authorised Users*** have access to them.
6. Seaching Campgrounds by fizzy search.

### Tech Stack:
<hr>

#### Front-end:
- HTML5
- CSS3
- Vannila JavaScript

#### Back-end:
- Node.js
- Express.js
- MongoDB
- Passport.js

#### API's:
- Google Maps Embed API

### Run Locally:

Install MongoDB and Node.js locally on your machine.
```
git clone https://github.com/naveen-27/Yelp-Camp.git
cd Yelp-Camp
npm install
```
Then run ```mongod``` and ```node index.js``` in seperate terminals. <br>
Go to localhost:3000
