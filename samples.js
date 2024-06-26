var randomArr = [];
var checkArr = [];
var score = 10;
window.onload = function () {
  restartEvent();
  randomNum();
  tagCreate();
  printPlag(score);
};
/*
  data-mine : 이 데이타가 마인이다.
  isMineCheck : 유저가 마인으로 체크했다.
  isclicked : 이미 한번이상 좌클릭해서 다시 못누르게 하는 변수
  data-minenum : 내 주변 마인 숫자.
*/
function printPlag(n) {
  document.querySelector("#score").innerText = n;
}

function randomNum() {
  for (var k = 0; k < 10; k++) {
    var value = Math.random();
    var result = Math.floor(value * 100); //0부터 99까지 난수 10개 생성.
    //중복값있으면
    if (randomArr.indexOf(result) > -1) k--;
    else randomArr.push(result);
  }
}

function tagCreate() {
  var app = document.querySelector("#app");

  for (var i = 0; i < 100; i++) {
    var div = document.createElement("div");
    div.setAttribute("id", "block" + i);
    div.setAttribute("class", "block");

    //지뢰 심기
    if (randomArr.indexOf(i) > -1) div.setAttribute("data-mine", true);
    else div.setAttribute("data-mine", false);
    div.setAttribute("isclicked", false);
    div.setAttribute("isminecheck", false);
    div.onmousedown = function () {
      var isClicked = event.srcElement.getAttribute("isclicked");
      if (isClicked == "false") {
        //이미 클릭됬다면 이벤트 아무것도 안탄다.
        mouseEvent(event);
      }
    };
    app.appendChild(div);
  }

  //만들고 나서 태그들이 가진 주변 마인수를 속성으로
  for (i = 0; i < 100; i++) {
    var div = document.querySelector("#block" + i);
    div.setAttribute("data-minenum", returnMineNum(div, false));
  }
}

function mouseEvent(event) {
  var btn = event.button;
  var block = event.srcElement;
  var isminecheck = event.srcElement.getAttribute("isminecheck"); //내가 마인으로 찍었다.
  var idNum = block.getAttribute("id").replace("block", "");
  if (btn != 0 && btn != undefined) {
    //우클릭
    //해당 배경이 깃발로
    if (isminecheck == "false") {
      //깃발등록(false)
      printPlag(--score);
      block.setAttribute(
        "style",
        "background-image:url('image/btnchecked.png');" +
          "background-repeat:no-repeat;" +
          "background-size:30px;"
      );
      block.setAttribute("isminecheck", "true");
      if (gameOverTest()) {
        alert("지뢰를 모두 찾았습니다. 축하합니다.");
      }
    } else {
      //깃발해제(true)
      printPlag(++score);
      block.setAttribute("style", "background-color:grey;");
      block.setAttribute("isminecheck", "false");
    }
  } else {
    //좌클릭
    block.setAttribute("isclicked", true);
    block.setAttribute("style", "background-color:#A9A9A9;");
    if (block.getAttribute("data-mine") == "true") {
      //지뢰 눌렀을때 로직

      block.setAttribute("style", "background-color:red;");
      allMineShow(block); //모든 지뢰 표시

      //게임 오버 및 재시작.
      setTimeout(function () {
        if (confirm("지뢰에 걸렸습니다. 다시하시겠습니까?"))
          document.querySelector("#restart").click();
        else {
          gameOver();
        }
      }, 100);
    } else {
      //지뢰아님
      //숫자 있는 경우
      var minenum = block.getAttribute("data-minenum");
      if (minenum > 0) block.innerText = minenum;
      //숫자 없는 경우.
      else {
        returnMineNum(block, true);
      }
    }
  }
}
//flag는 맨처음 div태그에 데이터를 초기화할때 flag타는 부분은 실행 안되게 하기 위함.
function returnMineNum(block, flag) {
  var result = 0;
  var id = block.getAttribute("id");
  id = id.replace("block", "");
  var me = parseInt(id);

  var upLineNum = me - 11; //10의자리가 하나 작아야함. 음수인지 파악.
  var meLineNum = me - 1; //10의자리가 같아야함.  me 값은 제외.
  var downLineNum = me + 9; //10의자리가 하나 커야함. 100이상이면 안됨.

  for (var i = 0; i < 3; i++) {
    //위쪽
    var isOverZero = upLineNum >= 0; // 0보다 커야되고
    var isUpLastCondition =
      Math.floor(me / 10) - Math.floor(upLineNum / 10) == 1; // me의 앞자리에서 upLineNum의 앞자리를 빼면 1 나와야한다.
    if (isOverZero && isUpLastCondition) {
      var nowUpBlock = document.querySelector("#block" + upLineNum);
      if (nowUpBlock.getAttribute("data-mine") == "true") {
        result++;
      }

      if (
        flag &&
        (nowUpBlock.getAttribute("data-minenum") == "0" ||
          nowUpBlock.getAttribute("data-mine") == "false")
      ) {
        var customEvent = document.createEvent("Event");
        customEvent.initEvent("mousedown", false, true);
        nowUpBlock.dispatchEvent(customEvent);
      }
    }

    //중간쪽
    var isNotMe = meLineNum != me;
    var isMeLastCondition =
      Math.floor(me / 10) - Math.floor(meLineNum / 10) == 0;
    if (isMeLastCondition && isNotMe) {
      var nowMeBlock = document.querySelector("#block" + meLineNum);
      if (nowMeBlock.getAttribute("data-mine") == "true") {
        result++;
      }

      if (
        flag &&
        (nowMeBlock.getAttribute("data-minenum") == "0" ||
          nowMeBlock.getAttribute("data-mine") == "false")
      ) {
        var customEvent = document.createEvent("Event");
        customEvent.initEvent("mousedown", false, true);
        nowMeBlock.dispatchEvent(customEvent);
      }
    }

    //아래쪽
    var isUnderHundred = downLineNum < 100;
    var isDownLastCondition =
      Math.floor(me / 10) - Math.floor(downLineNum / 10) == -1;
    if (isUnderHundred && isDownLastCondition) {
      var nowDownBlock = document.querySelector("#block" + downLineNum);
      if (nowDownBlock.getAttribute("data-mine") == "true") {
        result++;
      }

      if (
        flag &&
        (nowDownBlock.getAttribute("data-minenum") == "0" ||
          nowDownBlock.getAttribute("data-mine") == "false")
      ) {
        var customEvent = document.createEvent("Event");
        customEvent.initEvent("mousedown", false, true);
        nowDownBlock.dispatchEvent(customEvent);
      }
    }
    //증가
    upLineNum++;
    meLineNum++;
    downLineNum++;
  }
  return result;
}

function restartEvent() {
  document.querySelector("#restart").addEventListener("click", function () {
    var app = document.querySelector("#app");
    var appLength = app.childElementCount;
    for (var i = 0; i < appLength; i++) {
      app.removeChild(app.children[0]);
    }
    randomArr = [];
    randomNum();
    tagCreate();
    score = 10;
    printPlag(score);
  });
}

function gameOverTest() {
  var result = 0;
  for (var i = 0; i < randomArr.length; i++) {
    var id = "#block" + randomArr[i];
    if (document.querySelector(id).getAttribute("isminecheck") == "true") {
      result++;
    } else {
      return false;
    }
  }
  return result == 10;
}

function gameOver() {
  //모든 이벤트 회수
  for (var i = 0; i < 100; i++) {
    document.querySelector("#app").children[i].onmousedown = null;
  }
}
function allMineShow(clickedblock) {
  var block = document.querySelector("#app").children;
  for (var i = 0; i < block.length; i++) {
    if (block[i].getAttribute("data-mine") == "true") {
      //배경이미지 마인으로
      block[i].setAttribute(
        "style",
        "background-image:url('image/btnmine.png');" +
          "background-repeat:no-repeat;" +
          "background-size:30px;"
      );
    }
    if (block[i] == clickedblock) {
      clickedblock.setAttribute(
        "style",
        "background-image:url('image/btnclickmine.PNG');" +
          "background-repeat:no-repeat;" +
          "background-size:30px;"
      );
    }
  }
}
