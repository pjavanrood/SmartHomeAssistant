const house = document.getElementById("house")
const frontWall = document.getElementById("front-wall")
const sideWall = document.getElementById("side-wall")
const roof = document.getElementById("roof")
const toggleWall = document.getElementById("wall-toggle")
const door = document.getElementById("door")
const toggleLock = document.getElementById("lock-toggle")
const lock = document.getElementById("lock-icon")
const leftLed = document.getElementById("led-left")
const rightLed = document.getElementById("led-right")
const lightOn = document.getElementById("light-on")
const lightRed = document.getElementById("light-red")
const lightGreen = document.getElementById("light-green")
const lightBlue = document.getElementById("light-blue")

let walls = true

function resetLEDs(){
    leftLed.classList.remove(leftLed.classList.item(1));
    rightLed.classList.remove(rightLed.classList.item(1));
}

function LEDoff(){
    resetLEDs()
}

function LEDblue(){
    resetLEDs()
    rightLed.classList.add("led-blue")
    leftLed.classList.add("led-blue")
}
function LEDon(){
    resetLEDs()
    rightLed.classList.add("led-on")
    leftLed.classList.add("led-on")
}

function LEDred(){
    resetLEDs()
    rightLed.classList.add("led-red")
    leftLed.classList.add("led-red")
}

function LEDgreen(){
    resetLEDs()
    rightLed.classList.add("led-green")
    leftLed.classList.add("led-green")
}

function lockDoor() {
    lock.classList.toggle("toggle-lock")
}



lightOn.addEventListener("click", LEDon)

lightRed.addEventListener("click", LEDred)

lightGreen.addEventListener("click", LEDgreen)

lightBlue.addEventListener("click", LEDblue)

toggleLock.addEventListener("click", function() {
    //lock.classList.toggle("toggle-lock")
    lockDoor();
});

toggleWall.addEventListener("click", function() {
    console.log(walls)
    if(walls){
        console.log("walls moving out")

        moveFrontWall()
        moveSideWall()
        moveRoof()
    } else {
        console.log("walls moving in")

        moveFrontWallBack()
        moveSideWallback()
        moveRoofBack()
    }
    walls = !walls
  });

function moveFrontWall(){
    frontWall.classList.remove("move-front-wall-back");
    frontWall.classList.add("move-front-wall");
    door.classList.remove("move-front-wall-back");
    door.classList.add("move-front-wall");
    lock.classList.remove("move-lock-back")
    lock.classList.add("move-lock")
} 

function moveSideWall(){
    sideWall.classList.remove("move-side-wall-back");
    sideWall.classList.add("move-side-wall");
}

function moveRoof(){
    roof.classList.remove("move-roof-back");
    roof.classList.add("move-roof");
}

function moveFrontWallBack(){
    frontWall.classList.remove("move-front-wall");
    frontWall.classList.add("move-front-wall-back");
    door.classList.remove("move-front-wall");
    door.classList.add("move-front-wall-back");
    lock.classList.remove("move-lock")
    lock.classList.add("move-lock-back")
}

function moveSideWallback(){
    sideWall.classList.remove("move-side-wall");
    sideWall.classList.add("move-side-wall-back");
}

function moveRoofBack(){
    roof.classList.remove("move-roof");
    roof.classList.add("move-roof-back");
}



export { LEDon, LEDoff, LEDred, LEDgreen, LEDblue, lockDoor }