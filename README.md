Phishing Simulation & Management Backend

This project provides a backend service for simulating phishing attacks and managing phishing attempts as part of a cybersecurity awareness application. It includes:

Phishing Simulation Service** (sending mock phishing emails and tracking clicks)
Phishing Management Service** (authentication and login)

---

Tech Stack

Backend Framework: [NestJS]
Database:** MongoDB
Email Sending: Nodemailer (SMTP)
Containerization:Docker (for MongoDB)

---

Environment Variables

You must create a `.env` file in the root of the project before running the app. It should include the following:

```env
MONGO_URI=mongodb://localhost:27017/phishing-db
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password

How to run:
Install dependencies:
npm install

open 2 teminals:
1. go to phising-management and type:
npx ts-node main.ts - it will run on 3001 port
2. go to phising-simulation and type:
npx ts-node main.ts - it will run on 3002 port

To run MongoDB locally with Docker, use the following command

docker run -d -p 27017:27017 --name mongo mongo

