/**
 * 实现一个发射导弹的飞机
 *
 * @class Plane
 */
@setBullet(1)
class Plane {
  plane: any
  bullet: number = 0

  constructor(plane) {
    this.plane = plane
  }

  fire() {
    console.log('fire:', this.bullet)
  }
}

function setBullet(level) {
  return function (target) {
    target.bullet = level;
    return target;
  }
}

console.log(Plane.bullet)
