/* THIS IS A JAVASCRIPT FILE THAT HANDLES THE FUNCTIONALITY OF THE WEBPAGE DESCRIBED BY
    webpage.html AND style.css */

// Get all the relevent elements from the HTML
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

let walls = true // var for keeping track of whether walls are visible or not

/**
 * Turns the colour of the LED's back to black (no glow)
 */
function resetLEDs(){
    leftLed.classList.remove(leftLed.classList.item(1)); // remove whatever colour, glow class exists (if exists)
    rightLed.classList.remove(rightLed.classList.item(1));
}

/**
 * Turn off the LED
 */
function LEDoff(){
    resetLEDs()
}

/**
 * Turn on the LEDs (colour blue)
 */
function LEDblue(){
    resetLEDs()
    rightLed.classList.add("led-blue")
    leftLed.classList.add("led-blue")
}

/**
 * Turn on the LEDs (colour white)
 */
function LEDon(){
    resetLEDs()
    rightLed.classList.add("led-on")
    leftLed.classList.add("led-on")
}

/**
 * Turn on the LEDs (colour red)
 */
function LEDred(){
    resetLEDs()
    rightLed.classList.add("led-red")
    leftLed.classList.add("led-red")
}

/**
 * Turn on the LEDs (colour green)
 */
function LEDgreen(){
    resetLEDs()
    rightLed.classList.add("led-green")
    leftLed.classList.add("led-green")
}

/* A bunch of evene listeners for the buttons meant for debugging */
lightOn.addEventListener("click", LEDon)
lightRed.addEventListener("click", LEDred)
lightGreen.addEventListener("click", LEDgreen)
lightBlue.addEventListener("click", LEDblue)
/* THIS IS A JAVASCRIPT FILE THAT HANDLES THE FUNCTIONALITY OF THE WEBPAGE DEFINED
    BY webpage.html AND style.css 
*/

/**
 * Toggle the locked/unlocked animation on button click
 */
toggleLock.addEventListener("click", function() {
    lock.classList.toggle("toggle-lock")
});

/**
 * Handles functionality of the "wall" button, triggering a forward animation
 * if the walls are on and a backward animation if the walls are off
 */
toggleWall.addEventListener("click", function() {
    console.log(walls)
    if(walls){
        console.log("walls moving out") // just for debugging

        // trigger forward animations for all outside elements
        moveFrontWall() 
        moveSideWall()
        moveRoof()
    } else {
        console.log("walls moving in") // debugging

        // trigger backward animations for all outside elements
        moveFrontWallBack()
        moveSideWallback()
        moveRoofBack()
    }
    walls = !walls
  });

  /**
   * apply the relevant animations to the front wall and its children (lock icon and door)
   */
function moveFrontWall(){
    frontWall.classList.remove("move-front-wall-back");
    frontWall.classList.add("move-front-wall");
    door.classList.remove("move-front-wall-back");
    door.classList.add("move-front-wall");
    lock.classList.remove("move-lock-back")
    lock.classList.add("move-lock")
} 

/**
 * apply the relevant animations to the side wall
 */
function moveSideWall(){
    sideWall.classList.remove("move-side-wall-back");
    sideWall.classList.add("move-side-wall");
}

/**
 * apply the relevant animations to the roof
 */
function moveRoof(){
    roof.classList.remove("move-roof-back");
    roof.classList.add("move-roof");
}

/**
* (reverse )apply the relevant animations to the front wall and its children (lock icon and door)
*/
function moveFrontWallBack(){
    frontWall.classList.remove("move-front-wall");
    frontWall.classList.add("move-front-wall-back");
    door.classList.remove("move-front-wall");
    door.classList.add("move-front-wall-back");
    lock.classList.remove("move-lock")
    lock.classList.add("move-lock-back")
}

/**
 * (reverse) apply the relevant animations to the side wall
 */
function moveSideWallback(){
    sideWall.classList.remove("move-side-wall");
    sideWall.classList.add("move-side-wall-back");
}

/**
 * (reverse) apply the relevant animations to the roof
 */
function moveRoofBack(){
    roof.classList.remove("move-roof");
    roof.classList.add("move-roof-back");
}

