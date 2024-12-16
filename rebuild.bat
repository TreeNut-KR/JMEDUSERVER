@echo off
chcp 65001
SETLOCAL

echo Docker Compose off...
docker-compose down -v
echo.

echo docker images remove...
FOR /F "tokens=1" %%i IN ('docker images -q --filter "dangling=false"') DO (
    docker rmi %%i
)
echo.

echo folder remove...
rmdir /s /q .\aligo\logs
rmdir /s /q .\aligo\__pycache__
rmdir /s /q .\aligo\source\utils\__pycache__
rmdir /s /q .\mysql\data
rmdir /s /q .\mysql\logs
echo.

echo Docker Compose on...
docker-compose up
ENDLOCAL