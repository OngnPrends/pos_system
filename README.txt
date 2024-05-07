README

REQUIREMENTS:
- VS Code, or any code editor
- MySQL workbench or any SQL database design tool

TO CREATE THE SYSTEM:

- Copy or download all folders. NOTE: Keep the folder structure to avoid errors in calling the functions.
- Open MySQL workbench or your SQL database design tool
- Copy all the content of schema.sql. Then paste it on its terminal.
- Open VS Code.
- Go to the folder where you save all the files. Then do the following:

	1. Open the terminal and run: npm init -y
	2. Then run: npm i express cors mysql2 ejs
	3. Afterward, run this command: npm install --save-dev nodemon
	4. Open package.json, and enter these two under Scripts:
		"start": "node server.js",
	    	"dev": "npx nodemon server.js"
	5. Open database.js
	6. Make sure to update the host, user, password, and database base in your MySQL database.
	7. On Terminal, enter npm run dev. (You should see "Server listening on port 8080" on console)
	8. On browser, go to localhost:8080
