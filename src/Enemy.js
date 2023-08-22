class Enemy {
  constructor(pos, radius, color, velocity) {
    this.pos = { ...pos };
    this.radius = radius;
    this.color = color;
    this.stats = {
      health:
        this.radius > PLAYER_RADIUS
          ? Math.ceil(Math.random() * 4)
          : Math.ceil(Math.random() * 2),
    };
    this.velocity = { ...velocity };
  }

  show() {
    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
    c.globalAlpha = 0.25 + 1 / (5 - this.stats.health);
    c.fillStyle = this.color;
    c.fill();
    c.fillStyle = "rgba(255, 200, 250)";
    c.font = this.radius + "px Comic Sans MS";
    c.textAlign = "center";
    c.fillText(this.stats.health, this.pos.x, this.pos.y + 9);
    c.globalAlpha = 1;
  }

  update() {
    // update position:
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;

    // redraw the instance:
    this.show();
  }
}
