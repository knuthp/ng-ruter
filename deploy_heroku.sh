#!/bin/sh 
# http://www.shanestillwell.com/2014/04/22/deploy-web-app-with-grunt-compiled-assets-to-heroku/

git checkout bin
git rebase master
grunt compile
git add -f ./bin
git commit -m 'New version for Heroku'
git push heroku bin:master --force
git checkout master
