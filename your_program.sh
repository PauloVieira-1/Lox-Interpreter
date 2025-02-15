#!/bin/sh
#
# Use this script to run your program LOCALLY.
#
# Note: Changing this script WILL NOT affect how CodeCrafters runs your program.
#
# Learn more: https://codecrafters.io/program-interface

set -e # Exit early if any commands fail

# Copied from .codecrafters/run.sh
#
# - Edit this to change how your program runs locally
# - Edit .codecrafters/run.sh to change how your program runs remotely

case "$1" in
    t) exec node app/main.js tokenize test.lox ;;
    p) exec node app/main.js parse test.lox ;;
    e) exec node app/main.js evaluate test.lox ;;
    *) echo Usage: t: tokenize p: parse e: evaluate
esac