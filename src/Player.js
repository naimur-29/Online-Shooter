class Player {
  constructor(pos, radius, color) {
    this.pos = { ...pos };
    this.radius = radius;
    this.color = color;
    this.vel = {
      x: 0,
      y: 0,
    };

    this.stats = {
      projectileSpeed: 5,
      projectileCount: 1,
      visualRange: radius * 5,
      runningSpeed: 2,
    };

    this.bag = {
      mag: 10,
    };
  }

  steering(rateX, rateY) {
    this.vel = {
      x: rateX * this.stats.runningSpeed,
      y: rateY * this.stats.runningSpeed,
    };
  }

  show() {
    // draw player:
    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.globalAlpha = this.bag.mag ? 1 : 0.25;
    c.fill();
    c.fillStyle = "rgba(155, 250, 255)";
    c.font = this.radius + "px Comic Sans MS";
    c.textAlign = "center";
    c.fillText(this.bag.mag, this.pos.x, this.pos.y + 9);
    c.globalAlpha = 1;

    // draw player visual range:
    c.beginPath();
    c.arc(
      this.pos.x,
      this.pos.y,
      this.stats.visualRange,
      0,
      Math.PI * 2,
      false
    );
    c.strokeStyle = this.color;
    c.globalAlpha = 0.3;
    c.stroke();
    c.globalAlpha = 1;
    c.fillStyle = this.color;
    c.globalAlpha = 0.01;
    c.fill();
    c.globalAlpha = 1;

    // draw mag:
    c.beginPath();
    c.arc(
      this.pos.x,
      this.pos.y,
      this.radius + this.radius * 0.25,
      0,
      Math.PI * 2 * (this.bag.mag / 10),
      false
    );
    c.strokeStyle = this.color;
    c.lineWidth = 10;
    c.globalAlpha = this.bag.mag ? 0.5 : 0.25;
    c.stroke();
    c.lineWidth = 1;
  }

  update() {
    this.show();

    // add velocity:
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}
