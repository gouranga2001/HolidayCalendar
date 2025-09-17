// global.js (new file)
let globalDate = new Date(); // single source of truth

function setGlobalDate(newDate) {
    globalDate = new Date(newDate); // always clone
    console.log("Global date updated:", globalDate);
}

function getGlobalDate() {
    return new Date(globalDate); // return a copy
}

// global.js
function formatDateLocal(date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
}
