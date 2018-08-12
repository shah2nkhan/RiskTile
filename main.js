const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;


process.env.NODE_ENV = 'production';
let mainWindow, instSearchWindow;
app.title ='Risk Tile';
app.on('ready', function () {
    

    mainWindow = new BrowserWindow({icon:path.join(__dirname, '/assets/icons/win/icon.ico')});
    mainWindow.loadURL(url.format({ pathname: path.join(__dirname, 'mainWindow.html'), protocol: 'file', slashes: true }));

//Quit App when Main window Close
    mainWindow.on('closed', function () {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuBarTemplate);
    Menu.setApplicationMenu(mainMenu);

});


function LaunchSearchPopup() {
    instSearchWindow = new BrowserWindow({
        title: 'Bond Risk',
        height: 200,
        width: 300,
        frame: false
    });

    instSearchWindow.loadURL(url.format({ pathname: path.join(__dirname, 'searchInstWindow.html'), protocol: 'file', slashes: true }));

    const childmenu = Menu.buildFromTemplate(emptyMenuBarTemplate);
    instSearchWindow.setMenu(childmenu);

    instSearchWindow.on('close', function () {
        instSearchWindow = null;
    });

}

//Handling ipc Message

ipcMain.on('Inst:search', function (e, item) {
    console.log(item);
    mainWindow.webContents.send('Inst:search', item);
    instSearchWindow.close();
});



const mainMenuBarTemplate = [
    {
        label: 'Views',
        submenu:
            [
                {
                    label: 'Search instrument',
                    click() { LaunchSearchPopup(); }
                },
                {
                    label: 'Clear',
                    click() {
                        mainWindow.webContents.send('Inst:clear');

                    }
                },
                {
                    label: 'Quit', accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                    click() { app.quit(); }
                }
            ]
    }
];

const emptyMenuBarTemplate = [];

// Add blank menu if MAC
if (process.platform == 'darwin') {
    mainMenuBarTemplate.unshift({});
}

//Add developer tools if not in production

if (process.env.NODE_ENV !== 'production') {
    mainMenuBarTemplate.push({
        label: 'Developers tools',
        submenu: [
            {
                label: 'Toogle Devtools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}


// app.on('window-all-closed',()=>{
//     if(process.platform!=='darwin')
//     {
//         app.quit();
//     }
// });