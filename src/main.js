import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron';
import path from 'path';
import Store from 'electron-store';
import { fileURLToPath } from 'url';

// ESM'de __dirname eşdeğeri
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Electron Store for persistent settings
const store = new Store();

let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWitdh: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        },
        icon: path.join(__dirname, '../assets/icon.png'), // Set the application icon
        show: false // Start hidden
    });

    // Load the index.html of the app.
    mainWindow.loadFile('src/index.html');

    // Show the window when it's ready to be displayed
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Handle window close event
    mainWindow.on('close', (event) => {
        // Prevent the window from closing immediately
        event.preventDefault();
        // Hide the window instead
        mainWindow.hide();
    });

}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();
    
    // Create application menu
    createMenu();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function createMenu() {
    const template = [
        {
            label: 'Dosya',
            submenu: [
                {
                    label: 'Verileri Dışa Aktar',
                    accelerator: 'CmdOrCtrl+E',
                    click: exportData
                },
                {
                    label: 'Verileri İçe Aktar',
                    accelerator: 'CmdOrCtrl+I',
                    click: importData
                },
                { type: 'separator' },
                {
                    label: 'Çıkış',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Görünüm',
            submenu: [
                { role: 'reload', label: 'Yenile' },
                { role: 'forceReload', label: 'Zorla Yenile' },
                { role: 'toggleDevTools', label: 'Geliştirici Araçları' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Zoom Sıfırla' },
                { role: 'zoomIn', label: 'Yakınlaştır' },
                { role: 'zoomOut', label: 'Uzaklaştır' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Tam Ekran' }
            ]
        },
        {
            label: 'Yardım',
            submenu: [
                {
                    label: 'Hakkında',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Hakkında',
                            message: 'Budget Tracker v1.0.0',
                            detail: 'Kişisel bütçe ve finansal takip uygulaması'
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

async function exportData() {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: 'budget-data.json',
        filters: [
            { name: 'JSON Files', extensions: ['json'] }
        ]
    });

    if (!result.canceled) {
        mainWindow.webContents.send('export-data', result.filePath);
    }
}

async function importData() {
    const result = await dialog.showOpenDialog(mainWindow, {
        filters: [
            { name: 'JSON Files', extensions: ['json'] }
        ],
        properties: ['openFile']
    });

    if (!result.canceled) {
        mainWindow.webContents.send('import-data', result.filePaths[0]);
    }
}

// IPC handlers for data storage
ipcMain.handle('store-get', (event, key) => {
    return store.get(key);
});

ipcMain.handle('store-set', (event, key, value) => {
    store.set(key, value);
});

ipcMain.handle('store-clear', () => {
    store.clear();
});