ssh -i "management-key.pem" ubuntu@VPS_IP_KEY
2️⃣ Update & Upgrade System
sudo apt update && sudo apt upgrade -y
3️⃣ Install Node.js + npm
sudo apt install nodejs npm -y
node -v
npm -v
4️⃣ Install PM2 (for running Node apps as service)
npm install -g pm2
pm2 -v
5️⃣ Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl status postgresql
6️⃣ Switch to Postgres User
sudo -i -u postgres
psql
\q
exit
7️⃣ Create DB & User (example)
-- inside psql
CREATE DATABASE management_tracker;
CREATE USER tracker_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE management_tracker TO tracker_user;
\q
8️⃣ Git Clone / Pull Project
git clone <repo-url>
cd <project-folder>
git pull
9️⃣ Install Project Dependencies
npm install
🔟 Setup Environment Variables
nano .env
# set DATABASE_URL, PORT, JWT_SECRET etc.
1️⃣1️⃣ Prisma Migrate / Generate
# for dev
npx prisma migrate dev

# for production (apply migrations)
npx prisma migrate deploy

# generate Prisma client
npx prisma generate
1️⃣2️⃣ Start App with PM2
pm2 start src/server.ts --name management-tracker --watch
pm2 restart management-tracker --update-env
pm2 status
pm2 logs management-tracker
1️⃣3️⃣ Optional: Auto Startup on Reboot
pm2 startup
pm2 save