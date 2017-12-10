var { ipcRenderer } = require('electron');

btnLiga.addEventListener('click', liga);
btnDesliga.addEventListener('click', desliga);
btnHorario.addEventListener('click', horario);
btnAnti.addEventListener('click', antihorario);
btnSendFreq.addEventListener('click', sendFrequency);

ipcRenderer.on('read-modbus', (event, data) => {
    voltage.innerHTML = data[4];
    current.innerHTML = data[3] / 100;
    frequency.innerHTML = data[5] / 100;
});

function liga() {
    ipcRenderer.send('liga');
}

function desliga() {
    ipcRenderer.send('desliga');
}

function horario() {
    ipcRenderer.send('horario');
}

function antihorario() {
    ipcRenderer.send('antihorario');
}

function sendFrequency() {
    let freq = freqField.value;
    ipcRenderer.send('sendFrequency', freq);
    freqField.value = '';
}