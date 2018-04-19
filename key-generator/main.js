// Electron Imports
const {app, BrowserWindow} = require('electron')

const path = require('path')
const url = require('url')

let appWindow
function initApp(){
    appWindow = new BrowserWindow({width: 750, height: 550})
    appWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))

    //JUST FOR DEVELOPMENT: Opens the Developer Console
    //appWindow.webContents.openDevTools()
}

app.on('ready', initApp)