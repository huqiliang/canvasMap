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
  public oldScale: number = 1;
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
        height = element.height - window.innerWidth;
      }
    });
    if (this.x < -width) {
      this.x = -width;
    }
    if (this.y < -height) {
      this.y = -height;
    }
  }
  scaleBig() {
    let center = this.getCenter();
    this.scale *= this.scalStep;
    this.x = this.x + (center.x * this.scale - center.x * this.oldScale);
    this.y = this.y + (center.y * this.scale - center.y * this.oldScale);
    this.oldScale = this.scaleX;
    this.checkAround();
  }
  scaleSmall() {
    this.scale /= this.scalStep;
  }
  getCenter() {
    return {
      x: this.x - window.innerWidth / 2,
      y: this.y - window.innerHeight / 2,
    };
  }
  constructor(stage) {
    super();
    new AlloyFinger(this, {
      multipointStart: function() {
        this.scale = this.scaleX;
      },
      pinch: function(e) {
        this.scaleX = this.scaleY = this.scale * e.scale;
        stage.update();
      },
      pressMove: function(e) {
        e.preventDefault();
        this.x += e.deltaX;
        this.y += e.deltaY;
        this.checkAround();
        stage.update();
      },
    });
    stage.add(this);
    stage.update();
  }
}

class btn {
  btn: Element;
  constructor(id: string, stage: stage, contain: container) {
    this.btn = document.getElementById(id);
    this.btn.addEventListener('click', () => {
      if (id == 'big') {
        contain.scaleBig();
        stage.update();
      } else {
        contain.scaleSmall();
        stage.update();
      }
    });
  }
}
class load extends Loader {
  constructor(stage, container, src) {
    super();
    this.loadRes([
      {
        id: 'image',
        src,
      },
    ]);
    console.log('load');

    this.complete(() => {
      console.log('complete');

      const img = new Bitmap(this.get('image'));
      container.add(img);
      stage.update();
    });
  }
}
let st1 = new stage('#canvas');
let contain = new container(st1);
let big = new btn('big', st1, contain);
let small = new btn('small', st1, contain);

new load(st1, contain, '/dist/images/chooseBg.jpg');

// stage s = new stage();
// s.add(container);
// container = new container;
// container.add(new button)
// container.add(new button2)

// add(Button button) {
//   button.setContainer(this);

//   buttons.add(button);
// }

// button.addClickListener() {
//   void action() {
//     this.getContainer.scala()
//     this.getContainer.getStage.update()
//   }
// }
