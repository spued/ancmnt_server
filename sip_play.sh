#!/usr/bin/bash
#Check arguments

if [ $# -lt 3 ]
  then
    echo "Arguments not meet. $#"
    echo "Usage : sip_play.sh <dest> <period> <file>"
    exit 1
fi
echo --- Call to $1 for $2 seconds
/usr/bin/expect - << EOF
spawn baresip
expect "ready."
sleep 0.5
send "d"
expect ">"
send "$1\n"
expect "incoming rtp for 'audio' established"
sleep 0.5
send "/play $3\n"
expect "playing"
sleep $2
send "b"
expect "terminated"
send "q"
EOF

echo -- Call end
