# Sea Battle Game

## Run Project Locally

### Prerequisites

Make sure you have installed all the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js version 16 or later - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.

### Installation

First, install dependencies:<br/>
```bash
npm install -ws
```

####Build common packages:
```bash
npm run game-mechanics:build
```

####Copy environment variables file for the server app:
```bash
cp server/config/example.env server/config/dev.env
```

####Copy environment variables file for the client app:
```bash
cp client/config/.env.development-example client/config/.env.development
```

####Adjust values of the env variables

###Run the development server:

```bash
npm run server:start
npm run client:start
```

###Have fun!
