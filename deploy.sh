#!/usr/bin/env bash
ssh clint@zerobeta.me << EOF
exec ssh-agent bash
ssh-add /home/clint/.ssh/id_rsa.pub
cd /home/clint/twinder/tmp
echo "Cloning repository..."
git clone git@github:clint42/yn.git twinder
cd twinder
git checkout feature/21
echo "NPM Install"
npm install
echo "Cleaning old deployement"
rm -fr /home/clint/twinder/deploy/api
echo "Moving files..."
mkdir /home/clint/twinder/deploy/api
mv /home/clint/twinder/tmp/yn/api/* /home/clint/twinder/deploy/api
echo "Removing temporary files..."
rm -fr /home/clint/twinder/tmp/twinder
echo "Start application using PM2"
cd /home/clint/twinder/deploy/api/
NODE_ENV=production NODE_PORT=3001 pm2 start bin/www -i max
pm2 list
echo "Done"
EOF
