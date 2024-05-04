README

To initialize the program:

1. Open MySQL and run schema.sql to create the database
2. Open VSCode and go to pos system folder
3. Open terminal and run npm init -y
4. Then run npm i express cors mysql2 ejs
5. Then run npm install --save-dev nodemon
6. Open package.json, and enter these two under Scripts:
	"start": "node server.js",
    	"dev": "npx nodemon server.js"
7. Update your mysql password on database.js
8. On Terminal, enter npm run dev
9. On browser, go to localhost:8080
