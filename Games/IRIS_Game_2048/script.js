function GameManager(t, e, i) {
  this.size = t, this.inputManager = new e, this.actuator = new i, this.startTiles = 2, this.inputManager.on("move", this.move.bind(this)), this.inputManager.on("restart", this.restart.bind(this)), this.setup()
}

function Grid(t) {
  this.size = t, this.cells = [], this.build()
}

function HTMLActuator() {
  this.tileContainer = document.getElementsByClassName("tile-container")[0], this.scoreContainer = document.getElementsByClassName("score-container")[0], this.messageContainer = document.getElementsByClassName("game-message")[0], this.score = 0
}

function KeyboardInputManager() {
  this.events = {}, this.listen()
}

function Tile(t, e) {
  this.x = t.x, this.y = t.y, this.value = e || 2, this.previousPosition = null, this.mergedFrom = null
}
document.addEventListener("DOMContentLoaded", function() {
  window.requestAnimationFrame(function() {
      new GameManager(4, KeyboardInputManager, HTMLActuator)
  })
}), GameManager.prototype.restart = function() {
  this.actuator.restart(), this.setup()
}, GameManager.prototype.setup = function() {
  this.grid = new Grid(this.size), this.score = 0, this.over = !1, this.won = !1, this.addStartTiles(), this.actuate()
}, GameManager.prototype.addStartTiles = function() {
  for (var t = 0; t < this.startTiles; t++) this.addRandomTile()
}, GameManager.prototype.addRandomTile = function() {
  if (this.grid.cellsAvailable()) {
      var t = new Tile(this.grid.randomAvailableCell(), .9 > Math.random() ? 2 : 4);
      this.grid.insertTile(t)
  }
}, GameManager.prototype.actuate = function() {
  this.actuator.actuate(this.grid, {
      score: this.score,
      over: this.over,
      won: this.won
  })
}, GameManager.prototype.prepareTiles = function() {
  this.grid.eachCell(function(t, e, i) {
      i && (i.mergedFrom = null, i.savePosition())
  })
}, GameManager.prototype.moveTile = function(t, e) {
  this.grid.cells[t.x][t.y] = null, this.grid.cells[e.x][e.y] = t, t.updatePosition(e)
}, GameManager.prototype.move = function(t) {
  var e, i, n = this;
  if (!this.over && !this.won) {
      var o = this.getVector(t),
          r = this.buildTraversals(o),
          a = !1;
      this.prepareTiles(), r.x.forEach(function(t) {
          r.y.forEach(function(r) {
              if (e = {
                      x: t,
                      y: r
                  }, i = n.grid.cellContent(e)) {
                  var s = n.findFarthestPosition(e, o),
                      l = n.grid.cellContent(s.next);
                  if (l && l.value === i.value && !l.mergedFrom) {
                      var c = new Tile(s.next, 2 * i.value);
                      c.mergedFrom = [i, l], n.grid.insertTile(c), n.grid.removeTile(i), i.updatePosition(s.next), n.score += c.value, 2048 === c.value && (n.won = !0)
                  } else n.moveTile(i, s.farthest);
                  n.positionsEqual(e, i) || (a = !0)
              }
          })
      }), a && (this.addRandomTile(), this.movesAvailable() || (this.over = !0), this.actuate())
  }
}, GameManager.prototype.getVector = function(t) {
  return ({
      0: {
          x: 0,
          y: -1
      },
      1: {
          x: 1,
          y: 0
      },
      2: {
          x: 0,
          y: 1
      },
      3: {
          x: -1,
          y: 0
      }
  })[t]
}, GameManager.prototype.buildTraversals = function(t) {
  for (var e = {
          x: [],
          y: []
      }, i = 0; i < this.size; i++) e.x.push(i), e.y.push(i);
  return 1 === t.x && (e.x = e.x.reverse()), 1 === t.y && (e.y = e.y.reverse()), e
}, GameManager.prototype.findFarthestPosition = function(t, e) {
  var i;
  do t = {
      x: (i = t).x + e.x,
      y: i.y + e.y
  }; while (this.grid.withinBounds(t) && this.grid.cellAvailable(t));
  return {
      farthest: i,
      next: t
  }
}, GameManager.prototype.movesAvailable = function() {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable()
}, GameManager.prototype.tileMatchesAvailable = function() {
  for (var t, e = 0; e < this.size; e++)
      for (var i = 0; i < this.size; i++)
          if (t = this.grid.cellContent({
                  x: e,
                  y: i
              }))
              for (var n = 0; n < 4; n++) {
                  var o = this.getVector(n),
                      r = {
                          x: e + o.x,
                          y: i + o.y
                      },
                      a = this.grid.cellContent(r);
                  if (a && a.value === t.value) return !0
              }
  return !1
}, GameManager.prototype.positionsEqual = function(t, e) {
  return t.x === e.x && t.y === e.y
}, Grid.prototype.build = function() {
  for (var t = 0; t < this.size; t++)
      for (var e = this.cells[t] = [], i = 0; i < this.size; i++) e.push(null)
}, Grid.prototype.randomAvailableCell = function() {
  var t = this.availableCells();
  if (t.length) return t[Math.floor(Math.random() * t.length)]
}, Grid.prototype.availableCells = function() {
  var t = [];
  return this.eachCell(function(e, i, n) {
      n || t.push({
          x: e,
          y: i
      })
  }), t
}, Grid.prototype.eachCell = function(t) {
  for (var e = 0; e < this.size; e++)
      for (var i = 0; i < this.size; i++) t(e, i, this.cells[e][i])
}, Grid.prototype.cellsAvailable = function() {
  return !!this.availableCells().length
}, Grid.prototype.cellAvailable = function(t) {
  return !this.cellOccupied(t)
}, Grid.prototype.cellOccupied = function(t) {
  return !!this.cellContent(t)
}, Grid.prototype.cellContent = function(t) {
  return this.withinBounds(t) ? this.cells[t.x][t.y] : null
}, Grid.prototype.insertTile = function(t) {
  this.cells[t.x][t.y] = t
}, Grid.prototype.removeTile = function(t) {
  this.cells[t.x][t.y] = null
}, Grid.prototype.withinBounds = function(t) {
  return t.x >= 0 && t.x < this.size && t.y >= 0 && t.y < this.size
}, HTMLActuator.prototype.actuate = function(t, e) {
  var i = this;
  window.requestAnimationFrame(function() {
      i.clearContainer(i.tileContainer), t.cells.forEach(function(t) {
          t.forEach(function(t) {
              t && i.addTile(t)
          })
      }), i.updateScore(e.score), e.over && i.message(!1), e.won && i.message(!0)
  })
}, HTMLActuator.prototype.restart = function() {
  this.clearMessage()
}, HTMLActuator.prototype.clearContainer = function(t) {
  for (; t.firstChild;) t.removeChild(t.firstChild)
}, HTMLActuator.prototype.addTile = function(t) {
  var e = this,
      i = document.createElement("div"),
      n = t.previousPosition || {
          x: t.x,
          y: t.y
      };
  positionClass = this.positionClass(n);
  var o = ["tile", "tile-" + t.value, positionClass];
  this.applyClasses(i, o), i.textContent = t.value, t.previousPosition ? window.requestAnimationFrame(function() {
      o[2] = e.positionClass({
          x: t.x,
          y: t.y
      }), e.applyClasses(i, o)
  }) : t.mergedFrom ? (o.push("tile-merged"), this.applyClasses(i, o), t.mergedFrom.forEach(function(t) {
      e.addTile(t)
  })) : (o.push("tile-new"), this.applyClasses(i, o)), this.tileContainer.appendChild(i)
}, HTMLActuator.prototype.applyClasses = function(t, e) {
  t.setAttribute("class", e.join(" "))
}, HTMLActuator.prototype.normalizePosition = function(t) {
  return {
      x: t.x + 1,
      y: t.y + 1
  }
}, HTMLActuator.prototype.positionClass = function(t) {
  return "tile-position-" + (t = this.normalizePosition(t)).x + "-" + t.y
}, HTMLActuator.prototype.updateScore = function(t) {
  this.clearContainer(this.scoreContainer);
  var e = t - this.score;
  if (this.score = t, this.scoreContainer.textContent = this.score, e > 0) {
      var i = document.createElement("div");
      i.classList.add("score-addition"), i.textContent = "+" + e, this.scoreContainer.appendChild(i)
  }
}, HTMLActuator.prototype.message = function(t) {
  this.messageContainer.classList.add(t ? "game-won" : "game-over"), this.messageContainer.getElementsByTagName("p")[0].textContent = t ? "You win!" : "Game over!"
}, HTMLActuator.prototype.clearMessage = function() {
  this.messageContainer.classList.remove("game-won", "game-over")
}, KeyboardInputManager.prototype.on = function(t, e) {
  this.events[t] || (this.events[t] = []), this.events[t].push(e)
}, KeyboardInputManager.prototype.emit = function(t, e) {
  var i = this.events[t];
  i && i.forEach(function(t) {
      t(e)
  })
}, KeyboardInputManager.prototype.listen = function() {
  var t = this,
      e = {
          38: 0,
          39: 1,
          40: 2,
          37: 3,
          75: 0,
          76: 1,
          74: 2,
          72: 3
      };
  document.addEventListener("keydown", function(i) {
      var n = i.altKey || i.ctrlKey || i.metaKey || i.shiftKey,
          o = e[i.which];
      n || (void 0 !== o && (i.preventDefault(), t.emit("move", o)), 32 === i.which && t.restart.bind(t)(i))
  }), document.getElementsByClassName("retry-button")[0].addEventListener("click", this.restart.bind(this));
  var i = [Hammer.DIRECTION_UP, Hammer.DIRECTION_RIGHT, Hammer.DIRECTION_DOWN, Hammer.DIRECTION_LEFT];
  Hammer(document.getElementsByClassName("game-container")[0], {
      drag_block_horizontal: !0,
      drag_block_vertical: !0
  }).on("swipe", function(e) {
      e.gesture.preventDefault(), -1 !== (mapped = i.indexOf(e.gesture.direction)) && t.emit("move", mapped)
  })
}, KeyboardInputManager.prototype.restart = function(t) {
  t.preventDefault(), this.emit("restart")
}, Tile.prototype.savePosition = function() {
  this.previousPosition = {
      x: this.x,
      y: this.y
  }
}, Tile.prototype.updatePosition = function(t) {
  this.x = t.x, this.y = t.y
}, document.addEventListener("keydown", function(t) {
  var e = t.altKey || t.ctrlKey || t.metaKey || t.shiftKey,
      i = map[t.key] || map[t.code];
  e || (void 0 !== i && (t.preventDefault(), self.emit("move", i)), (" " === t.key || "Space" === t.code) && self.restart.bind(self)(t))
});