#!/bin/sh
npm run build &&
ssh 139.59.210.149 'rm -rf /home/zapylaev/chords/frontend/build'
scp -r ~/workspace/chords-web/build zapylaev@139.59.210.149:/home/zapylaev/chords/frontend/