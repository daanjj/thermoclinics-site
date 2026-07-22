!#/bin/bash

cd ~/Documents/GitHub/thermoclinics-site
node build.js
cd dist
python3 -m http.server 8888 &
open http://127.0.0.1:8888
