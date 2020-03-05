const body = document.querySelector('body');
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
class Head {
  constructor(el) {
    let head = document.createElement("img");
    head.setAttribute("id", "head");
    head.src = chrome.runtime.getURL("yeetasaurus.png");
    this.elementArr = [];
    this.grabDomElem = this.grabDomElem.bind(this);
    this.collided = this.collided.bind(this);
    this.grabDomElem();
    this.node = head;
    this.currentDirection = 'right';
    this.SPEED = 400;
    el.appendChild(this.node);
    this.top = 0;
    this.left = 0;
    this.node.style.cssText = `top: ${this.top}px; left: ${this.left}px`;
    this.move = this.move.bind(this);
    setInterval(this.move, this.SPEED);
  }
  grabDomElem() {
    let elementArr = [];
    // let body = document.querySelector('body');
    let elements = document.querySelectorAll( 'body *:not(div):not(#head)');//:not(.victim)' );
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
    this.elementArr =  elementArr;
  }
  collided (domEl) {
    let top = this.top;
    let left = this.left;
    let right = left + 50;
    let bottom = top + 50;
    
    let collision = false;
    //collision from the side
    if ((bottom >= domEl.y1 && top <= domEl.y1) || (top <= domEl.y2 && bottom >= domEl.y2) || (top >= domEl.y1 && bottom <= domEl.y2)) {
      //from the center
      if (right <= domEl.x2 && left >= domEl.x1 ) {
        collision = true;
      }
      //from the right
      else if (left <= domEl.x2 && right >= domEl.x2) {
        collision = true;

      }
      // from the left
      else if (right >= domEl.x1 && left <= domEl.x1) {
        collision  = true;

      }
    }
    //collision from sky or ground
    else if ((right >= domEl.x1 && left <= domEl.x1) || (left <= domEl.x2 && right >= domEl.x2) || (left >= domEl.x1 && right <= domEl.x2)) {
    //(left >= domEl.x1 || right <= domEl.x2) {
      //from the center
      if (bottom <= domEl.y2 && top >= domEl.y1) {
        collision = true;

      }
      //from the top
      else if (top <= domEl.y1 && bottom >= domEl.y1) {
        collision = true;

      }
      // from the bottom
      else if (top <= domEl.y2 && bottom >= domEl.y2) {
        collision = true;

      }
    }

    collision = (collision) ? [domEl.x1,domEl.y1] : collision;
    return collision;
  }
  turnCheckCollision() {
    let victim;
    let collision;
    for (let i = 0; i < this.elementArr.length; i++) {
      collision = this.collided(this.elementArr[i])
      if (collision) break;
    }
    if (collision) {
      victim = document.elementFromPoint(collision[0],collision[1]);
      console.log(victim.id)
      let tempBody = document.querySelector('body');
      if (victim.id === 'head' || victim === tempBody) return;
      victim.parentElement.removeChild(victim);//("class","victim");
    }
    
  }
  move() {
    let direction = this.currentDirection;
    if (direction === 'right') {
        this.left += 50;
    }
    if (direction === 'left') {
      this.left -= 50;
    }
    if (direction === 'up') {
      this.top -= 50;
    }
    if (direction === 'down') {
      this.top += 50;
    }
    this.node.style.cssText = `top: ${this.top}px; left: ${this.left}px`;
    this.turnCheckCollision();
    this.grabDomElem();
  }
  
}
head = new Head(body);
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 37) {
    head.currentDirection = 'left';
  }
});
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 39) {
    head.currentDirection = 'right';
  }
});
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 38) {
    head.currentDirection = 'up';
  }
});
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 40) {
    head.currentDirection = 'down';
  }
});



