let url = 'https://google.com';
const windowWidth = window.windowWidth;
const windowHeight = window.windowHeight;

class domElement {
  constructor(x1,x2,y1,y2,height,width) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.height = height;
    this.width = width;
  }
}


function grabDomElem() {
  let elementArr = [];
  // let body = document.querySelector('body');
  let elements = document.querySelectorAll( 'body *');//:not(.victim)' );
  for (let i = 0; i < elements.length; i++) {
    let positionObj = elements[i].getBoundingClientRect();
    let x1 = positionObj.x; //left x
    let y1 = positionObj.y; //top y
    if (x1 === 0 && y1 === 0) continue; //this is probably a script tag or something
    if (positionObj.height === 0 || positionObj.width === 0) continue;
    let x2 = x1 + positionObj.width; //right x
    let y2 = y1 + positionObj.height; //bottom y
    elementArr.push(new domElement(x1,x2,y1,y2,positionObj.height,positionObj.width));
  }
  return elementArr;
}
// given a document element and the top and left positions will return an array of [x1,y1]
// we can then use 
function collided (domEl, top, left) {
  let right = left + 50;
  let bottom = top + 50;

  let collision = false;
  //collision from the side
  if (bottom >= domEl.y1 || top <= domEl.y2){
    //from the left
    if (right >= domEl.x1) collision = true;
    //from the right
    else if (left <= domEl.x2) collision = true;
  }
  //collision from sky or ground
  else if (left >= domEl.x1 || right <= domEl.x2) {
    //from the top
    if (bottom >= domEl.y1) collision = true;
    //from the bottom
    else if (top <= domEl.y2) collision = true;
  }
  collision = (collision) ? [domEl.x1,domEl.y1] : collision;
  return collision;
}

function turnCheckCollision(elementArr, head) {
  let victim;
  for (let i = 0; i < elementArr.length; i++) {
    let collision = collided(elementArr[i], head.top, head.left)
    if (collision) break;
  }
  victim = document.elementFromPoint(collision[0],collision[1]);
  victim.parentElement.removeChild(victim);//("class","victim");
}