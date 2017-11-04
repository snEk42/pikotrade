FILE LOAD ORDER:

default.EXT
default-{instance}.EXT
{deployment}.EXT
{deployment}-{instance}.EXT
{short_hostname}.EXT
{short_hostname}-{instance}.EXT
{short_hostname}-{deployment}.EXT
{short_hostname}-{deployment}-{instance}.EXT
{full_hostname}.EXT
{full_hostname}-{instance}.EXT
{full_hostname}-{deployment}.EXT
{full_hostname}-{deployment}-{instance}.EXT
local.EXT
local-{instance}.EXT
local-{deployment}.EXT
local-{deployment}-{instance}.EXT
(Finally, custom environment variables can override all files)


DOCS:
https://github.com/lorenwest/node-config/wiki/Configuration-Files



* This is more complicated than it should be. But we needed to hack it because of behavior of some frontend modules.
 We need to have production in NODE_ENV on both heroku servers (development,production), that's the reason why we added INSTANCE.