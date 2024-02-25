#!/bin/bash

# Update the system
echo "Updating the system"
sudo dnf update -y

# Install Node.js
echo "Installing Node.js"
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
sudo dnf install zip -y     

# Verify Node.js and NPM installation
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

echo "Initial Setup Done"