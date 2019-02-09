// 1.Dom
const body = document.body;
const height = document.querySelector('.heightClass');
const weight = document.querySelector('.weightClass');
const bmiCheck = document.querySelector('.bmiCheckBtn');
let data = JSON.parse(localStorage.getItem('listData')) || [];
const ulList = document.querySelector('.list');
const clearRecrode = document.querySelector('.clearRecrode');

// 1-1.BMI Setting JSON
const BMI = {
    "normal" :{
        "color" : "#86D73F",
        "resultWord" : "理想",
        "btnClass" : "bmiNormalBtn bmiCheckBtn",
        "listClass" : "normalRange",
        "moreThan" : "18.5",
        "lessThan": "25"
    },
    "overWeight" :{
        "color" : "#FF982D",
        "resultWord" : "過重",
        "btnClass" : "bmiOverWeightBtn bmiCheckBtn",
        "listClass" : "overWeight",
        "moreThan" : "25",
        "lessThan": "30"
    },
    "obese1" :{
        "color" : "#FF6C03",
        "resultWord" : "輕度<br>肥胖",
        "btnClass" : "bmiObese1Btn bmiCheckBtn",
        "listClass" : "obese1",
        "moreThan" : "30",
        "lessThan": "35"
    },
    "obese2" :{
        "color" : "#FF6C03",
        "resultWord" : "中度<br>肥胖",
        "btnClass" : "bmiObese2Btn bmiCheckBtn",
        "listClass" : "obese2",
        "moreThan" : "35",
        "lessThan": "40"
    },
    "obese3" :{
        "color" : "#FF1200",
        "resultWord" : "重度<br>肥胖",
        "btnClass" : "bmiObese3Btn bmiCheckBtn",
        "listClass" : "obese3",
        "moreThan" : "40",
        "lessThan": "10000"
    },
    "underWeight" :{
        "color" : "#31BAF9",
        "resultWord" : "過輕",
        "btnClass" : "bmiUnderWeightBtn bmiCheckBtn",
        "listClass" : "underWeight",
        "moreThan" : "0",
        "lessThan": "18.5"
    },
}
Object.freeze(BMI);

// 2.監聽 & 呼叫 
body.addEventListener('keydown',keyEnter,false); // 監聽 Enter鍵
bmiCheck.addEventListener('click',addData,false); // 監聽 送出計算Btn
height.addEventListener('blur',contentCheck,false); // 監聽 身高欄位 是否為空值
weight.addEventListener('blur',contentCheck,false); // 監聽 體重欄位 是否為空值
clearRecrode.addEventListener('click',clearLocStor,false); // 監聽 清空Btn
updateList(data); // 呼叫 顯示列表

//  3.函式
//  3-1. 按 Enter鍵執行計算函示
function keyEnter(e){
    if(e.keyCode == 13){
        addData();
    }
}

//  3-2. 檢查input是否空值 (blur)
function contentCheck (e){
    const str = e.target.value;
    if (str == ''){
        alert('請輸入身高體重:D');
    }
}

//  3-3.清空紀錄 clear Recrode
function clearLocStor(e){
    e.preventDefault();
    data = [];
    ulList.innerHTML = '' ;
    localStorage.setItem('listData',JSON.stringify(data));
}

//  3-4.看計算結果函式
function addData(e) {
    // 計算用變數
    const heightM = Math.round( height.value * 10) / 1000;
    const heightCm = heightM * 100;
    const weightKg = Math.round( weight.value * 10) / 10;
    const bmiMath = weightKg / (heightM * heightM);
    const bmi = Math.round( bmiMath * 100) / 100;
    // 日期變數
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if( height.value == '' || weight.value == ''){
        // 若身高、體重都空值，則彈出框提示
        alert('請輸入身高體重:D，或是你想聽個笑話？');
        alert('有一天牙籤走在路上，遇見了刺蝟');
        alert('牙籤說：「啊！是公車！」');
    }else{
        // 將值存入 localstorage
        const todo = {
                "Height" : heightCm,
                "Weight" : weightKg,
                "Bmi" : bmi,
                "Month" : month,
                "Day" : day,
                "Year": year,
            };
        data.push(todo);
        updateList(data);
        localStorage.setItem('listData',JSON.stringify(data));

        // 將觸發後的 bmiCheckBtn css樣式換掉
        // DOM
        const circle = document.querySelector('.circle');
        const loop = document.querySelector('.iconLoop');
        const bmiResultWord = document.querySelector('.bmiResultWord');

        // 共同樣式
        circle.style.display = "inline";
        loop.style.display = "inline";
        bmiCheck.style.background = "none";
        bmiCheck.innerHTML =  `${bmi}<br><span class="bmiSmall">BMI</span>`;
        bmiCheck.style.paddingTop = "35px";
        bmiCheck.style.fontSize = "25px";

        for(const key in BMI){
            if(BMI[key].moreThan <= bmiMath && bmiMath <= BMI[key].lessThan){
                bmiCheck.setAttribute('class',BMI[key].btnClass),
                circle.style.background = BMI[key].color;
                bmiResultWord.innerHTML = BMI[key].resultWord;
                bmiResultWord.style.color = BMI[key].color;}
        }
    }
};

//  3-5.列出表單
function updateList(data){
    const dataLen = data.length;
    let str = '';
    for (let i = 0; i < dataLen; i++){
        const heightValue = data[i].Height;
        const weightValue = data[i].Weight;
        const bmiValue = data[i].Bmi;
        const clickDate = `${data[i].Day} - ${data[i].Month} - ${data[i].Year}`;
        for(const key in BMI){
            if(BMI[key].moreThan <= bmiValue && bmiValue <= BMI[key].lessThan){
                str += `<li data-num=" ${i} ">
                           <div class=" ${BMI[key].listClass} "></div>
                           <p class="bmiResult"> ${BMI[key].resultWord} </p>
                           <p class="bmiPosition">
                                <span class="listItem">bmi</span> ${bmiValue} </p>
                            <p class="weightPosition">
                                <span class="listItem">weight</span> ${weightValue}
                                <span class="unit">kg</span></p>
                            <p class="heightPosition">
                                <span class="listItem">height</span> ${heightValue}
                                <span class="unit">cm</span></p>
                            <p class="datePosition">
                                <span> ${clickDate} </span></p>
                        </li>`;
            }
        }
        ulList.innerHTML = str ;
    }
    
}