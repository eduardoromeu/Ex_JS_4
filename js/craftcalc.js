const inputPro = document.getElementById("InputPro");
const killInput = document.getElementById("killInput");
const probRes = document.getElementsByClassName("probRes");
const probTable = document.getElementById("probTable");
const probString = document.getElementById("probString");
const mobsInputsField = document.getElementById("mobsInputsField");
const mobsInputs = document.getElementsByName("InputRadio");
const probInput1 = document.getElementById("probInput1");
const probInput2 = document.getElementById("probInput2");

inputPro.addEventListener('change', (e) =>  {
    if(inputPro.checked) {
        probInput1.disabled = false;
        probInput2.disabled = false;
        probInput1.value = '';
        probInput2.value = '';

        Array.from(mobsInputs).forEach((r, i) => {
            r.checked = false;
            r.disabled = true;
        });
    } else {
        probInput1.disabled = true;
        probInput2.disabled = true;

        Array.from(mobsInputs).forEach((r, i) => {
            r.disabled = false;
        });
    }
});

mobsInputsField.addEventListener('change', () => MobSelected());

function MobSelected() {
    const mobsProbs = {
        InputCow : 95,
        InputChi : 95,
        InputSqd : 30,
        InputPig : 90,
        InputShe : 95,
        InputFis : 100,
        InputSpi : 75,
        InputEnd : 35,
        InputBla : 40,
        InputCre : 45,
        InputZom : 80,
        InputGha : 50,
        InputSql : 60,
        InputSlm : 30
    };

    Array.from(mobsInputs).forEach(e => {
        if(e.checked){
            probInput1.value = mobsProbs[e.id];
            probInput2.value = 100;
        }
    });
}

function Calc() {
    const chance = AssignInput(probInput1);
    const possibilities = AssignInput(probInput2);
    const attemps = AssignInput(killInput);
    // const killInts = [30, 40, 50, 60, 70, 80, 90, 95, 97];
    let killInts = [];
    let killPercents = [];

    for(let i = 1; i < 98; i++) {
        killInts.push(i);
    }

    killInts.forEach((e, i) => {
        killPercents.push(Math.round(possibilities * (e * 0.01) / chance));
        if(killPercents[i] <= 0) killPercents[i] = 1;
        let probClone = probRes[0].cloneNode(true);

        probRes[i].children[0].textContent = `${killInts[i]}%`;
        probRes[i].children[1].textContent = killPercents[i];

        if(i != (killInts.length - 1)) {
            probTable.appendChild(probClone);
        }
    });
    
    const totalPercent = ((chance * attemps) / possibilities * 100).toFixed(2);
    probString.textContent = `Sua chance de conseguir um drop é de ${totalPercent}%`;
}

function clearRes() {
    for (let i = Array.from(probRes).length - 1; i > 0; i--) {
        probRes[i].remove();
    }
}

function AssignInput(input){
    if(input.type == "number"){
        if(isNaN(parseInt(input.value)) || parseInt(input.value) < 0) {
            input.value = 1;
        }
        return parseInt(input.value);
    }
    return input.value;
}