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
        minesCoordinates: [],
        playField: [],
        generatePlayField: function () {
            this.generateMines();
            for (let i = 0; i < this.columns; i++) {
                this.playField[i] = [];
                for (let j = 0; j < this.rows; j++) {
                    if (!this.checkRepeatMine([i, j], this.minesCoordinates)) {
                        this.playField[i].push(9);
                        continue;
                    }
                    this.playField[i].push(0);
                }
            }
            this.generateNumbers();
            return;
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
            return mineCollection;
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
                for (let j = xMinePos - 1; j < xMinePos + 2; j++) {
                    for (let k = yMinePos - 1; k < yMinePos + 2; k++) {
                        if (j < 0 || j > this.columns - 1 || k < 0 || k > this.rows - 1) {
                            continue;
                        }
                        if (!this.checkRepeatMine([j, k], this.minesCoordinates)) {
                            continue;
                        }
                        this.playField[j][k]++
                    }
                }
            }
        }
    }
    return gameState;
}

const state = newGame();
state.generatePlayField();
console.log(state.minesCoordinates);
console.log(state.playField)

//RENDERS / VIEWS
function render() {
    for (let i = 0; i < state.playField.length; i++) {
        let columnDiv = document.createElement('div')
        columnDiv.classList.add('column');
        for (let j = 0; j < state.playField[i].length; j++) {
            let gridCell = document.createElement('div');
            gridCell.classList.add('cell');
            gridCell.classList.add('cellHidden');
            if (state.playField[i][j] === 9) {
                gridCell.classList.add('mines');
            }
            else if (state.playField[i][j] > 0) {
                gridCell.innerText = `${state.playField[i][j]}`;
                gridCell.classList.add('number');
            }
            else {
                gridCell.classList.add('empty');
            }
            columnDiv.appendChild(gridCell);
        }
        appElement.appendChild(columnDiv);
    }
}
render();
//EVENTS /CONTROLLERS

appElement.addEventListener('click', function (event) {
    if (event.target.classList.contains('flag')) {

    }
    else if (event.target.classList.contains('mines')) {
        appElement.style.display = 'none';
    }
    else if (event.target.classList.contains('number')) {

    }
    else {

    }
})

appElement.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    event.target.classList.toggle('flag');
})