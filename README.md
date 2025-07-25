 Phishing Simulation & Management Backend

This project provides a backend service for simulating phishing attacks and managing phishing attempts as part of a cybersecurity awareness application. It includes:

Phishing Simulation Service** (sending mock phishing emails and tracking clicks) Phishing Management Service** (authentication and login)

Tech Stack

Backend Framework: [NestJS] Database:** MongoDB Email Sending: Nodemailer (SMTP) Containerization:Docker (for MongoDB)

 
 How to run:
 **pay attention to be on master**

1.Install dependencies:
npm install

2. go to folder 
\phishing-simulation\phishing-simulation
run  npm run start:management
run  npm run start:simulation 
 
 management will run on 3001 and simulation on 3002


To run MongoDB locally with Docker, use the following command

docker run -d -p 27017:27017 --name mongo mongo


How to run using dockers: 
\phishing-simulation\phishing-simulation - go to this folder of the project 
run: docker-compose up --build

wait 3 minutes until its stable

 How to get application password to your gmail:

 How to Fix It
Step 1: Enable 2-Step Verification
If not already enabled:

Go to https://myaccount.google.com/security

Turn on 2-Step Verification

Step 2: Generate App Password
After enabling 2FA, go to https://myaccount.google.com/apppasswords

Sign in if prompted.

Under "Select app", choose Mail.

Under "Select device", choose Other and enter Nodemailer (or whatever name helps you remember).

Click Generate

Copy the 16-character password (it looks like: abcd efgh ijkl mnop)
