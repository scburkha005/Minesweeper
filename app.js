// function newGame () {
//     let game = {
//         mineCount: 40,
//         minesCoordinates: [],
//         generateMines: function() {
//             let mineCollection = [];
//             while (mineCollection.length < this.mineCount) {
//                 let minePosition = [];
//                 for (let j = 0; j < 2; j++) {
//                     let randomPosition = Math.floor(Math.random() * 16);
//                     minePosition.push(randomPosition);
//                 }
//                 if (this.checkRepeatMine(minePosition, mineCollection)) {
//                     mineCollection.push(minePosition);
//                 }
//             }
//             this.minesCoordinates = mineCollection
//             return mineCollection;
//         },
//         checkRepeatMine: function(specificMine, allMines) {
//             let isUnique = true;
//             for (let i = 0; i < allMines.length; i++) {
//                 if (specificMine[0] === allMines[i][0] && specificMine[1] === allMines[i][1]) {
//                     isUnique = false;
//                 }
//             }
//             return isUnique;
//         },
//         placeMines: function() {
//             for (let i = 0; i < this.minesCoordinates.length; i++) {
//                 let minePosition = this.minesCoordinates[i];
//                 let minePlacement = columnCollection[minePosition[0]].children[minePosition[1]];
//                 minePlacement.classList.add('mines');
//             }
//         }
//     }
//     return game;
// }

// const columnCollection = document.getElementsByClassName('column');
// console.log(columnCollection);


//initialize game
// let game = newGame();
// let mineArray = game.generateMines();
// console.log(mineArray);

// //add mines to the playfield
// for (let i = 0; i < mineArray.length; i++) {
//     let minePosition = mineArray[i];
//     let minePlacement = columnCollection[minePosition[0]].children[minePosition[1]];
//     // console.log(columnArray);
//     minePlacement.classList.add('mines');
//}
//add numbers to playfield
// for (let i = 0; i < columnCollection.length; i++) {
//     for (let j = 0; j < columnCollection[i].children.length; j++) {
//         if (columnCollection[i].children[j].classList.contains('mines')) {
//             for (let k = i - 1; k < i + 2; k++) {
//                 for (let l = j - 1; l < j + 2; l++) {
//                     if (k < 0 || k > 15 || l < 0 || l > 15) {
//                         continue;
//                     }
//                     console.log('x value', k, 'y value', l);
//                     if (columnCollection[k].children[l].classList.contains('mines')) {
//                         continue;
//                     }
//                     columnCollection[k].children[l].innerText = Number(columnCollection[k].children[l].innerText) + 1;
//                 }
//             }
//         }
//     }
// }
//test section
// columnCollection[0].children[0].innerText = Number(columnCollection[0].children[0].innerText) + 1
// console.log(columnCollection.length)

//M-V-C

//STATE / MODEL
const appElement = document.getElementById('app');
function newGame () {
    let gameState = {
        mineCount: 40,
        rows: 16,
        columns: 16,
        alive: true,
        minesCoordinates: [],
        playField: [],
        generatePlayField: function () {
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
                    //omit center position
                    if (!this.checkRepeatMine([i, j], [[xPosition, yPosition]])) {
                        continue;
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

//RENDERS / VIEWS
function render() {
    appElement.innerHTML = '';
    //Render initial playfield
    for (let i = 0; i < state.playField.length; i++) {
        let columnDiv = document.createElement('div')
        columnDiv.classList.add('column');
        columnDiv.style.height = `${state.rows + 2}rem` 
        for (let j = 0; j < state.playField[i].length; j++) {
            let gridCell = document.createElement('div');
            gridCell.classList.add('cell');
            if (state.playField[i][j].isFlagged === true) {
                gridCell.classList.add('flag');
            }
            else if (state.playField[i][j].isMine === true) {
                gridCell.classList.add('mines');
            }
            else if (state.playField[i][j].number > 0) {
                gridCell.innerText = `${state.playField[i][j].number}`;
                gridCell.classList.add('number');
            }
            else {
                gridCell.classList.add('empty');
            }
            if (state.playField[i][j].isHidden === true) {
                gridCell.classList.add('cellHidden');
            }
            else {
                gridCell.classList.add('cellOpen');
            }
            columnDiv.appendChild(gridCell);
        }
        appElement.appendChild(columnDiv);
    }
    //Reset Button
    const resetButton = document.createElement('button');
    const buttonContainer = document.createElement('div');
    // let resetContainer = document.getElementsByClassName('buttoncontainer');
    // resetContainer[0].innerHTML = '';
    resetButton.classList.add('reset');
    buttonContainer.classList.add('buttoncontainer');
    resetButton.innerText = 'Reset';
    appElement.appendChild(buttonContainer);
    buttonContainer.appendChild(resetButton);
    //DOM Elements
    const columnElem = document.getElementsByClassName('column');

    //Player action results
    if (state.playField.alive === false) {
        for (let i = 0; i < columnElem.length; i++) {
            columnElem[i].style.display = 'none';
        }
    }
}
render();
//EVENTS /CONTROLLERS

appElement.addEventListener('click', function (event) {
    let xCoord = Array.from(this.children).indexOf(event.target.parentElement);
    let yCoord = Array.from(this.children[xCoord].children).indexOf(event.target);
    console.log("x value: ", xCoord, "y value: ", yCoord);
    
    
    state.playField;
    console.log(event.target);
    //reset click
    if (event.target.classList.contains('reset')) {
        state = newGame();
        state.generatePlayField();
    }
    else if (state.playField[xCoord][yCoord].isFlagged === true) {

    }
    else if (state.playField[xCoord][yCoord].isMine === true) {
        state.playField.alive = false;
    }
    else if (state.playField[xCoord][yCoord].number > 0) {
        state.playField[xCoord][yCoord].isHidden = false;
    }
    else {
        let array = state.generate3by3Grid([xCoord, yCoord]);
        console.log(array);
    }
    render();
})
//Flag toggle
appElement.addEventListener('contextmenu', function (event) {
    let xCoord = Array.from(this.children).indexOf(event.target.parentElement);
    let yCoord = Array.from(this.children[xCoord].children).indexOf(event.target);
    if (state.playField[xCoord][yCoord].isFlagged === false) {
        state.playField[xCoord][yCoord].isFlagged = true;
    }
    else {
        state.playField[xCoord][yCoord].isFlagged = false;
    }
    console.log(state.playField)
    console.log("x value: ", xCoord, "y value: ", yCoord);

    event.preventDefault();
    render();
})
