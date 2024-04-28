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

### CI/CD with Custom Image Creation and Rolling Updates 🛠️🔄 
The "webapp" repository boasts robust CI/CD pipelines orchestrated through GitHub Actions. These pipelines aren't just about deploying code; they're about ensuring top-notch quality and reliability through rigorous integration tests. But that's not all! We've turbocharged our deployment process by integrating Packer, guaranteeing rock-solid and reproducible deployments. 

But wait, there's more! 🚀 Our CI/CD process doesn't stop there. It's smart enough to churn out fresh images for every new version of our application automatically. And guess what? It doesn't break a sweat when it comes to rolling out updates. Seamless and efficient, it spins up new instance templates for our Managed Instance Group (MIG), intricately meshing them with a load balancer to ensure traffic flows smoothly. 🌐
