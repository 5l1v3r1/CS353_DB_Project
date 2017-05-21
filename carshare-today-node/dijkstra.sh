#!/usr/bin/expect -f

spawn ssh celik.koseoglu@dijkstra2.ug.bcc.bilkent.edu.tr
expect "password:"
sleep 1
send "3slndceo\r"
interact
