#!/bin/sh 

git checkout bin
git rebase master
grunt compile
git add -f ./bin
git commit -m 'New version for Heroku'
git push heroku bin:master --force
git checkout master
