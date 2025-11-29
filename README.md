A backend API that reads CSV files from a configurable location, converts dot-notation fields into nested JSON, and inserts structured data into PostgreSQL — using fully custom parsing logic (no CSV libraries).

Setup -
npm install
Setup environment variables
CSV_PATH=./data/users.csv
DB_HOST=localhost
DB_USER=postgres
DB_PASS={Enter local password}
DB_NAME=testdb
DB_PORT=5432

Setup PostgreSQL Database
Run the API
Completion of the setup and then open the terminal to start the server.
Command to start the server - npm start
http://localhost:3000/process
