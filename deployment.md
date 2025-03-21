# Deployment

- Sign up on AWS
- Create a new EC2 instance
- Launch the instance
- Go to download folder in git bash
- chmod 400 <SECRET>.pemp
- Connect with machine with ssh command (ssh -i "codershub-secrete.pem" ubuntu@ec2-54-165-210-112.compute-1.amazonaws.com)

- for logged out from the machine : exit

- install node js 
- git clone client-project on machine 
- git clone server-project on machine
- go to client-project folder
- npm install
- npm run build
- sudo apt update
- sudo apt install nginx
- sudo systemctl start nginx
- sudo systemctl enable nginx
- copy code from dist folder to var/www/html
 -- sudo scp -r dist/* /var/www/html
 - Enable port 80 of your instance


 -## back end
 -- cd server-project
 -- npm install
 - allowed ec2 instance public IP on mongoDb server
 - npm install pm2 -g
 - pm2 start npm -- start
 - pm2 logs
 - pm2 list, pm2 fulsh <name>
 - pm2 stop <name>
 - pm2 delete <name>
 - pm2 start --name <coders-hub-server> npm -- start


 cofing nginx - sudo /etc/nginx/sites-available/default
 ser
 location /api/ {
        proxy_pass http://localhost:7777/;  # Pass the request to the Node.js app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    server restart


Clent = http://54.165.210.112/
Server = http://54.165.210.112:3000

Domain name = coders-hub.com => 54.165.210.112

Client = coders-hub.com
Sever = coders-hub.com:3000 => coders-hub.com/api

