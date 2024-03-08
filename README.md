# Cloud Native Webapp 🌐

## Prerequisites 📋

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine ([Download Node.js](https://nodejs.org/)) 📥
- PostgreSQL installed and running ([Download PostgreSQL](https://www.postgresql.org/)) 🐘

## Build and Deploy 🚀

To build and deploy the web application locally, follow these steps:

1. **Clone the Repository:** Clone the repository to your local machine:
   ```
   git clone https://github.com/csye-6225-nitesh-cloud-org/webapp.git
   ```

2. **Navigate to the Project Directory:**
   ```
   cd webapp
   ```

3. **Install Dependencies:**
   ```
   npm install
   ```

4. **Set Up Environment Variables:** Create a `.env` file in the root directory and configure it as follows:
   ```
   NODE_ENV=Environment
   DB_HOST=DB_HOSTNAME
   DB_PASSWORD=your_db_password
   PORT=8080
   DB_USER=your_db_user
   DB_NAME=your-db-name
   HOSTNAME=localhost
   ```
   Replace the placeholders with your PostgreSQL credentials.

5. **Run the Application:**
   ```
   npm start
   ```

6. **Access the Web Application:** Open your browser and navigate to `http://localhost:8080`.

# Packer Configuration 📦

Packer is used for creating machine images from a single source configuration. It helps in creating immutable infrastructure, ensuring consistency and reliability in the deployment process.

## Prerequisites 📋
Ensure you have a `.pkrvars` file for Packer variables. For reference, check `example.pkrvars`.

## Useful Packer Commands 🛠️

- **Initialize Packer Configuration:**
  ```shell
  packer init .
  ```
- **Format and Validate the Configuration:**
  ```shell
  packer fmt --var-file=gcp.pkrvars.hcl gcp.pkr.hcl
  ```
- **Validate the Configuration:**
  ```shell
  packer validate --var-file=gcp.pkrvars.hcl gcp.pkr.hcl
  ```
- **Build the Image:**
  ```shell
  packer build --var-file=gcp.pkrvars.hcl gcp.pkr.hcl
  ```
  