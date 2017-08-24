function OpenReport(pageName, leftD, rigthD) {
    var win = window.open(pageName+'?left='+leftD+'&right='+rigthD, '_blank');
    win.focus();
}

function PrintReport() {
    window.print();
}