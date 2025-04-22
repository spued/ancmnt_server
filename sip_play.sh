#!/usr/bin/bash
#Check arguments

if [ $# -lt 7 ]
  then
    echo "Arguments not meet. $#"
    echo "Usage : sip_play.sh <dest> <period> <file> <sip_username> <sip_password> <sip_host> <sip_port>"
    exit 1
fi
echo --- Call to $1 for $2 seconds
(sleep 1 &&timeout $2 paplay ../PABox/$3) | /usr/bin/expect - << EOF
spawn baresip
expect "ready."
sleep 0.3
send "/uanew <sip:$4@$6:$7;audio_codecs=pcma>;auth_pass=$5\n"
expect "200 OK"
send "/uafind sip:$4@$6\n"
expect "$6"
send "d"
expect ">"
send "$1\n"
expect "incoming rtp for 'audio' established"
sleep 1
#exec timeout $2 paplay ../pabox/$3
#sleep 1
#send "/play $3\n"
#expect "playing"
sleep $2
#expect ""
send "b"
expect "terminated"
send "/uadel sip:$4@$6\n"
expect "OK"
send "q"
EOF
echo -- Call end
