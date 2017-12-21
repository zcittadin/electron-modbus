var { ipcRenderer } = require('electron');

inverter.addEventListener('click', goInverter);
dados.addEventListener('click', goDados);
reports.addEventListener('click', goReports);

ipcRenderer.on('go-inverter', (event, t) => {
    goInverter();
    ipcRenderer.send('init-modbus');
});

function goInverter() {
    ipcRenderer.send('start-read');
    $("#main-content").load("./inverter/inverter.html");
}

function goDados() {
    ipcRenderer.send('stop-read');
    $("#main-content").load("./dados/dados.html");
}

function goReports() {
    ipcRenderer.send('stop-read');
    $("#main-content").load("./reports/reports.html");
}

//npm rebuild --runtime=electron --target=1.7.9 --arch=x64 --dist-url=https://atom.io/download/atom-shell (USAR ESTE!)