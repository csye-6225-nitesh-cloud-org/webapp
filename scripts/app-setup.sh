#!/bin/bash

echo "Starting application setup..."
echo "Creating the application directory and adjusting permissions"
sudo mkdir -p /home/csye6225

# Copy the application files
echo "Copying the application files"
sudo cp /tmp/webapp.zip /home/csye6225/webapp.zip

# Navigate to the application directory
echo "Navigating to the application directory"
cd /home/csye6225/

# Unzip the application files
echo "Unzipping the application files"
sudo unzip webapp.zip -d /home/csye6225/webapp

echo "Changing Permissions"
sudo chown -R csye6225:csye6225 /home/csye6225/webapp
sudo chmod 500 /home/csye6225/webapp/server.js

# Remove the zip file
echo "Removing the zip file"
sudo rm -f webapp.zip

# Install Node.js dependencies
echo "Installing Node.js dependencies."
cd /home/csye6225/webapp
sudo npm install

echo "Node.js application setup complete."