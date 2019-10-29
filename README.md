# Tabnabbing

## Table of contents

- [Blacklist Quick start](#blacklist-quick-start)
- [Chrome Extension Quick start](#chrome-extension-quick-start)
- [Project Structure](#project-structure)
- [Creators](#creators)

## Blacklist Quick Start
#### Option 1. Cloud Server
1. `ip address here`

#### Option 2. Setup on Local Machine
>This is only for running the server on your local machine. We have a server setup at `IP Address`.
>Before starting, make sure that you have NodeJS and NPM installed on your computer.
1. `cd blacklist/`
2. `npm i`
3. `node server.js`

## Chrome Extension Quick Start
>Make sure you have the latest version of Google Chrome installed on your computer.
1. Open the Extension Management page by navigating to `chrome://extensions`.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the **LOAD UNPACKED** button and select the extension directory (`tabnabbing/extension`).
## Project Structure
```text
tabnabbing/
└── blacklist/
    ├── node_modules/
    ├── db.js
    ├── index.sql
    ├── package.json
└── extension/
    ├── images/
    └── manifest.json
```
## Creators
- **Benny Feng**
- **Jafree Khan**
- **David Szenczewski**
- **Michael Szenczewski**