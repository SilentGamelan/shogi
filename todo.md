- Download tileset
- Implement benchmarking
- Implement unit testing
- Set up bug tracking list
- Set up dev roadplan
- create file structure
- set up devblog
- choose tech stack
- Read up on state machines
- set up .gitignore
- implement board orientation based on current player
- Add Romaji and abbreviated Kanji to tile name object, with lookup methods
- Write a tool that writes out piece placements in correct format
- correct file/rank numbering - should be 1,1 at the top-right of the board
    - function to translate grid notation to array notation
- rethink if going to use -1 as out of bounds, if so will need 2 deep border, due to knight
    - also look at 0x88 representation
- function to mirror layout coordinate for placing white pieces according to black pattern
    - Think will need to limit board dimensions to being square and odd
        - need a middle square for mirroring, also doesn't really make sense otherwise
        - actually, sides just need to be odd.
- test ES6 code on safari and firefox

## V.0
### Goals
- prototype webpage
- working object orientated internal representation

### Feature List
-[x] Working ascii representation
-[] Responsive board representation in css grid [mockup]
-[] Correct placement of tiles in internal representation
-[] Implement movement rules in internal representation
-[] Implement keyboard imputting of moves
-[] mate and checkmate detection

## V.1
### Goals
- Implement MVP:
    - Link internal and external representation
    - Responsive single-page set up
    - Can play a basic point and click 2-player hotseat game

### Feature List
- [] Playable on mobile/PC
- [] Point and click / manual move entering
- [] Responsive page using CSS Grid
- [] standard rules
- [] basic tileset / ascii tileset
- [] standard placement
- [] working game timers
- [] move log
- [] show available moves
- [] takebacks
- [] Benchmarking
- [] Unit Testing

## V.2
### Goals
- Deploy on server via node
- Web-based multiplayer
- Save/Load games

### Feature List
- [] User Accounts
- [] Users can have multiple concurrent games
- [] Save/Load games
- [] View game records
- [] View user stats
- [] Accountless quickgames
- [] Game scoring
- [] Leaderboard
- [] Basic Help page
- [] Rule/Pieces reminder page

## V.3
### Goals
- Improved graphics (alternate tilesets/board zoom)
- Customisation of game options
- Improved Player interaction

### Feature List
-[] Challenge mode (with tools)
-[] Sounds
-[] Messaging between users
-[] User Notifications
-[] Handicaps
-[] Player Matching

## V.4
### Goals
- Completed 2 player product

### Feature List
-[] UI Polish
-[] Tutorials
-[] Contextual Help
-[] Hints
-[] Live Chat

## V.5
### Goals
- Implement Single Player Mode

### Feature List
- CPU player that can play a game to completion

## V.6
### Goals
- Intelligent CPU player with difficulty levels
