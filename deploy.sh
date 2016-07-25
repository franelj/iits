#!/usr/bin/env bash

if [ $# -lt 1  ]; then
    branch='master'
else
	branch=$1
fi

ssh clint@zerobeta.me << EOF
exec ssh-agent bash
ssh-add /home/clint/.ssh/iits_deploy_rsa	
cd /home/clint/twinder/tmp
echo "Cloning repository..."
git clone git@github:franelj/iits.git twinder
cd twinder
git checkout $branch
echo "NPM Install"
npm install
echo "Cleaning old deployement"
rm -fr /home/clint/twinder/deploy/
echo "Moving files..."
mkdir /home/clint/twinder/deploy/
mv /home/clint/twinder/tmp/twinder/* /home/clint/twinder/deploy/
echo "Removing temporary files..."
rm -fr /home/clint/twinder/tmp/twinder
echo "Start application using PM2"
cd /home/clint/twinder/deploy/
NODE_ENV=production NODE_PORT=3001 pm2 start bin/www -i max
pm2 list
echo "Done"
EOF
