const transfModal = new bootstrap.Modal(document.getElementById("transfModal"));
const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
const loginAlert = bootstrap.Alert.getOrCreateInstance(document.querySelector('.alert'));
const transfAlert = document.getElementsByClassName("alert")[1];
const transfBtn = document.getElementsByClassName("transf-btn")[0];
const loginBtn = document.getElementsByClassName("login-btn")[0];
const logoffBtn = document.getElementsByClassName("logoff-btn")[0];
const submitBtn = document.getElementsByClassName("submit-btn")[0];
const confirmBtn = document.getElementsByClassName("confirm-btn")[0];
const loginForm = document.getElementsByClassName("login-form")[0];
const loginName = document.getElementById("login-name");
const loginCpf = document.getElementsByClassName("login-cpf");
const loginPass = document.getElementById("login-pass");
const tsForm = document.getElementsByClassName("ts-form")[0];
const tsBank = document.getElementsByClassName("ts-bank")[0];
const tsAg = document.getElementsByClassName("ts-ag")[0];
const tsAcc = document.getElementsByClassName("ts-acc")[0];
const tsValue = document.getElementsByClassName("ts-value")[0];
const tsDesc = document.getElementsByClassName("ts-desc")[0];
const tsDate = document.getElementsByClassName("ts-date")[0];
const confBank = document.getElementById("conf-bank");
const confAg = document.getElementById("conf-ag");
const confAcc = document.getElementById("conf-acc");
const confVal = document.getElementById("conf-val");
const confDesc = document.getElementById("conf-desc");
const confDate = document.getElementById("conf-date");
const userName = document.getElementById("userName");
let clientName;
let clientCpf;
let autenticated = false;
let transaction = {};

function SubmitTransference() {
    let isFormValid;
    tsForm.addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        isFormValid = tsForm.checkValidity();

        tsForm.classList.add('was-validated');
        if(isFormValid) {
            transaction.bank = AssignInput(tsBank);
            transaction.agency = AssignInput(tsAg);
            transaction.account = AssignInput(tsAcc);
            transaction.value = AssignInput(tsValue);
            transaction.description = AssignInput(tsDesc);
            transaction.date = AssignInput(tsDate);
            confBank.textContent = transaction.bank;
            confAg.textContent = transaction.agency;
            confAcc.textContent = transaction.account;
            confVal.textContent = transaction.value;
            FormatCurrency(confVal, true);
            confDesc.textContent = transaction.description;
            confDate.textContent = transaction.date;
            confirmBtn.disabled = false;
        }
    });
}

function ProcessTransference() {
    for (let i = 0; i < 100; i++) {
        const cTransf = localStorage.getItem(`transf[${i}]`);

        if(cTransf === null){
            localStorage.setItem(`transf[${i}]`, JSON.stringify(transaction));
            localStorage.setItem("showTransfAlert", "true");
            i = 100;
            document.location.reload();
        }
    }
}

function LoadTransferences() {
    const noTransf = document.getElementsByClassName("no-transf")[0];
    const tsModalTable = document.getElementsByClassName("tsModal-table");
    const tsModalBody = document.getElementById("tsModalBody");
    const tableDate = document.getElementsByClassName("tsModal-date");
    const tableBank = document.getElementsByClassName("tsModal-bank");
    const tableAg = document.getElementsByClassName("tsModal-ag");
    const tableAcc = document.getElementsByClassName("tsModal-acc");
    const tableVal = document.getElementsByClassName("tsModal-val");
    const tableDesc = document.getElementsByClassName("tsModal-desc");
    const tranfsArr = [];

    for(let i = 0; i < 100; i++) {
        const cTransf = localStorage.getItem(`transf[${i}]`);

        if(cTransf !== null){
            tranfsArr.push(JSON.parse(cTransf));
        }
    }

    if(tranfsArr.length <= 0) {
        noTransf.hidden = false;
        tsModalTable[0].hidden = true;
        return;
    }

    for(i=0; i < (tranfsArr.length - 1); i++) {
        const tableClone = tsModalTable[0].cloneNode(true);
        tsModalBody.appendChild(tableClone);
    };

    Array.from(tsModalTable).forEach((e, i) => {
        tableDate[i].textContent = tranfsArr[i].date;
        tableBank[i].textContent = tranfsArr[i].bank;
        tableAg[i].textContent = tranfsArr[i].agency;
        tableAcc[i].textContent = tranfsArr[i].account;
        tableVal[i].textContent = tranfsArr[i].value;
        FormatCurrency(tableVal[i], true);
        tableDesc[i].textContent = tranfsArr[i].description;
    });
}

function ClearTransferences() {
    for(let i = 0; i < 100; i++) {
        localStorage.removeItem(`transf[${i}]`);
    }
    document.location.reload();
}

function LoadPage() {
    autenticated = localStorage.getItem("autenticated");
    showTransfAlert = localStorage.getItem("showTransfAlert");
    if(autenticated == 'true') {
        clientName = localStorage.getItem("clientName");
        clientCpf = localStorage.getItem("clientCpf");
    
        loginBtn.hidden = true;
        logoffBtn.hidden = false;
        transfBtn.hidden = false;
        userName.textContent = clientName;
        userName.hidden = false;
        submitBtn.disabled = false;
        LoadTransferences();
        loginAlert.close();
    }
    if(showTransfAlert == "true") transfAlert.hidden = !showTransfAlert;
    localStorage.setItem("showTransfAlert", "false");
}

function Login() {
    let isFormValid;
    clientName = AssignInput(loginName);
    clientCpf = `${AssignInput(loginCpf[0])}.${AssignInput(loginCpf[1])}.${AssignInput(loginCpf[2])}-${AssignInput(loginCpf[3])}`;

    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        isFormValid = loginForm.checkValidity();

        loginForm.classList.add('was-validated');
        if(isFormValid) {
            autenticated = true;
            loginBtn.hidden = true;
            logoffBtn.hidden = false;
            transfBtn.hidden = false;
            userName.textContent = clientName;
            userName.hidden = false;
            submitBtn.disabled = false;
            loginAlert.close();
            loginModal.hide();

            localStorage.setItem("clientName", clientName);
            localStorage.setItem("clientCpf", clientCpf);
            localStorage.setItem("autenticated", autenticated);
        }
    });
}

function Logoff() {
    clientName = undefined;
    clientCpf = undefined;
    autenticated = false;

    localStorage.setItem("clientName", clientName);
    localStorage.setItem("clientCpf", clientCpf);
    localStorage.setItem("autenticated", autenticated);

    document.location.reload();
}

function InpuType(e, next) {
    if (e.value.length >= e.maxLength && e.maxLength != '-1') { 
        e.value = e.value.substring(0, e.maxLength);
        if(next != false) {
            loginCpf[next].focus();
        }
    }
}

function FormatCurrency(e, addSimbol){
    if(e.tagName == 'INPUT'){
        e.value = parseFloat(e.value).toFixed(2); 
    } else {
        if(addSimbol){
            e.textContent = `R$${parseFloat(e.textContent).toFixed(2)}`;
        } else {
            e.textContent = parseFloat(e.textContent).toFixed(2);
        }
    }
}

function SetTodayDate() {
    const d = new Date();
    let month = d.getMonth();
    let day = d.getDate();
    if(month < 10) month = '0' + month;
    if(day < 10) day = '0' + day;

    tsDate.value = `${d.getFullYear()}-${month}-${day}`;
}

function AssignInput(input){
    if(input.type == "number"){
        if(isNaN(parseInt(input.value)) || parseInt(input.value) < 0) {
            input.value = '';
        }
        if(input.classList.contains("noParsing")){
            return input.value;
        }
        return parseInt(input.value);
    }
    if(input.type == 'date'){
        const rawDate = input.value;
        return rawDate.replace(/-/g,  "/").split("/").reverse().join("/");
    }

    return input.value;
}