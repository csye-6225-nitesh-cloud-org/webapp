#!/bin/bash

# Update the system
#echo "Updating the system"
#sudo dnf update -y

# Install Node.js
echo "Installing Node.js"
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
sudo dnf install zip -y     

# Verify Node.js and NPM installation
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"



# Install PostgreSQL
echo "Installing PostgreSQL"
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb  
sudo systemctl start postgresql
sudo systemctl enable postgresql
dbSetup=$?
if [ $dbSetup -eq 0 ]; then 
    echo "Installed PostgreSQL Successfully"
else
    echo "PostgreSQL setup failed "
fi

# Configure PostgreSQL
echo "Creating PostgreSQL Database"
sudo -i -u postgres bash <<EOF
createdb $DB_NAME
psql -d $DB_NAME -c "CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';"
psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
EOF

dbConfig=$?
if [ $dbConfig -eq 0 ]; then 
    echo "Database Created Successfully"
else
    echo "Database Creation Failed "
fi


echo "Editing pg_hba.conf"
sudo sed -ri 's/^(host\s+all\s+all\s+127\.0\.0\.1\/32\s+)ident/\1md5/' /var/lib/pgsql/data/pg_hba.conf
sudo sed -ri 's/^(host\s+all\s+all\s+::1\/128\s+)ident/\1md5/' /var/lib/pgsql/data/pg_hba.conf
sudo systemctl restart postgresql

echo "Initial Setup Done"