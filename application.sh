#!/bin/bash

BASE_PATH=/home/ec2-user/front
BASE_APP_NAME=ee-web # ecosystem.config.js 파일의 앱 네임 입력

echo "> yarn 시작"
#npm install --production
yarn
echo "> nuxt build 시작"
yarn run build

echo "> 현재 구동중인 애플리케이션 PID 확인"
# CURRENT_PID=$(pgrep -f nuxt)
# pm2로 pid 알아내는 방법:
CURRENT_PID=$(pm2 pid $BASE_APP_NAME)

echo "> ($BASE_APP_NAME - PID:$CURRENT_PID)"

if [ -z $CURRENT_PID ]
then
  echo "> 현재 구동중인 애플리케이션이 없으므로 'pm2 start' 실행"
  pm2 start npm --name "$BASE_APP_NAME" -- start
else
  echo "> 현재 구동중인 애플리케이션(PID:$CURRENT_PID)이 있으므로 'pm2 restart' 실행"
  pm2 stop "$BASE_APP_NAME"
  pm2 delete "$BASE_APP_NAME"
  sudo kill -9 $CURRENT_PID
  kill -9 $(lsof -i:3001 -t) 2> /dev/null
  pm2 start npm --name "$BASE_APP_NAME" -- start
fi

pm2 list
echo "##### Complete #####"


