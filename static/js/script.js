const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 100;

ctx.lineWidth = 3;
ctx.lineCap = "round";
ctx.strokeStyle = "#000";

let drawing = false;
let paths = [];
let redoStack = [];
let lastX = 0, lastY = 0;

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mousemove", draw);

// Menambahkan event untuk touchscreen
canvas.addEventListener("touchstart", (e) => startDraw(e.touches[0]));
canvas.addEventListener("touchend", stopDraw);
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault(); // Mencegah scroll saat menggambar
  draw(e.touches[0]);
});

function startDraw(event) {
  drawing = true;
  ctx.beginPath();
  paths.push([]);
  redoStack = [];

  const { x, y } = getMousePos(event);
  lastX = x;
  lastY = y;
}

function stopDraw() {
  drawing = false;
  ctx.closePath();
}

function draw(event) {
  if (!drawing) return;

  const { x, y } = getMousePos(event);

  paths[paths.length - 1].push({
    x,
    y,
    color: ctx.strokeStyle,
    size: ctx.lineWidth,
  });

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  lastX = x;
  lastY = y;
}

// Fungsi mendapatkan posisi mouse/touch dengan akurat
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height),
  };
}

// Pilihan Warna
document.getElementById("colorPicker").addEventListener("change", (e) => {
  ctx.strokeStyle = e.target.value;
});

// Pilihan Ketebalan Kuas
document.getElementById("brushSize").addEventListener("input", (e) => {
  ctx.lineWidth = e.target.value;
});

// Eraser
document.getElementById("eraser").addEventListener("click", () => {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 20;
});

// Undo
document.getElementById("undo").addEventListener("click", () => {
  if (paths.length > 0) {
    redoStack.push(paths.pop());
    redraw();
  }
});

// Redo
document.getElementById("redo").addEventListener("click", () => {
  if (redoStack.length > 0) {
    paths.push(redoStack.pop());
    redraw();
  }
});

// Clear Canvas
document.getElementById("clear").addEventListener("click", () => {
  paths = [];
  redoStack = [];
  redraw();
});

// Simpan Gambar
document.getElementById("save").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// Fungsi untuk menggambar ulang
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paths.forEach((path) => {
    if (path.length === 0) return;

    ctx.beginPath();
    ctx.strokeStyle = path[0].color;
    ctx.lineWidth = path[0].size;

    ctx.moveTo(path[0].x, path[0].y);
    path.forEach((point, index) => {
      if (index > 0) {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    ctx.closePath();
  });
}
