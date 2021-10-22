import BLOCKS from "./blocks.js";

//DOM
const playground = document.querySelector(".playground > ul");
const gametext = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score") 
const gameRetry = document.querySelector(".game-text > button")

//SETTING
const ROW = 20;
const COLS = 10;

//valiables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;


const movingItem = {
    type: "",
    direction : 0,
    top : 0,
    left :0,
} 

init()


//FUNCITION
function init(){
    tempMovingItem = {...movingItem};
    for (let i=0; i<ROW; i++){
        prependNewLine()
    }
    generateNewBlock()
}

function prependNewLine(){
    const li = document.createElement("li")
    const ul = document.createElement("ul");
    for (let j=0; j<COLS; j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}

function renderBlocks(movetype=""){
    const {type, direction,top, left} = tempMovingItem;
    const movingblock = document.querySelectorAll(".moving");
    movingblock.forEach(moving => {
        moving.classList.remove(type,"moving");
    })
    
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1]+ top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable){
            target.classList.add(type, "moving");
        } else{
            tempMovingItem = {...movingItem}
            if(movetype === 'retry'){
                clearInterval(downInterval)
                ShowGameOverText()
            }
            setTimeout(() => {
                renderBlocks('retry');
                if(movetype === "top"){
                    seizeblock();
                }
            },0)
            return true
        }
    });
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

function seizeblock(){
    const movingblock = document.querySelectorAll(".moving");
    movingblock.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}

function checkMatch(){

    const childNodes = playground.childNodes;
    childNodes.forEach(child =>{
        let matched = true;
        child.children[0].childNodes.forEach(li =>{
            if(!li.classList.contains("seized")){
                matched = false
            }
        })
        if (matched){
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerHTML = score;
            duration += 10;
            console.log(duration)
        }
    })
    generateNewBlock()
}

function generateNewBlock(){
    clearInterval(downInterval)
    downInterval = setInterval(() => {
        moveblock('top', 1)
    }, duration);



    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random()* blockArray.length)

    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0
    tempMovingItem = {...movingItem}
    renderBlocks()
}

function checkEmpty(target) {
    if(!target || target.classList.contains("seized")) {
        return false;
    }
    return true
}

function moveblock(movetype, amount) {
    tempMovingItem[movetype] += amount;
    renderBlocks(movetype);
}

function changedirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks()
}
function dropBlock(){
    clearInterval(downInterval)
    downInterval = setInterval(() => {
        moveblock('top',1)
    }, 10);
}

function ShowGameOverText(){
    gametext.style.display ="flex"
}

//event handling
document.addEventListener("keydown", e => {
    switch(e.keyCode){
        case 39:
            moveblock ("left", 1);
            break;
        default:
            break;
        case 37:
            moveblock("left", -1);
            break;
        case 40:
            moveblock("top", 1);
            break;
        case 38:
            changedirection();
            break;
        case 32:
            dropBlock();
    }
    //console.log(e)
})

gameRetry.addEventListener("click", () =>{
    playground.innerHTML = "";
    gametext.style.display = "none"
    init();
})