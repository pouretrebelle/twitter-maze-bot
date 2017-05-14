# Twitter Maze Bot in openFrameworks

This program algorithmically generates mazes and can be interacted with through twitter.

When running, [@mazingbot](https://twitter.com/mazingbot) tweets an image of a maze and tracks replies. If a reply contains one or more directions (`left`/`l`, `right`/`r`, `up`/`u`, `down`/`d`) it moves the current pointer accordingly, creating a trail in the user's profile link colour, and replies with an image of the updated maze path. When complete it makes a thank you tweet mentioning all the contributors, and tweets out a fresh maze. The cycle begins again.


## Setup

Clone `.env-example`, rename it to `.env` and fill in with Twitter access keys and tokens which can be generated by [registering an app](https://apps.twitter.com/). Run `npm install` to install dependecies. [node-canvas](https://github.com/Automattic/node-canvas) has extra system dependencies, instructions on installation can be found [here](https://github.com/Automattic/node-canvas/wiki/_pages).


## Development and Deployment

`npm start` - run locally using the [nodemon](https://github.com/remy/nodemon) file watcher.

`npm run build && npm run serve` - run the current instance without a file watcher.

`npm run forever` - start a persistant instance using [forever](https://github.com/foreverjs/forever).


## References

The 'hunt and carve' algorithm idea was taken from [Mazes for Programmers](https://www.amazon.co.uk/Mazes-Programmers-Twisty-Little-Passages/dp/1680500554/) by Jamis Buck.
