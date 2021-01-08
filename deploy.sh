#!/bin/sh

yarn build
rsync -avzhP --delete build/ www-data@feinheit06.nine.ch:photoprint.406.ch/
