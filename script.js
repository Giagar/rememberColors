/*NOTES: 
_seShow() to change the speed of the game
_seqMaker() to modify the win steps
*/

$(document).ready(function () {
  $(".wrong").css("display", "none");
  $(".youwin").css("display", "none");
  $(".strict").css("background-color", "red");
  $(".clrBtn").prop("disabled", true);

  function introOff() {
    var ioT = 0;
    var iofft = setInterval(function () {
      if (ioT === 4) {
        $(".intro").css("display", "");
        $(".intro").css("display", "none");
        clearInterval(iofft);
      } else {
        ioT++;
      }
    }, 1000);
  }

  introOff();

  //----------------variables
  var seqPlayer = []; //temporary storage for the seq made by the player
  var arrSimonSeq = []; //storage for the pc's sequence
  var numColors = ["red", "green", "blue", "yellow"];
  var cpix = 0; //checkPlayerSeq() index
  var matchesToWin = 20; //matches to win before youwin() is called
  var strictMode = 0; //even turned off, odd turned on
  var sndBlue = new Audio(
    (href = "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3")
  );
  var sndRed = new Audio(
    (href = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3")
  );
  var sndGreen = new Audio(
    (href = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3")
  );
  var sndYellow = new Audio(
    (href = "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
  );
  var bckClrs = {
    //not lit background-colors
    red: "rgba(159,15,23,1)",
    green: "rgba(0,167,64,1)",
    yellow: "rgba(204,167,7,1)",
    blue: "rgba(9,74,143,1)",
  };

  var litBckClrs = {
    //lit back colors
    red: "red",
    green: "rgba(0,227,64,1)",
    yellow: "yellow",
    blue: "blue",
  };

  var litBckClrsShadow = {
    //box shadow for lit colors
    red:
      "inset 0 0 90px 10px rgba(255,120,120,0.3) ,0 0 80px 0.5px rgba(230, 180, 180, 0.4)",
    green:
      "inset 0 0 90px 10px rgba(120,255,120,0.3) ,0 0 80px 0.5px rgba(180, 230, 180, 0.4)",
    yellow:
      "inset 0 0 90px 10px rgba(64,98,100,0.3) ,0 0 80px 0.5px rgba(64, 98, 100, 0.4)",
    blue:
      "inset 0 0 90px 10px rgba(120,120,255,0.3) ,0 0 80px 0.5px rgba(180, 180, 230, 0.4)",
  };

  //----------------functions
  //the button gets lit up  when player click on it
  function playerPush(y) {
    var ppt = 0;
    var pt = setInterval(function () {
      if (ppt === 8) {
        $("." + y + "").css("background-color", "" + bckClrs[y] + "");
        $("." + y + "").css("box-shadow", "none");
        clearInterval(pt);
      } else {
        $("." + y + "").css("background-color", "" + litBckClrs[y] + "");
        $("." + y + "").css("box-shadow", "" + litBckClrsShadow[y] + "");
        ppt++;
      }
    }, 50);
  }

  //if player guesses 20 seqs, he wins and the game restarts over
  function youwin() {
    console.log("youwin() has been called");
    var ywt = 0;
    var t = setInterval(function () {
      if (ywt === 4) {
        $(".youwin").css("display", "none");
        clearInterval(t);
        startReset();
      } else {
        $(".youwin").css("display", "");
        $(".youwin").css("display", "normal");
        ywt++;
      }
    }, 1000);
  }

  //random number: random activation of a button
  function randomColor() {
    var n = String(Math.random())[2];
    n = Math.floor(n / 3); //console.log(n);
    return numColors[n];
  }

  //creates the sequence
  function seqMaker() {
    if (arrSimonSeq.length === matchesToWin) {
      youwin();
    } else {
      arrSimonSeq.push(randomColor());
      $(".display").html(arrSimonSeq.length);
      console.log("seqMaker arrSimonSeq: ", arrSimonSeq);
    }
  }

  //turn on the color of the button
  function buttonOn(y) {
    var ix = 0;
    var tx = setInterval(function () {
      if (ix === 1) {
        $("." + y + "").css("background-color", bckClrs[y]);
        $("." + y + "").css("box-shadow", "none");
        clearInterval(tx);
      } else {
        $("." + y + "").css("background-color", "" + litBckClrs[y] + "");
        $("." + y + "").css("box-shadow", "" + litBckClrsShadow[y] + "");
        switch (y) {
          case "red":
            sndRed.play();
            break;
          case "blue":
            sndBlue.play();
            break;
          case "green":
            sndGreen.play();
            break;
          case "yellow":
            sndYellow.play();
            break;
        }
        ix++;
      }
    }, 500);
  }

  //read the seq and activate the buttons
  function seqShow() {
    var i = 0;
    var t = setInterval(function () {
      if (i === arrSimonSeq.length) {
        $("button").prop("disabled", false);
        clearInterval(t);
      } else {
        $("button").prop("disabled", true);
        buttonOn(arrSimonSeq[i]);
        i++;
      }
    }, 1200);
  }

  //the page wrong appears when player make an error in the sequence
  function wrong() {
    var wt = 0;
    $(".wrong").css("display", "");
    $(".wrong").css("display", "normal");
    var t = setInterval(function () {
      if (wt === 1) {
        $(".wrong").css("display", "none");
        clearInterval(t);
      } else {
        wt++;
      }
    }, 700);
  }

  //if strictMode is odd or even
  function strictM() {
    if (strictMode % 2 === 0) {
      //if turned off
      seqPlayer = [];
      seqShow();
    } else {
      //if strictMode on
      startReset();
    }
  }

  //check the player seq
  function checkPlayerSeq() {
    if (seqPlayer.length < arrSimonSeq.length) {
      //if player's sequence not completed yet
      if (seqPlayer[cpix] === arrSimonSeq[cpix]) {
        //if player is right
        cpix++;
        console.log(cpix);
        return true;
      } else {
        //if player is wrong
        console.log("cPS: wrong");
        wrong();
        strictM();
        cpix = 0;
      }
    } else if (seqPlayer.length === arrSimonSeq.length) {
      //if player's sequence is completed
      if (seqPlayer[cpix] === arrSimonSeq[cpix]) {
        //if right
        if (arrSimonSeq.length === matchesToWin) {
          //if it's the last match before youwin()
          youwin();
        } else {
          console.log("checkPlayerSeq: ok");
          seqPlayer = [];
          cpix = 0;
          play();
        }
      } else {
        //if wrong
        console.log("cPS: wrong");
        wrong();
        strictM();
        cpix = 0;
      }
    } else {
      //in case of error
      console.log("error");
      startReset();
    }
  }

  //structure
  function play() {
    seqMaker();
    seqShow();
  }

  function startReset() {
    $(".display").empty();
    arrSimonSeq = [];
    seqPlayer = [];
    console.log("start/reset: ", arrSimonSeq, seqPlayer);
    play();
  }

  //-------buttons
  $(".start").click(startReset);

  $(".blue").click(function () {
    playerPush("blue");
    sndBlue.play();
    seqPlayer.push("blue");
    console.log("secPlayer array: ", seqPlayer);
    checkPlayerSeq();
  });

  $(".red").click(function () {
    playerPush("red");
    sndRed.play();
    seqPlayer.push("red");
    console.log("spc: ", seqPlayer);
    checkPlayerSeq();
  });

  $(".green").click(function () {
    playerPush("green");
    sndGreen.play();
    seqPlayer.push("green");
    console.log("spc: ", seqPlayer);
    checkPlayerSeq();
  });

  $(".yellow").click(function () {
    playerPush("yellow");
    sndYellow.play();
    seqPlayer.push("yellow");
    console.log("spc: ", seqPlayer);
    checkPlayerSeq();
  });

  $(".strict").click(function () {
    strictMode++;
    console.log("strictMode: ", strictMode);
    if (strictMode % 2 === 0) {
      $(".strict").css("background-color", "red");
    } else {
      $(".strict").css("background-color", "green");
    }
  });
});
