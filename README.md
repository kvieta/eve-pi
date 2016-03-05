# Gadgets-Node
Port of Gadgets-Scala to a MEAN stack
Scala's a fun language but using Scala for (mostly) static relational DB access was drastically overengineering the backend. I considered using fuzzwork's sqlite-latest but ultimately decided it made more sense to migrate that to a formatted MongoDB rather than doing complex joins every call. The call behind /planetary/planetDetails is likely underengineering Mongo (it makes three DB calls rather than one) but I'll probably get to that later. 
As with all my stuff, this is a learning project and probably has major issues. If you notice problems PLEASE contact me with advice and suggestions. 

#About Me
Contact me in-game at "Kurt Midas" or however else you feel like contacting me. My IRL charname is different but I'm not exactly hiding. 

#About You
If you're a coder looking for how to get started, I hope you find some use for this. Please don't hesitate to reach out either; we've got to stick together, after all.

If you're a coder who knows WTF he's doing, please don't hesitate to reach out and give me very detailed reasons why I'm bad and should feel bad.

If you're just some random dood who plays Eve, also feel free to reach out. Without requests or bug reports I'll just keep being not as awesome as I would be if you had.

#How to use
npm install
bower install {angular, angular-bootstrap, angular-route, bootstrap, jquery} 
(alternately wait for a bower.json)
node server.js / nodemon server.js

Also have MongoDB working. Use GoGoGadgetsDBSetup to populate the collections. 
