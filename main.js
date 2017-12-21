const electron = require('electron');
const { BrowserWindow, ipcMain } = electron;
const { app } = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

let modbusInterval;

const SerialPort = require('serialport');
const ModbusMaster = require('modbus-rtu').ModbusMaster;

//create serail port with params. Refer to node-serialport for documentation 
const serialPort = new SerialPort("COM7", {
    baudRate: 9600
});

//create ModbusMaster instance and pass the serial port object 
const master = new ModbusMaster(serialPort);

function createWindow() {
    win = new BrowserWindow({
        resizable: true
    });

    win.loadURL(`file://${__dirname}/app/index.html`);

    // Open the DevTools.
    //win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    // When UI has finish loading
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('go-inverter', null);
    });
    win.maximize()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});


ipcMain.on('liga', function () {
    master.writeSingleRegister(1, 5003, 0xF303);
});

ipcMain.on('desliga', function () {
    master.writeSingleRegister(1, 5003, 0xF300);
});

ipcMain.on('horario', function () {
    master.writeSingleRegister(1, 5003, 0xF404);
});

ipcMain.on('antihorario', function () {
    master.writeSingleRegister(1, 5003, 0xF400);
});

ipcMain.on('sendFrequency', function (e, freq) {
    master.writeSingleRegister(1, 5004, freq);
});

function initModbus() {
    if (!modbusInterval) {
        modbusInterval = setInterval(() => {
            master.readHoldingRegisters(1, 0, 6).then((data) => {// ID, start, lenght
                win.webContents.send('read-modbus', data);
            }, (err) => {
                console.log(err);
            });
        }, 1000);
    }
}

ipcMain.on('start-read', function () {
    initModbus();
});

ipcMain.on('stop-read', function () {
    clearInterval(modbusInterval);
    modbusInterval = null;
});
