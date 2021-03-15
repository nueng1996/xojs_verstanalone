

let tableCreate = (rowcol) => {
    let body = document.getElementsByTagName('body')[0];

    let oldtbl = document.getElementsByTagName('table')

    if (oldtbl.length !== 0) {

        body.removeChild(body.childNodes[body.childNodes.length - 1]);
    }
    let tbl = document.createElement('table');


    let numid = 1;
    for (let i = 0; i < rowcol; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < rowcol; j++) {

            let td = document.createElement('td');

            td.setAttribute("class", "cell");
            td.setAttribute("id", numid.toString());

            numid++;

            tr.appendChild(td)

        }
        tbl.appendChild(tr);

        tbl.style.marginLeft = rowcol * -55
    }

    body.appendChild(tbl)


}

let gentempArr = (rowcol) => {

    let ix = 0;
    var array = new Array(rowcol);
    for (var i = 0; i < rowcol; i++) {
        array[i] = new Array(rowcol);
        for (var j = 0; j < rowcol; j++) {
            array[i][j] = ix;
            ix++;
        }
    }

    return array;
}

let generateWins = (arr) => {
    let part1 = []
    let part2 = []
    let part3 = []
    let part4 = []
    let boolcheck = true;



    for (let i = 0; i < arr[0].length; i++) {
        let temp = []
        let temp2 = []
        for (let j = 0; j < arr[0].length; j++) {

            temp.push(arr[i][j])

            temp2.push(arr[j][i])


        }
        part1.push(temp)
        part2.push(temp2)
    }

    let tmprev = part2.reverse()
    let dis = arr.length;
    let realdis = 1;
    for (let i = 0; i < part1.length; i++) {
        for (let j = 0; j < part1.length; j++) {


            if (boolcheck && realdis === 1) {

                boolcheck = false
                realdis = -(dis - 1)


                part3.push(part1[i][j])
                part4.push(tmprev[i][j])

            } else {

                realdis++;
                if (realdis === 1) boolcheck = true

            }

        }
    }
    let all = [...part1, ...part2, part3, part4.reverse()]

    return all;

}

let genId = () => {
    let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    let uniqid = randLetter + Date.now();
    return uniqid
}

var history0fgame = {}

let game = (sizeTable,history0fgameid=null) => {

    
    if(history0fgameid !== null){

        sizeTable = history0fgame[history0fgameid].size

    }
    let gameid = genId()

  
    
    

    let table = Array.from(Array(sizeTable * sizeTable).keys());
    let player1 = "x";
    let player2 = "o";
    let checkTurn = true;
    const winPossiblePatterns = generateWins(gentempArr(sizeTable))

    const cells = document.querySelectorAll('.cell');

    let p1 = document.getElementById("player1name").value
    let p2 = document.getElementById("player2name").value

    history0fgame[gameid]= {
        steps:[],
        size:sizeTable,
        gameid:gameid,
        p1:p1,
        p2:p2
        
    }
    

    let btn = document.getElementById("playbtn");

  
   


    btn.innerHTML = 'play';



    document.querySelector(".gameover").style.display = "none";



    let replay = (player, cellId, username) => {

        

        let turn = [player, cellId, username]

        history0fgame[gameid].steps.push(turn)
        
        

    }


    let OnClickPlayer = (cell) => {
        
        if(typeof table[cell.target.id-1] !== "number") return
        if (checkTurn) {
            turn(cell.target.id, player1)
            checkTurn = false
        } else {
            turn(cell.target.id, player2)
            checkTurn = true
        }

    }

    let gameOver = (obj) => {

        for (let i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', OnClickPlayer, false);
        }


        btn.innerHTML = 'play again';

        let sc = document.getElementById("hsofp")

        for(let h in history0fgame){
            if(!document.getElementById(h)){
                let op = document.createElement("OPTION");
                op.setAttribute("id", h);
                op.value = h;
                op.innerHTML = h.toString()
    
                sc.appendChild(op)
            }
          
        }


        if (obj.tie) {

            document.querySelector(".gameover").style.display = "block";
            document.querySelector(".gameover .text").innerText = "Tie Game";

            return
        }

        document.querySelector(".gameover").style.display = "block";
        document.querySelector(".gameover .text").innerText = obj.winner === 'x' ? p1 + " Winner" : p2 + " winner";
    }

    let turn = (cellId, player) => {
        
        table[cellId - 1] = player;
        document.getElementById(cellId).innerText = player;
        username = player === 'x' ? p1 :  p2;
        replay(player,cellId,username)
        let gameEnd = checkWin(table, player)
        if (gameEnd !== null) gameOver(gameEnd)
    }

    let checkWin = (table, player) => {
        let winpattern = []
        let gameEnd = null

        

        if (table.filter(s => typeof s == 'number').length === 0) {

            gameOver({ tie: "true" })
        }

        for (const [i, value] of table.entries()) {
            if (value === player) winpattern.push(i)
        }


        for (let [index, win] of winPossiblePatterns.entries()) {

            let result = win.every(val => winpattern.includes(val));

            if (result) return { winner: player }

        }

        return gameEnd;



    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', OnClickPlayer, false);
    }


    let steps = ()=>{

        
     
        
        for (var i = 1; i <= history0fgame[history0fgameid].steps.length; i++) {
            (function (ind) {
                setTimeout(function () { 
                    
                    
                    turn(history0fgame[history0fgameid].steps[ind-1][1],history0fgame[history0fgameid].steps[ind-1][0])
                }, 1000 + (1000 * ind));
            })(i);
        }
        
    }

    if(history0fgameid !== null){
        p1 = history0fgame[history0fgameid].p1;
        p2 = history0fgame[history0fgameid].p2;

        steps()

        
    }


}


const play = () => {
    let sizeTable = document.getElementById("sizeTable").value;



    if (parseInt(sizeTable) < 3 || parseInt(sizeTable) % 2 === 0) {
        alert("minimum is 3 and must is a ood number [3,5,7]");
    }
    else {

        tableCreate(parseInt(sizeTable));
        game(sizeTable)
    }

}

const replayw = ()=>{

    let id = document.getElementById("hsofp").value;
    
    game(sizeTable=3,history0fgameid=id)

}


