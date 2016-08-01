#!/usr/bin/env bash

if [ $# -lt 1  ]; then
    branch='master'
else
	branch=$1
fi

if [ $# -lt 2 ]; then
	updateDb=false
elif [ "$2" == "-updateDb" ]; then
	updateDb=true
else
	updateDb=false
fi

ssh clint@zerobeta.me << EOF
exec ssh-agent bash
ssh-add /home/clint/.ssh/iits_deploy_rsa	
cd /home/clint/twinder/tmp
echo "Cleaning clone folder"
rm -fr /home/clint/twinder/tmp/twinder
echo "Cleaning old deployement"
rm -fr /home/clint/twinder/deploy
ls -R /home/clint/twinder
echo "Cloning repository..."
git clone git@github:franelj/iits.git twinder
cd twinder
git checkout $branch
echo "NPM Install"
npm install
echo "Moving files..."
mkdir /home/clint/twinder/deploy/
mv /home/clint/twinder/tmp/twinder/* /home/clint/twinder/deploy/
echo "Removing temporary files..."
rm -fr /home/clint/twinder/tmp/twinder
cd /home/clint/twinder/deploy/
if $updateDb; then
	echo "Drop and update DB"
	mysql -u root -peRfC}3f?kQx < twinder.sql
	echo "Seed DB"
	mysql -u root -peRfC}3f?kQx < seed.sql
fi
echo "Start application using PM2"
NODE_ENV=production PORT=3001 pm2 start bin/www -i max -f --name twinder
pm2 list
echo "Done"
EOF
