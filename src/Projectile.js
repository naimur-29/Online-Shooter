class Projectile {
  constructor(pos, radius, color, velocity) {
    this.pos = { ...pos };
    this.radius = radius;
    this.color = color;
    this.stats = {
      damage: 1,
    };
    this.velocity = { ...velocity };
  }

  show() {
    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    // update position:
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;

    // redraw the instance:
    this.show();
  }
}
