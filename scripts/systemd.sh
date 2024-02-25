#!/bin/bash

echo "Systemd Setup Started."
# Copy the service file to systemd directory
sudo cp /tmp/webapp.service /etc/systemd/system/webapp.service

# Reload the systemd daemon to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on boot
echo "Enable webapp service"

# Set SELinux to disabled to access env file
sudo sed -i 's/^SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
sudo sed -i 's/^SELINUX=permissive/SELINUX=disabled/g' /etc/selinux/config
sudo setenforce 0

sudo systemctl enable webapp.service

echo "Systemd service is set up and enabled."