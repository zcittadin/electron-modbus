// Require ipcRender
const { ipcRenderer } = require('electron');
const SerialPort = require('serialport');
const ModbusMaster = require('modbus-rtu').ModbusMaster;

//create serail port with params. Refer to node-serialport for documentation 
const serialPort = new SerialPort("COM7", {
    baudRate: 9600
});

//create ModbusMaster instance and pass the serial port object 
const master = new ModbusMaster(serialPort);

btnLiga.addEventListener('click', liga);
btnDesliga.addEventListener('click', desliga);
btnHorario.addEventListener('click', horario);
btnAnti.addEventListener('click', antihorario);
btnSendFreq.addEventListener('click', sendFrequency);

// Listen to the 'init-modbus' event
ipcRenderer.on('init-modbus', (event, t) => {
    let timer = setInterval(() => {
        master.readHoldingRegisters(1, 0, 6).then((data) => {// ID, start, lenght
            //promise will be fulfilled with parsed data 
            voltage.innerHTML = data[4];
            current.innerHTML = data[3] / 100;
            frequency.innerHTML = data[5] / 100;
        }, (err) => {
            //or will be rejected with error 
        });
    }, 1000);
});

function liga() {
    master.writeSingleRegister(1, 5003, 0xF303);
}

function desliga() {
    master.writeSingleRegister(1, 5003, 0xF300);
}

function horario() {
    master.writeSingleRegister(1, 5003, 0xF404);
}

function antihorario() {
    master.writeSingleRegister(1, 5003, 0xF400);
}

function sendFrequency() {
    let freq = freqField.value;
    master.writeSingleRegister(1, 5004, freq);
    freqField.value = '';
}

//npm rebuild --runtime=electron --target=1.7.9 --arch=x64 --dist-url=https://atom.io/download/atom-shell (USAR ESTE!)