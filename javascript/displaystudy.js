"use strict"

//시리즈, 해당 책 수, 책이름...., 각 책이름에 해당되는 권수, 각 책에 총 유닛수
let curriculum = [  ['Phonics',6,'Alphabet Phonics','Easy Phoics','Easy Phonics Plus','Phonics Town','Phonics Fun','Theme English',1,1,1,3,3,6,15,15,15,15,15,15],
                    ['Story',20,
                        'Story Town 1-1','Story Town 1-2','Story Town 1-3','Story Town 1-4','Story Town 1-5',
                        'Story Town 2-1','Story Town 2-2','Story Town 2-3','Story Town 2-4','Story Town 2-5',
                        'Story Town 3-1','Story Town 3-2','Story Town 3-3','Story Town 1-4','Story Town 3-5',
                        'Story Town 4-1','Story Town 4-2','Story Town 4-3','Story Town 4-4','Story Town 4-5',
                        1,1,1,1,1,1,1,1,1,1,
                        1,1,1,1,1,1,1,1,1,1,
                        15,15,15,15,15,
                        15,15,15,15,15,
                        15,15,15,15,15,
                        15,15,15,15,15
                    ],
                    ['Reading',15,
                        'Reading Town 30-1','Reading Town 30-2','Reading Town 30-3',
                        'Reading Town 50-1','Reading Town 50-2','Reading Town 50-3',
                        'Reading Town 70-1','Reading Town 70-2','Reading Town 70-3',
                        'Reading Town 100-1','Reading Town 100-2','Reading Town 100-3',
                        'Reading Town 130-1','Reading Town 130-2','Reading Town 130-3',
                        1,1,1,
                        1,1,1,
                        1,1,1,
                        1,1,1,
                        1,1,1,
                        15,15,15,
                        15,15,15,
                        15,15,15,
                        15,15,15,
                        12,12,12
                    ],
                    ['Grammar',4,
                        '중학영문법',
                        'Grammar Start',
                        'Grammar Jump',
                        'Grammar Gateway',
                        6,2,4,3,
                        15,15,15,15
                    ],
                    ['Writing',1,
                        'My English Diary',
                        3, 15
                    ],
                    ['Speaking',1,
                        'Talk Talk English',
                        4, 15
                    ],
                    ['All In One',2,
                        'All In One',
                        'All In One Listening',
                        6,3,
                        15,20
                    ],
                    ['Vocaburary',1,
                        'Power Voca',
                        12,
                        60
                    ]
                ];

let bookno = 0; //책의 curriculum 변수내 위치값저장, 0은 없다는 뜻임
let chapterno = 0; //권수의 curriculum 변수내 위치값저장, 0은 없다는 뜻임
let unitno = 0; //유닛의 curriculum 변수내 위치값저장, 0은 없다는 뜻임
let choicelist = [['no','책이름','권수','유닛'],];
let listnumber = 0;

let StudyStartTime;
let StudyEndTime;
let isitfirst = true;
let startmsg;
let hour;

//읽어주는 함수관련
let voices = [];
let speechpitch = 1.0; //목소리 피치
let speechrate = 0.7; //목소리 빠르기
let lang = 'en-US'; //목소리 언어
speechsentence("Ready"); 

//타이핑 쳐주는 함수관련
let typingBool = false;
let typingIdx = 0;
let typingTxt;
let tyInt;

//스터디 플랜 카운팅
let seq = 0;

//교재가 바뀌는 것을 체크하는 것
let startbook;

let studyplanlist = []; //전체 스터디 플랜을 순서대로 저장
let nowplaymp3src;
let gonextstep = false;
let repeatnum = 1; //cd 반복 횟수를 저장하는 변수

//mp3를 출력하기 위함 변수
let myaudio = new Audio();

//선택교재
function showchoicescreen(){
    document.getElementById("studyspace").innerHTML = "";

    let str = "";

    str = str + `
        <span class="input-group-text" id="basic-addon1">시리즈
            <select class="form-select" aria-label="seriesname" id="series">
                <option selected value="-1">선택하세요.</option>
    `;

    for(let i=0;i<curriculum.length;i++){
        str = str + `
            <option value=${i}>${curriculum[i][0]}</option>
        `;
    }

    str = str + `
            </select>
        </span
    `;

    document.getElementById('serieschoice').innerHTML = str;
    document.getElementById('bookchoice').innerHTML = "";
    document.getElementById('chapterchoice').innerHTML = "";
    document.getElementById('unitchoice').innerHTML = "";

    document.getElementById('choicebutton').innerHTML = `
                <div class="d-grid gap-2">
                    <button class="btn btn-primary" type="button" onclick="showchoicescreen()">처음부터 다시 선택</button>
                </div>
    `;

    document.getElementById('adddonechoicebtn').innerHTML = `
              
            `;

    listnumber = 0;
    choicelist.splice(0,choicelist.length);
    choicelist.push(['no','책이름','권수','유닛']);

    document.getElementById("choicelist").innerHTML = ` 
        <button type="button" class="btn btn-primary">
            선택된 교재
        </button>
    `;

    document.getElementById('choicelist').innerHTML = "[수업/학습 순서대로 선택하세요.]";
    
    document.getElementById('series').addEventListener('change',setbook);
}                

function setbook(){
    let series = document.getElementById('series');

    let str = "";

    //초기화
    document.getElementById('chapterchoice').innerHTML = "";
    document.getElementById('unitchoice').innerHTML = "";
    document.getElementById('adddonechoicebtn').innerHTML = "";
    
    if(series.value == "-1"){ //"선택하세요"를 선택한 경우 는 지우기
        document.getElementById('bookchoice').innerHTML = "";
        document.getElementById('chapterchoice').innerHTML = "";
        document.getElementById('unitchoice').innerHTML = "";
        document.getElementById('adddonechoicebtn').innerHTML = "";
    }else{
        let temp = curriculum[series.value][1]
        str = str + `
                <span class="input-group-text" id="basic-addon1">책이름
                    <select class="form-select" aria-label="bookname" id="book">
                        <option selected value="-1">선택하세요.</option>
            `;

        let book = document.getElementById('book');

        for(let i=0;i<curriculum[series.value][1];i++){
            str = str + `
                    <option value=${i}>${curriculum[series.value][i+2]}</option>
                `;
        }
        
        str = str +`
                        </select>
                    </span>
                `;

        document.getElementById('bookchoice').innerHTML = str;
        document.getElementById('book').addEventListener('change',setchapter);
    }
}

function setchapter(){
    let series = document.getElementById('series');
    let book = document.getElementById('book');
    let str = "";
    let temp;

    document.getElementById('chapterchoice').innerHTML = "";
    document.getElementById('unitchoice').innerHTML = "";
    document.getElementById('adddonechoicebtn').innerHTML = "";

    if(book.value == "-1"){
        document.getElementById('chapterchoice').innerHTML = "";
        document.getElementById('unitchoice').innerHTML = "";
        document.getElementById('adddonechoicebtn').innerHTML = "";
    }else{
        if(curriculum[series.value][Number(curriculum[series.value][1]) + Number(book.value) + 2] <= 1){ //단권인 경우 바로 유닛 선택
            str = `
                <span class="input-group-text" id="basic-addon1">권수
                    <select class="form-select" aria-label="chapter" id="chapter">
                        <option selected value="-1">단권입니다.</option>
                    </select>
                </span>
            `;
            document.getElementById('chapterchoice').innerHTML = str;
            str = "";
            
            temp = curriculum[series.value][Number(curriculum[series.value][1])*2 + Number(book.value) + 2];
            str = str + `
                <span class="input-group-text" id="basic-addon1">유닛    
                    <select class="form-select" aria-label="unit" id="unit">
                        <option selected value="-1">선택하세요.</option>
            `;
    
            for(let i=0;i<temp;i++){
                str = str + `
                    <option value=${i}>${i+1}</option>
                `;
            }
    
            str = str + `
                    </select>
                </span>
            `;
            document.getElementById('adddonechoicebtn').innerHTML = `
                <button type="button" class="btn btn-danger" id="addchoice">추가선택</button>
                <button type="button" class="btn btn-success" id="donechoice">선택완료</button>
            `;

            document.getElementById('unitchoice').innerHTML = str;
            document.getElementById('addchoice').addEventListener('click',addchoice);
            document.getElementById('donechoice').addEventListener('click',donechoice);
        }else{ //여러권인경우 권수 선택
            temp = curriculum[series.value][Number(curriculum[series.value][1]) + Number(book.value) + 2];
            str = `
                <span class="input-group-text" id="basic-addon1">권수
                    <select class="form-select" aria-label="chapter" id="chapter">
                        <option selected value="-1">선택하세요.</option>
            `;

            for(let i=0;i<temp;i++){
                str = str + `
                    <option value=${i}>${i+1}</option>
                `;
            }

            str = str + `
                    </select>
                </span>
            `;

            document.getElementById('chapterchoice').innerHTML = str;
            document.getElementById('chapter').addEventListener('change',setunit);
        }
    }
}

function setunit(){
    let series = document.getElementById('series');
    let book = document.getElementById('book');
    let chapter = document.getElementById('chapter');
    let temp = Number(curriculum[series.value][Number(curriculum[series.value][1]) + Number(book.value) + 2]);
    let str = "";

    if(chapter.value == -1){
        document.getElementById('unitchoice').innerHTML = "";
        document.getElementById('adddonechoicebtn').innerHTML = "";
    }else{
        temp = curriculum[series.value][Number(curriculum[series.value][1])*2 + Number(book.value) + 2]
        str = str + `
            <span class="input-group-text" id="basic-addon1">유닛    
                <select class="form-select" aria-label="unit" id="unit">
                    <option selected value="-1">선택하세요.</option>
        `;

        for(let i=0;i<temp;i++){
            str = str + `
                <option value=${i}>${i+1}</option>
            `;
        }

        str = str + `
                </select>
            </span>
        `;
        document.getElementById('adddonechoicebtn').innerHTML = `
                <button type="button" class="btn btn-danger" id="addchoice">추가선택</button>
                <button type="button" class="btn btn-success" id="donechoice">선택완료</button>
            `;
        document.getElementById('unitchoice').innerHTML = str;
        document.getElementById('addchoice').addEventListener('click',addchoice);
        document.getElementById('donechoice').addEventListener('click',donechoice);
        
    }
}

function addchoice(){
    bookno = 0; 
    chapterno = 0; 
    unitno = 0;
    
    bookno = document.getElementById('book').value;
    chapterno = Number(document.getElementById('chapter').value);
    unitno = document.getElementById('unit').value;

    let bookname;
    let chapternum;
    let unitnum;

    let series = document.getElementById('series').value;
    let identical = false;

    if(unitno == -1){
        alert("유닛이 선택되지 않았습니다.");
    }else{
        bookname = curriculum[series][Number(bookno)+2];
        chapternum = chapterno + 1;
        if(chapterno == -1){
            chapternum = 1;
        }
        unitnum = Number(unitno) + 1;
        // 똑같은 거 없는 지 확인하는 루틴이 필요한데.... 지금은 넘거가자
        for(let i=1;i<choicelist.length;i++){
            if(choicelist[i][1] == (bookname+`(${chapternum}권)`)){
                if(choicelist[i][2] == chapternum){
                    if(choicelist[i][3] == unitnum){
                        identical = true;
                    }
                }
            }
        }

        if(identical){
            alert("동일한 내용이 존재합니다.")
        }else{
            listnumber++;

            let str = `${bookname}(${chapternum}권)-${unitnum}차시`;
            document.getElementById("choicelist").innerHTML = document.getElementById("choicelist").innerHTML + `
                <span>
                    ${str}<button type="button" class="btn-close" aria-label="Close" onclick="deletelist(${listnumber})"></button>
                </span>
            `;
            choicelist.push([listnumber,bookname,chapternum,unitnum]);
        }
    }
}

function deletelist(deleteno){
    let str = "";
    for(let i=1;i<choicelist.length;i++){
        if (choicelist[i][0] == deleteno){
            choicelist.splice(i,1);
        }
    }
    for(let i=1;i<choicelist.length;i++){
        str = str + `
            <span>
                ${choicelist[i][1]}(${choicelist[i][2]}권)-${choicelist[i][3]}차시<button type="button" class="btn-close" aria-label="Close" onclick="deletelist(${choicelist[i][0]})"></button>
            </span>
        `;
    }
    document.getElementById("choicelist").innerHTML = str;
}


function donechoice(){
    let str = "";
    let dif = false; //선택된 학습들의 책이 다르면 true

    if(choicelist.length > 1){
        document.getElementById("totalchoice1").innerHTML = "";
        document.getElementById("totalchoice2").innerHTML = "";

        choicelist.splice(0,1);

        /*
        // 책 종류별와 유닛별로 정렬 - 알고리즘은 완벽함!! 그러나, 사용안함. 일단은 입력된 순서대로 수업
        choicelist.sort(function(a,b){            
            if(a[1].toLowerCase() === b[1].toLowerCase()){
                console.log(`2 : ${a[3] < b[3] ? -1 : a[3] > b[3] ? 1 : 0}`);
                return a[3] < b[3] ? -1 : a[3] > b[3] ? 1 : 0;
            }            
            return a[1].toLowerCase() < b[1].toLowerCase() ? -1 : a[1].toLowerCase() > b[1].toLowerCase() ? 1 : 0;
        });
        */

        for(let i=0;i<choicelist.length;i++){
            str = str + `
                <span>
                    ${choicelist[i][1]}(${choicelist[i][2]}권)-${choicelist[i][3]}차시
                </span>
            `;
        }

        if(document.getElementById('inclass').checked){
            inclass(str);
        }else if(document.getElementById('afterclass').checked){
            afterclass(str);
        }else{
            alert("선택된 학습이 없습니다.");
        }
    }else{
        alert("선택된 학습이 없습니다.");
    }
}

function inclass(str){

    // 선택 부분을 공복으로 안 보이도록 함.
    document.getElementById("totalchoice1").innerHTML = `
        <div class="col-md-3 case choice" id="serieschoice">

        </div>
        <div class="col-md-3 case choice" id="bookchoice">

        </div>
    `;

    document.getElementById("totalchoice2").innerHTML = `
        <div class="col-md-3 case choice" id="chapterchoice">
        
        </div>
        <div class="col-md-3 case choice" style="padding-bottom:3px" id="unitchoice">
        
        </div>
        <div class="col-md-3 case choice" id="adddonechoicebtn">

        </div>
    `;
    // 선택 부분을 공복으로 안 보이도록 함.

    // 무슨 수업을 하는지 표시
    document.getElementById("choicelist").innerHTML = str + "의 수업을 시작합니다.";

    // 스터디 플랜을 불러옴
    let notdone = true;
    let hspdata_JSON; //전체 데이타

    // studyplan 파일 불러와서 studyplanlist이름의 json 파일로 만들기
    let selectedFile = new XMLHttpRequest();
    selectedFile.open("GET","./data/studyplan.xlsx"); //파일명의 길이도 문제가 되는 것 같음. 짧게 유지
    selectedFile.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
    selectedFile.responseType = "blob"; //Blob형식으로 부탁합니다!
    selectedFile.send();  //위 요청을 보낸다.

    selectedFile.onload = function(){ 

        if(selectedFile.status === 200){

            let blob = new Blob([selectedFile.response], {type:'application/xlsx'}); //받은 파일의 내용을 blob 형태로 변환

            if(blob.size>0){
                let fileReader = new FileReader();
                fileReader.readAsBinaryString(blob);                    
                fileReader.onload = (event)=>{
                    let data = event.target.result;
                    let workbook = XLSX.read(data,{type:"binary"});
                    workbook.SheetNames.forEach(sheet => {
                        
                        let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                        let jsonexcelfile = JSON.stringify(rowObject, undefined, 4);
                        let jsonexcelfileparse = JSON.parse(jsonexcelfile);
                        hspdata_JSON = JSON.parse(jsonexcelfile);

                        if(notdone){
                            sheet = 'studyplan';
                            let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                            let jsonexcelfile = JSON.stringify(rowObject, undefined, 4);
                            let jsonexcelfileparse = JSON.parse(jsonexcelfile);
                            hspdata_JSON = JSON.parse(jsonexcelfile); 

                            for(let j=0; j < choicelist.length; j++){
                                for(let i=0 ; i < hspdata_JSON.length; i++){
                                    if((hspdata_JSON[i].book == choicelist[j][1]) && (hspdata_JSON[i].book_num == choicelist[j][2]) && (hspdata_JSON[i].unit == choicelist[j][3])){
                                        studyplanlist.push(hspdata_JSON[i]);
                                    }
                                }
                            }
                            notdone = false;    
                        }
                    });
                    startstudy();
                }                
            }
        }
    }
    //여기까지 파일 불러와서 jsonexcelfileparse에 저장 하기
}

function startstudy(){

    //화면 포맷 잡기
    document.getElementById("studyspace").innerHTML = `
        <div class="row" style="padding:10px">
            <div class="col-md-10">
                <div id="plan">

                </div>                 
            </div>
        </div>

        <div class="row">
            <div class="col-md-10 case body" id="body">
            </div>
        </div>

        <div class="row">
            <div class="col-md-2 case hannas">
                <div id="hanna">
                    
                </div>
            </div>
            <div class="col-md-8 case bottom">
                <div id="hanna2">   

                </div>
            </div>
        </div>

        <div class="col-md-10" id="ibutton">
            <input class="realbutton" type="button" id="startstudy" value="Next" onclick="studyroutine()">
        </div>

        <div class="row prog">
            <div class="col-md-10">
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">0%</div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-8 case result" id="result1">id="result1"</div>
            <div class="col-md-2 case result" id="result2">id="result2"</div>
        </div>
    `;
    getCurrentTime();
    startbook = "start";
}

function studyroutine(){
    // 스터디 플랜대로 수업
    // 교재 이름과 스터디 플랜을 차례대로 보여준다.
        
    let time_delay;

    repeatnum = 1;
    
    // 처음시작이거나 책이나 유닛이 바뀌는 경우 새로 책이나 유닛이 시작함을 알려준다.
    if(startbook === "start"){
        lang="ko-KR";
        speechpitch = 1;
        speechrate = 1.5;  
        speechsentence(`지금부터 ${studyplanlist[seq].book}교재의 ${studyplanlist[seq].unit}번째 유닛의 수업을 시작합니다.`);
        time_delay = 5000;
        startbook = studyplanlist[seq].book;
    }else if((studyplanlist[seq].book != studyplanlist[seq-1].book) || (studyplanlist[seq].unit != studyplanlist[seq-1].unit)){
        lang="ko-KR";
        speechpitch = 1;
        speechrate = 1.5;  
        speechsentence(`지금부터 ${studyplanlist[seq].book}교재의 ${studyplanlist[seq].unit}번째 유닛의 수업을 시작합니다.`);
        time_delay = 5000;
        startbook = studyplanlist[seq].book;
    }else{
        time_delay = 1;
    }
    
    //
    setTimeout(() => {
        //적절한 한나 이미지를 보여 줌
        document.getElementById("hanna").innerHTML = `
            <img id="hannaimg1" src="./src/${studyplanlist[seq].todo}.png" alt=""></img>`;
        document.getElementById('hannaimg1').setAttribute("style","animation: m2 3s ease-in-out;");

        // 해당 단계에 맞는 오더를 말해줌
        speechsentence(studyplanlist[seq].todoscript);

        // 해당 단계에 맞는 오더를 글로 써줌.
        typingletters(studyplanlist[seq].todoscript);

        // 책의 이미지를 보여줌
        if(studyplanlist[seq].image != ""){
            document.getElementById("hanna2").innerHTML = `
                <img id="hannaimg2" src="./src/${studyplanlist[seq].book}/${studyplanlist[seq].image}" alt=""></img>`;
        }

        // 들려주어야 할 CD가 있으면 재생해줌. 이때 ibutton의 값을 "CD들어보기"=>"CD그만듣기"=>"Next"로 바꾸기
            if(studyplanlist[seq].cdstartno != "0000"){
                let mp3source = "./mp3/"+studyplanlist[seq].book+"/"+studyplanlist[seq].cdstartno+".mp3";
                nowplaymp3src = studyplanlist[seq].cdstartno;
                document.getElementById("ibutton").innerHTML = `
                    <input class="realbutton" type="button" id="startstudy" value="CD재생" onclick="playcd('${mp3source}')">`;
            }else{
                seq++;
            }

        // studyplaylist의 마지막이면 다음 버튼을 끝 버튼으로 바꾸고 끝내는 함수를 지정
        if(seq == studyplanlist.length){
            document.getElementById("ibutton").innerHTML = `
                <input class="realbutton" type="button" id="startstudy" value="End" onclick="endstudy()">`;
        }
    }, time_delay);
    // setTimeout : 일정시간후에 작업을 한번 실행
    // setInterval : 일정한 시간 간격으로 작업을 수행 => clearInterval로 중지, clearTimeout()
    
    /*
    document.getElementById("studyspace").innerHTML = `
        <div class="row" style="padding:10px">
            <div class="col-md-10">
                <div id="plan">
                    <img src="studyplan01.JPG" alt="File not Found">
                </div>                 
            </div>
        </div>

        <div class="row">
            <div class="col-md-10 case body">
            </div>
        </div>

        <div class="row">
            <div class="col-md-2 case hannas">
                <div id="hanna">
                    <img id="hannaimg1" src="/listenandrepeat_color-01.png" alt="" height="300px" width="300px">
                </div>
            </div>
            <div class="col-md-8 case bottom">
                <div id="hanna">                    
                </div>
            </div>
        </div>

        <div class="row prog">
            <div class="col-md-10">
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">0%</div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-8 case result" id="result1">id="result1"</div>
            <div class="col-md-2 case result" id="result2">id="result2"</div>
        </div>
    `;
    */

    //canvas Test
    /*
    let bottom = document.querySelector(".bottom");
    bottom.innerHTML = `<canvas id="canvas1"></canvas>`;
    
    let canvas1 = document.querySelector("#canvas1");

    let c = canvas1.getContext('2d');
    c.fillRect(20,20,(canvas1.width-40),(canvas1.height-40));

    window.addEventListener('click',planmove);
    */
}

function playcd(mp3source){
    let playdone = false;

    myaudio.src = mp3source;
    myaudio.play();
    document.getElementById("ibutton").innerHTML = ``;    
    setTimeout(() => {
        setTimeout(() => {
            myaudio.pause();
            myaudio.currentTime=0;
            if(nowplaymp3src != studyplanlist[seq].cdendno){
                let cdnum = Number(nowplaymp3src);
                cdnum++;
                let strcdnum = String(cdnum);
                if(strcdnum.length == 3){
                    strcdnum = '0'+strcdnum;
                }
                nowplaymp3src = strcdnum;
                strcdnum = "./mp3/"+studyplanlist[seq].book+"/"+nowplaymp3src+".mp3";                
                playcd(strcdnum);
            }else{
                seq++;
                playdone = true;
                document.getElementById("ibutton").innerHTML = `
                <input class="realbutton" type="button" id="startstudy" value="Next" onclick="studyroutine()"/>`;
            }

            if(playdone){
                if((studyplanlist[seq-1].repeat > 1) && (repeatnum < studyplanlist[seq-1].repeat)){
                    let strcdnum;
                    seq--;
                    repeatnum ++;
                    nowplaymp3src = studyplanlist[seq].cdstartno;
                    strcdnum = "./mp3/"+studyplanlist[seq].book+"/"+nowplaymp3src+".mp3";
                    document.getElementById("ibutton").innerHTML = ``;                
                    playcd(strcdnum);                    
                }
            }
        }, Math.floor(myaudio.duration*1000));
    }, 3000);    
}

function endstudy(){
    //화면 포맷 잡기
    document.getElementById("studyspace").innerHTML = `
        <div class="row" style="padding:10px">
            <div class="col-md-10">
                <div id="plan">

                </div>                 
            </div>
        </div>

        <div class="row">
            <div class="col-md-10 case body" id="body">
            </div>
        </div>

        <div class="row">
            <div class="col-md-2 case hannas">
                <div id="hanna">
                    
                </div>
            </div>
            <div class="col-md-8 case bottom">
                <div id="hanna2">   

                </div>
            </div>
        </div>

        <div class="col-md-10" id="ibutton">
            
        </div>

        <div class="row prog">
            <div class="col-md-10">
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">0%</div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-8 case result" id="result1">id="result1"</div>
            <div class="col-md-2 case result" id="result2">id="result2"</div>
        </div>
    `;    
    typingletters("학습이 끝났습니다. 수고하셨습니다.");
}

// id="body"에 글자를 써주는 효과
function typingletters(words) {

    typingTxt = "";
    typingBool = false;
    typingIdx = 0;

    document.getElementById('body').innerHTML = "";

    typingTxt = words.split(""); // 한글자씩 자른다. 
    if (typingBool == false) { // 타이핑이 진행되지 않았다면 
        typingBool = true;
        tyInt = setInterval(typing, 100); // 반복동작 
    }
}

function typing() {
    if (typingIdx < typingTxt.length) { // 타이핑될 텍스트 길이만큼 반복 
        document.getElementById('body').append(typingTxt[typingIdx]); // 한글자씩 이어준다. 
        typingIdx++;
    } else {
        clearInterval(tyInt); //끝나면 반복종료
    }
}
// id="body"에 글자를 써주는 효과

// 주어진 글자를 읽어주는 함수

function setVoiceList(){
    let synth = window.speechSynthesis;
    voices = synth.getVoices();
}

function speechsentence(txt){
    /*
    활용예제 
        lang="ko-KR";
        speechpitch = 1;
        speechrate = 1; 
            speechsentence("유닛이 선택되지 않았습니다.");
        lang="en-US";
        speechpitch = 1.2;
        speechrate = 0.8; 
            speechsentence("Unit is not chosen.");

    */
    setVoiceList();

    if(window.speechSynthesis.onvoiceschanged !== undefined){
        window.speechSynthesis.onvoiceschanged = setVoiceList;
    }

    if(!window.speechSynthesis){
        alert("음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요");
        return;
    }

    let utterThis = new SpeechSynthesisUtterance(txt);

    utterThis.onend = function (event) {
        console.log('end');
    };

    utterThis.onerror = function(event) {
        console.log('error', event);
    };

    let voiceFound = false;

    for(let i = 0; i < voices.length ; i++) {
        if(voices[i].lang.indexOf(lang) >= 0 || voices[i].lang.indexOf(lang.replace('-', '_')) >= 0) {
            utterThis.voice = voices[i];  // 목소리 종류 
            voiceFound = true;
        }
    }
    
    if(!voiceFound) {
        console.log('voice not found');
    return;
    }

    utterThis.lang = lang;
    utterThis.pitch = speechpitch;
    utterThis.rate = speechrate; //속도
    window.speechSynthesis.speak(utterThis);

    /*
    let first = setInterval(()=>{
        window.speechSynthesis.speak(utterThis);
    }, 2000);

    let second = setInterval(()=>{
        window.speechSynthesis.speak(utterThis);
    }, 4000);*/
}

// 주어진 글자를 읽어주는 함수

let infi = false;

function planmove(){
    let plan = document.getElementById('plan');
    let plan3 = document.getElementById('hannaimg1');

    if (infi == false) {
        plan.setAttribute("style","animation: mm 2s ease-in-out infinite;animation-delay:0.1s;");             
        plan3.setAttribute("style","animation: m2 3s ease-in-out infinite;animation-delay:0.3s;");  
        infi = true;
    }else{
        plan.setAttribute("style","animation: mm 2s ease-in-out;");
        plan3.setAttribute("style","animation: m2 3s ease-in-out;"); 
        infi = false;
    }
}

function afterclass(str){

    document.getElementById("totalchoice1").innerHTML = `
            <div class="col-md-3 case choice" id="serieschoice">

            </div>
            <div class="col-md-3 case choice" id="bookchoice">

            </div>
        `;

    document.getElementById("totalchoice2").innerHTML = `
        <div class="col-md-3 case choice" id="chapterchoice">
        
        </div>
        <div class="col-md-3 case choice" style="padding-bottom:3px" id="unitchoice">
        
        </div>
        <div class="col-md-3 case choice" id="adddonechoicebtn">

        </div>
    `;

    document.getElementById("choicelist").innerHTML = str + "의 추가학습을 시작합니다.";

    document.getElementById("studyspace").innerHTML = `
        <div class="row" style="padding:10px">
            <div class="col-md-10">
                <div class="steps">STEP#1</div>       
                <div class="steps">STEP#2</div>       
                <div class="steps">STEP#3</div>       
                <div class="steps">STEP#4</div>       
                <div class="steps">STEP#5</div>       
            </div>
        </div>
        <div class="row">
            <div class="col-md-10 case body">
                
            </div>
        </div>
        <div class="row">
            <div class="col-md-10 case bottom">
                
            </div>
        </div>
        <div class="row prog">
            <div class="col-md-10">
                
            </div>
        </div>
        <div class="row">
            <div class="col-md-8 case result" id="result1">id="result1"</div>
            <div class="col-md-2 case result" id="result2">id="result2"</div>
        </div>
    `;

    getCurrentTime();
}

function getCurrentTime(){
    let currentDate = new Date();
    let pos = document.getElementById("result2");
    let msg = "";

    let StudyRealTime;
    let temphour=0;
    let tempmin=0;
    let tempsec=0;
    let tempstring="";
    let i;
    
    StudyEndTime = currentDate.getHours()*60*60+currentDate.getMinutes()*60+currentDate.getSeconds();
    StudyRealTime = StudyEndTime - StudyStartTime;

    
    tempsec = StudyRealTime;
    for(i=0;tempsec>60;i++){
        tempsec = tempsec - 60;
    }

    tempmin = i;
    for(i = 0;tempmin>60;i++){
        tempmin = tempmin - 60;
    }
    temphour = i;

    if(temphour != 0){
        tempstring = tempstring + temphour+"시간";
    }
    if(tempmin != 0){
        tempstring = tempstring + tempmin+"분";
    }
    tempstring = tempstring + tempsec+"초";

    if(currentDate.getHours() > 12){
        msg = msg +(currentDate.getHours()-12)+"시";
    }
    else{
        msg = msg + currentDate.getHours() + "시";
    }

    msg = msg + currentDate.getMinutes()+"분";
    msg = msg + currentDate.getSeconds()+"초";

    if(currentDate.getHours() > 12){
        msg = msg + "PM";
    }
    else{
        msg = msg + "AM";
    }

    //처음 접속시 최초접속시간도 표시
    
    if(isitfirst){
        StudyStartTime = currentDate.getHours()*60*60+currentDate.getMinutes()*60+currentDate.getSeconds();
        startmsg = currentDate;
        hour = startmsg.getHours();
        isitfirst = false;
    }

    let pg = "";

    if(hour > 12){
        pg = pg +(hour-12)+"시";
    }
    else{
        pg = pg + hour + "시";
    }

    pg = pg + startmsg.getMinutes()+"분";
    pg = pg + startmsg.getSeconds()+"초";

    if(hour > 12){
        pg = pg + "PM";
    }
    else{
        pg = pg + "AM";
    }

    pos.innerHTML = "현재시간 : " + msg + "<br>" + 
                    "시작시간 : " + pg + "<br>" +
                    "학습시간 : " + tempstring;

    setTimeout(getCurrentTime,1000);
}