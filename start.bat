@echo off
title NW-Discordbot

echo Press any key to start the server
pause > nul
CLS

echo Starting
call docker compose up -d
call npm install
call docker exec -it postgres psql -U postgres -c "CREATE USER nwbot WITH PASSWORD 'PASSWORD' CREATEDB;"
call npx prisma migrate dev
call node ./src/deployCommands.js
call node ./src/main.js