const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener("resize", () => {
  window.location.reload();
});

// global functions:
function getPercentage(original, percent) {
  return (original * percent) / 100;
}

// global variables:
const PLAYER_RADIUS = ((canvas.width + canvas.height) / 2) * 0.03;
const ENEMY_SPAWN_RATE = 0.4;

// player:
const playerInitPos = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

const player = new Player(playerInitPos, PLAYER_RADIUS, "blue");

player.show();

// move player:
addEventListener("keypress", (event1) => {
  // up:
  if (event1.key.toLowerCase() === "w") {
    player.steering(0, -1);

    // down:
  } else if (event1.key.toLowerCase() === "s") {
    player.steering(0, 1);

    // left:
  } else if (event1.key.toLowerCase() === "a") {
    player.steering(-1, 0);

    // right:
  } else if (event1.key.toLowerCase() === "d") {
    player.steering(1, 0);

    // stop movement:
  } else if (event1.key.toLowerCase() === " ") {
    player.steering(0, 0);
  }
});

// projectile:
const projectiles = [];

// shoot projectile on click:
addEventListener("click", (event) => {
  //   const dist = Math.hypot(
  //     player.pos.x - event.clientX,
  //     player.pos.y - event.clientY
  //   );

  //   if (dist <= player.stats.visualRange) {
  if (player.bag.mag <= 3) {
    setTimeout(() => {
      player.bag.mag = 10;
    }, 3000);
  }

  if (player.bag.mag) {
    const projectileInitPos = {
      ...player.pos,
    };
    const angle = Math.atan2(
      event.clientY - player.pos.y,
      event.clientX - player.pos.x
    );

    const velocity = {
      x: Math.cos(angle) * player.stats.projectileSpeed,
      y: Math.sin(angle) * player.stats.projectileSpeed,
    };

    for (let i = 0; i < player.stats.projectileCount; i++) {
      setTimeout(() => {
        projectiles.push(
          new Projectile(projectileInitPos, 3, "rgba(100, 150, 255)", velocity)
        );
        player.bag.mag--;
      }, 100 * i);
    }
  }
  //   }
});

// enemies:
const enemies = [];

function spawnEnemies() {
  setInterval(() => {
    const radius =
      Math.random() * (player.radius * 1.5 - player.radius / 2) +
      player.radius / 2;
    const color = "rgba(255, 100, 150)";
    let enemyInitPos = {};

    if (Math.random() <= 0.5) {
      enemyInitPos = {
        x: Math.random() <= 0.5 ? 0 - radius : canvas.width + radius,
        y: Math.random() * canvas.height,
      };
    } else {
      enemyInitPos = {
        x: Math.random() * canvas.width,
        y: Math.random() <= 0.5 ? 0 - radius : canvas.height + radius,
      };
    }

    const angle = Math.atan2(
      player.pos.y - enemyInitPos.y,
      player.pos.x - enemyInitPos.x
    );

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(enemyInitPos, radius, color, velocity));
  }, 1000 / ENEMY_SPAWN_RATE);
}

// animate:
function handlePlayer() {
  player.update();
}

function handleProjectiles() {
  projectiles.forEach((projectile, index) => {
    // edge detection:
    if (
      projectile.pos.x < 0 - projectile.radius ||
      projectile.pos.x > canvas.width + projectile.radius ||
      projectile.pos.y < 0 - projectile.radius ||
      projectile.pos.y > canvas.height + projectile.radius
    ) {
      projectiles.splice(index, 1);
    }

    projectile.update();
  });
}

function handleEnemies() {
  enemies.forEach((enemy, enemyIndex) => {
    // collision detection:
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(
        projectile.pos.x - enemy.pos.x,
        projectile.pos.y - enemy.pos.y
      );

      if (dist <= enemy.radius) {
        setTimeout(() => {
          if (enemy.stats.health > 0) {
            enemy.stats.health -= projectile.stats.damage;
            enemy.stats.health =
              enemy.stats.health <= 0 ? "dead" : enemy.stats.health;
            projectiles.splice(projectileIndex, 1);
          }

          if (enemy.stats.health === "dead") {
            enemies.splice(enemyIndex, 1);
            projectiles.splice(projectileIndex, 1);
          }
        }, 0);
      }
    });

    // edge detection:
    if (
      enemy.pos.x < 0 - enemy.radius * 2 ||
      enemy.pos.x > canvas.width + enemy.radius * 2 ||
      enemy.pos.y < 0 - enemy.radius * 2 ||
      enemy.pos.y > canvas.height + enemy.radius * 2
    ) {
      enemies.splice(enemyIndex, 1);
    }

    // velocity recalculation:
    const angle = Math.atan2(
      player.pos.y - enemy.pos.y,
      player.pos.x - enemy.pos.x
    );
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemy.update();
    enemy.velocity = { ...velocity };
  });
}

// animation loop:
function animate() {
  c.fillStyle = "rgba(0, 0, 0)";
  c.globalAlpha = 0.5;
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.globalAlpha = 1;

  handleProjectiles();
  handleEnemies();
  handlePlayer();

  requestAnimationFrame(animate);
}

animate();
spawnEnemies();
