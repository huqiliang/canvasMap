import * as AlloyFinger from './static/alloy_finger.js';
import { Stage, Bitmap, Loader, Container } from './static/alloy_paper.js';
import { ActiveSelection } from 'fabric/fabric-impl';

class stage extends Stage {
  constructor(canvas) {
    super(canvas);
    this.autoUpdate = false;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    console.log('stage');
  }
}

class container extends Container {
  public scalStep: number = 1.1;
  public scale: number = 1;
  private oldScale: number = 1;
  checkAround() {
    if (this.x > 0) {
      this.x = 0;
    }
    if (this.y > 0) {
      this.y = 0;
    }

    let width, height;
    this.children.forEach(element => {
      if (!!element.img) {
        width = element.width - window.innerWidth;
        height = element.height - window.innerHeight;
      }
    });
    if (this.x < -width) {
      this.x = -width;
    }
    if (this.y < -height) {
      this.y = -height;
    }
  }
  scaleBig(zoom?) {
    this.scale *= this.scalStep;
    this.scaleCommon();
  }
  scaleSmall(zoom?) {
    this.scale /= this.scalStep;
    this.scaleCommon();
  }

  private scaleCommon() {
    let center = this.getCenter();
    this.x = this.x + (center.x * this.scale - center.x * this.oldScale);
    this.y = this.y + (center.y * this.scale - center.y * this.oldScale);
    this.oldScale = this.scale;
    this.checkAround();
  }
  getCenter() {
    return {
      x: this.x - window.innerWidth / 2,
      y: this.y - window.innerHeight / 2,
    };
  }
  constructor() {
    super();
  }
}

class btn {
  btn: Element;
  click(fn) {
    this.btn.addEventListener('click', fn);
  }
  constructor(id: string) {
    this.btn = document.getElementById(id);
  }
}
class load extends Loader {
  constructor(src) {
    super();
    this.loadRes([
      {
        id: 'image',
        src,
      },
    ]);
  }
  getImg() {
    return new Bitmap(this.get('image'));
  }
}
let st1 = new stage('#canvas');
let contain = new container();

let big = new btn('big');

let small = new btn('small');
var ld = new load('/dist/images/chooseBg.jpg');
var mousex = 0;
var mousey = 0;
var oldZoom = 1;
new AlloyFinger(contain, {
  multipointStart: function(event) {
    st1.clear();
    mousex =
      (event.touches[0].pageX + event.touches[1].pageX) / 2 -
      this.x / this.scale;
    // alert(mousex);
    mousey =
      (event.touches[0].pageY + event.touches[1].pageY) / 2 -
      this.y / this.scale;
  },
  pinch: function(e) {
    // alert(this.scale);

    e.preventDefault();
    let zoom = e.zoom;
    this.scale = zoom;
    this.x -= mousex * (zoom - oldZoom);
    this.y -= mousey * (zoom - oldZoom);
    oldZoom = zoom;
    st1.update();
    this.checkAround();

    // oldZoom = zoom;
  },
  pressMove: function(e) {
    // console.log(st1);

    e.preventDefault();
    this.x += e.deltaX;
    this.y += e.deltaY;
    this.checkAround();
    st1.update();
  },
});

ld.complete(() => {
  let img = ld.getImg();
  contain.add(img);
  st1.update();
  console.log('Bb');
});

big.click(() => {
  contain.scaleBig();
  st1.update();
});
small.click(() => {
  contain.scaleSmall();
  st1.update();
});
console.log('Aa');

st1.add(contain);
st1.update();
