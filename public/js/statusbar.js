const { remote } = require('electron');

var win = remote.getCurrentWindow();

$( function () {
    $('#minimize').click( function () {
        win.minimize();
    });
    $('#maximize').click( function () {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });
    $('#close').click( function () {
        win.close();
    });
});