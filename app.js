//M-V-C

//STATE / MODEL
const appElement = document.getElementById('app');
let checkedPositionCenter = [];

function reveal (position3by3) {
    for (let i = 0; i < position3by3.length; i++) {
        let currentX = position3by3[i][0];
        let currentY = position3by3[i][1];
        if (state.playField[currentX][currentY].isMine === false) {
            state.playField[currentX][currentY].isHidden = false;
            if (state.playField[currentX][currentY].number === 0 && state.checkRepeatMine([currentX, currentY], checkedPositionCenter)) {
                let affectedPositions = state.generate3by3Grid([currentX, currentY]);
                reveal(affectedPositions);
            }
        }
    }
}

function newGame () {
    let gameState = {
        rows: 25,
        columns: 40,
        mineCount: 0,
        alive: true,
        minesCoordinates: [],
        playField: [],
        generatePlayField: function () {
            this.mineCount = Math.floor(this.rows * this.columns * .15625);
            this.generateMines();
            for (let i = 0; i < this.columns; i++) {
                this.playField[i] = [];
                for (let j = 0; j < this.rows; j++) {
                    if (!this.checkRepeatMine([i, j], this.minesCoordinates)) {
                        this.playField[i].push({
                            isMine: true,
                            number: 0,
                            isFlagged: false,
                            isHidden: true
                        })
                        continue;
                    }
                    this.playField[i].push({
                        isMine: false,
                        number: 0,
                        isFlagged: false,
                        isHidden: true
                    })
                }
            }
            this.generateNumbers();
        },
        generateMines: function() {
            let mineCollection = [];
            while (mineCollection.length < this.mineCount) {
                let randomXPosition = Math.floor(Math.random() * this.columns);
                let randomYPosition = Math.floor(Math.random() * this.rows);
                let minePosition = [randomXPosition, randomYPosition];
                if (this.checkRepeatMine(minePosition, mineCollection)) {
                    mineCollection.push(minePosition);
                }
            }
            this.minesCoordinates = mineCollection
        },
        checkRepeatMine: function(specificMine, allMines) {
            let isUnique = true;
            for (let i = 0; i < allMines.length; i++) {
                if (specificMine[0] === allMines[i][0] && specificMine[1] === allMines[i][1]) {
                    isUnique = false;
                }
            }
            return isUnique;
        },
        generateNumbers: function () {
            for (let i = 0; i < this.minesCoordinates.length; i++) {
                let xMinePos = this.minesCoordinates[i][0];
                let yMinePos = this.minesCoordinates[i][1];
                let positionsAroundMine = this.generate3by3Grid([xMinePos, yMinePos]);
                for (let j = 0; j < positionsAroundMine.length; j++) {
                    let currentX = positionsAroundMine[j][0];
                    let currentY = positionsAroundMine[j][1];
                    if (!this.checkRepeatMine([currentX, currentY], this.minesCoordinates)) {
                        continue;
                    }
                    this.playField[currentX][currentY].number++;
                }
            }
        },
        generate3by3Grid: function (xyPosition) {
            let xPosition = xyPosition[0];
            let yPosition = xyPosition[1];
            let positionCollection = [];
            for (let i = xPosition - 1; i < xPosition + 2; i++) {
                for (let j = yPosition - 1; j < yPosition + 2; j++) {
                    if (i < 0 || i > this.columns - 1 || j < 0 || j > this.rows - 1) {
                        continue;
                    }
                    //log center position while ignoring mines
                    if (xPosition === i && yPosition === j) {
                        if (this.checkRepeatMine([i, j], this.minesCoordinates)) {
                            if (this.checkRepeatMine([i, j], checkedPositionCenter)) {
                                checkedPositionCenter.push([i, j]);
                            }
                        }
                    }
                    positionCollection.push([i, j]);
                }
            }
            return positionCollection;
        }
    }
    return gameState;
}

let state = newGame();
state.generatePlayField();
console.log("Mine coords: ", state.minesCoordinates);
console.log("Playfield: ", state.playField);

//A*
//

//RENDERS / VIEWS
function render() {
    appElement.innerHTML = '';
    //Render initial playfield
    let playfieldContainer = document.createElement('div');
    playfieldContainer.classList.add('playfieldContainer');
    for (let i = 0; i < state.playField.length; i++) {
        let columnDiv = document.createElement('div')
        columnDiv.classList.add('column');
        columnDiv.style.height = `${(state.rows / 16) + (state.rows * 1.5)} rem`;
        for (let j = 0; j < state.playField[i].length; j++) {
            let gridCell = document.createElement('div');
            gridCell.classList.add('cell');
            if (i === state.playField.length - 1) {
                gridCell.style.borderRight = '1px solid black';
            }
            if (state.playField[i][j].isHidden === true) {
                gridCell.classList.add('cellHidden');
            }
            else {
                gridCell.classList.add('cellOpen');
            }
            if (state.playField[i][j].isFlagged === true) {
                gridCell.classList.add('flag');
            }
            if (state.playField[i][j].isHidden === false) {
                if (state.playField[i][j].isMine === true) {
                    gridCell.classList.add('mines');
                }
                else if (state.playField[i][j].number > 0) {
                    gridCell.innerText = `${state.playField[i][j].number}`;
                    gridCell.classList.add('number');
                }
                else {
                    gridCell.classList.add('empty');
                }
            }
            columnDiv.appendChild(gridCell);
        }
        playfieldContainer.appendChild(columnDiv);
    }
    appElement.appendChild(playfieldContainer);
    
    //Reset Button
    const resetButton = document.createElement('button');
    const buttonContainer = document.createElement('div');
    resetButton.classList.add('reset');
    buttonContainer.classList.add('buttoncontainer');
    resetButton.innerText = 'Reset';
    playfieldContainer.appendChild(buttonContainer);
    
    //Mines left
    const mineCount = document.createElement('div');
    mineCount.classList.add('mineCount');
    mineCount.innerText = `${state.mineCount}`;
    buttonContainer.appendChild(mineCount);
    buttonContainer.appendChild(resetButton);
    
    //Timer
    // const timerElem = document.createElement('div');
    // timerElem.classList.add('timer');
    // buttonContainer.appendChild(timerElem);
    // setInterval(function() {
    //     let timer = 0;
    //     timer++
    //     timerElem.innerText = timer;
    // }, 1000);
    
    //Playfield container dynamic styling
    playfieldContainer.style.width = `${(state.columns * 1.5) + 3}rem`;
    playfieldContainer.style.height = `${(state.rows * 1.5) + 5}rem`;

}
render();
//EVENTS /CONTROLLERS
appElement.addEventListener('click', function (event) {
    let xCoord = Array.from(this.children[0].children).indexOf(event.target.parentElement);
    let yCoord = Array.from(this.children[0].children[xCoord].children).indexOf(event.target);
    console.log("x value: ", xCoord, "y value: ", yCoord);
    console.log(event.target);
    
    if (state.alive === true) {
        //reset click
        if (event.target.classList.contains('reset')) {
            state = newGame();
            state.generatePlayField();
            checkedPositionCenter = [];
        }
        else if (state.playField[xCoord][yCoord].isFlagged === true) {
    
        }
        else if (state.playField[xCoord][yCoord].isMine === true) {
            state.alive = false;
            for (let i = 0; i < state.minesCoordinates.length; i++) {
                let currentX = state.minesCoordinates[i][0];
                let currentY = state.minesCoordinates[i][1];
                if (state.playField[currentX][currentY].isFlagged === false){
                    state.playField[currentX][currentY].isHidden = false;
                }
            }
        }
        else if (state.playField[xCoord][yCoord].number > 0) {
            state.playField[xCoord][yCoord].isHidden = false;
        }
        else {
            let affectedPositions = state.generate3by3Grid([xCoord, yCoord]);
            console.log(checkedPositionCenter)
            reveal(affectedPositions);
        }
    }
    else {
        if (event.target.classList.contains('reset')) {
            state = newGame();
            state.generatePlayField();
            checkedPositionCenter = [];
        }
    }
    
    render();
})

//Flag toggle
appElement.addEventListener('contextmenu', function (event) {
    let xCoord = Array.from(this.children[0].children).indexOf(event.target.parentElement);
    let yCoord = Array.from(this.children[0].children[xCoord].children).indexOf(event.target);
    if (state.alive === true && state.playField[xCoord][yCoord].isHidden === true) {
        if (state.playField[xCoord][yCoord].isFlagged === false) {
            state.playField[xCoord][yCoord].isFlagged = true;
            state.mineCount--
        }
        else {
            state.playField[xCoord][yCoord].isFlagged = false;
            state.mineCount++
        }
    }
    console.log(state.playField)
    console.log("x value: ", xCoord, "y value: ", yCoord);
    event.preventDefault();
    render();
})
