# Cloud Native Webapp


## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine ([Download Node.js](https://nodejs.org/))
- PostgreSQL installed and running ([Download PostgreSQL](https://www.postgresql.org/))

## Build and Deploy

To build and deploy the web application locally, follow these steps:

1. Clone the repository to your local machine:

   ```
   git clone https://github.com/csye-6225-nitesh-cloud-org/webapp.git
   ```

2. Navigate to the project directory:

   ```
   cd webapp
   ```

3. Install dependencies:

   ```
    npm install
   ```

4. Set up the environment variables:

   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```
   NODE_ENV=Environment
   DB_HOST=DB_HOSTNAME
   DB_PASSWORD=your_db_password
   PORT=8080
   DB_USER=your_db_user
   DB_NAME=your-db-name
   PORT=8080
   HOSTNAME=localhost
   ```

   Replace `your_db_user`, `your_db_password`, and `your-db-name` with your PostgreSQL database credentials.

5. Run the application:

   ```
   npm start
   ```

6. Open your web browser and navigate to `http://localhost:8080` to access the web application.
 
adding lines to test CI