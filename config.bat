:mongod
START /min A:\Mongo\bin\mongod.exe --dbpath C:\Users\Nam\Desktop\ChototVL(v.22)\ChototVL(v.2)\Models
start /d :mongod
start "" "%PROGRAMFILES%\Git\bin\sh.exe" --login
ping 127.0.0.1 -n 3
start /d :mongo
:mongo
START /min A:\Mongo\bin\mongo.exe
