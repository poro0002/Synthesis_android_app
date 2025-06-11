# My Project Notes

- the design system code for adding, editing and deleting/viewing systems/elements works fine.

## problem

- im redoing how all the data is passed vis handleViewElement, handleTypoElement, handleIconElement, handleComp element on all 3 screens
- the data needs to be structured properly or it will have no scalability.

- the payload and check favorites function will be redone ina better way

- the project screen where it shows favorites should just have a delete button that runs a function instead of using the "favorite" icon
  ( why would it do a full check to see if its in favorites DB when its being displayed on the front end already from the DB lol )

- were gonna handle comp and typography favorite elements first since they are the hard ones. fonts, icons and colors are easy and last on my list

- are we going to use screentypes or just fix the data structure as a whole ? maybe make it so when a favorite is going to happen. the data will always be structured the same even if its different at first coming form different screens.....
  ^^^^
- maybe sort the data on element screen using the screenType variables first before sending them to the backend

## notes

- the favorite can only be favorited form the element screen. and three different screens lead to the element screen

- only worry about the project screen once each favorite is stored properly with consistent structure

- the other tricky issue is that to view these favorited elements the data will be structured differently than whats in the Favs DB (or will it) remember firestore changes structure.

think around this problem without having a bunch of bloated converter code that i wont understand.

maybe just ditch favorites all together and come up with a better idea ? ........
