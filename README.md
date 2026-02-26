# Management Tracker - VPS Setup & Deployment Guide

এই গাইডটি AWS VPS বা অন্য Linux সার্ভারে Node.js + PostgreSQL প্রজেক্ট deploy করার জন্য।

---

## 1️⃣ SSH Access

```bash
ssh -i "management-key.pem" ubuntu@VPS_IP
```

---

## 2️⃣ Update & Upgrade System

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 3️⃣ Install Node.js & npm

```bash
sudo apt install nodejs npm -y
node -v
npm -v
```

---

## 4️⃣ Install PM2 (for running Node apps as service)

```bash
npm install -g pm2
pm2 -v
```

---

## 5️⃣ Install PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl status postgresql
```

---

## 6️⃣ Switch to Postgres User

```bash
sudo -i -u postgres
psql
\q
exit
```

---

## 7️⃣ Create Database & User

Inside `psql` shell:

```sql
CREATE DATABASE management_tracker;
CREATE USER tracker_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE management_tracker TO tracker_user;
\q
```

---

## 8️⃣ Git Clone / Pull Project

```bash
git clone <repository_url>
cd <project_directory>
git pull
```

---

## 9️⃣ Install Project Dependencies

```bash
npm install
```

---

## 🔟 Setup Environment Variables

```bash
nano .env
```

Set your variables like:

```
DATABASE_URL=postgresql://tracker_user:your_password@localhost:5432/management_tracker
PORT=5000
JWT_SECRET=your_jwt_secret
```

---

## 1️⃣1️⃣ Prisma Migrate / Generate

### For Development

```bash
npx prisma migrate dev
```

### For Production (Apply Migrations)

```bash
npx prisma migrate deploy
```

### Generate Prisma Client

```bash
npx prisma generate
```

---

## 1️⃣2️⃣ Start App with PM2

```bash
pm2 start src/server.ts --name management-tracker --watch
pm2 restart management-tracker --update-env
pm2 status
pm2 logs management-tracker
```

---

## 1️⃣3️⃣ Optional: Auto Startup on Reboot

```bash
pm2 startup
pm2 save
```

---

✅ এভাবে তোমার Node.js + PostgreSQL প্রজেক্ট VPS-এ deploy করা হবে।
