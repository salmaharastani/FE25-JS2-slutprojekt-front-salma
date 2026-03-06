# Scrum Board Frontend

Detta är frontend-applikationen för Scrum Board projektet. Den är byggd med React och kommunicerar med backend via ett REST API.

## Installation

1. Klona projektet

git clone https://github.com/salmaharastani/FE25-JS2-slutprojekt-front-salma.git

2. Gå in i projektmappen

cd frontend

3. Installera dependencies

npm install

## Starta utvecklingsserver

npm run dev

Frontend startar på:

http://localhost:5173

## Funktioner

Applikationen fungerar som en Scrum board där användaren kan:

* skapa tasks
* se tasks i tre kolumner (New, Ongoing, Done)
* flytta tasks mellan status
* tilldela tasks till medlemmar
* ta bort tasks

Frontend kommunicerar med backend via fetch-anrop till API:t.
