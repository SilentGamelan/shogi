# NotVeryGoodShogi Dev Blog 
*(Henceforth known as NVGS)*
---

## The Black and The Red
> 09/03/2019 - In the same place as 30 years before
---

A few brown ales and tinkering on the guitar with my Uncle somehow solved my issue with `console.log.apply()`.

As soon as I sat down and ran the last command to see where I was up to, I remembered that the formatted string works akin to C style formatters.
The `%c` should occur at every point at the string at which you want to substitute in a style. So:

`"%cIt's All Right %cIt's All Right", "color: red", "color: black";

Just a matter of string concatenating the lines and array concatentating the styles. 


## How do you eat an elephant?
> 08/03/2019 - Under a rock, wishing it was a blanket
---

Struggled to get back on the horse, but finally jumped back on just to ride a few meters, and butcher some metaphors along the way.

After fiddling around the edges and putting the final touches to the helper functions, I 
also separated out the creation and placement of pieces, with the inventively named function `placePiece()`, and finally made a choice on the piece retrieval problem.

A normal array of objects, and the lookup is a simple array method:
`gameBoard.pieces.find(x => x.id == id)`

Later will look at performance and change if required. Remember,  **no pre-optimising** and concentrate on getting the **MVP** working before tweaking things.


I think its getting to a tipping point in regards to the overall object and class structuring of the project. Already falling over my own feet in regards to ambigiously named variables, remembering the scopes and parameters of functions/methods, and problems with confusing the referent of instances of `this`.

Don't think going to attempt it tonight though.


One piece at a time, one piece at a time... 



*unless you can find a massive sous-vide, then pulled 'phant is back on the menu boys.**

---

## Holy Arrays, batman.
> 07/03/2019 - In front of a desk with an inordinate amount of coffee cups
---
Dear lord, dealing with indexing issues is a right royal pain in the arse.

After finally getting back and knuckling down to making some vaguely structured progress, have spent the last two days beating my head on the keyboard trying to fix some helper functions:
`setUpPieces()`
 for translating Shogi Notation coordinates to playable board co-ordinates

`mirrorLayout()`
`notationToIndex()`

`indexToNotation()`


tying myself up in knots about minor design choices.

Realised didn't have a plan for where the pieces should be stored, and then how to address them.

Pondered straight arrays, sparse array (missing out 0 index so that the index and piece.id match), associative arrays, of the piece objects.



It's almost enough to go down the path of believing arrays begin at 1....
![oh no](./images/startAt1.png)







## I Can't Believe You've Done This
### or, WTF why can't I stop overcomplicating things
*06/03/2019 - In a world primarily defined by raging hunger and very stiff thighs*
---

