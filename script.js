const GRID_SIZE = 10
const GRID_NUMBER = 30
const colors = ['red', 'green', 'blue', 'yellow', 'pink', 'purple', 'magenta', 'cyan'];


const field = Array(GRID_NUMBER).fill(Array(GRID_NUMBER).fill(false));


const drawGrid = function(ctx) {
    for (let i = 0; i < GRID_NUMBER ; i++) {
    	 for (let j = 0; j < GRID_NUMBER; j++) {
		    ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
    	 	ctx.fillRect(i*GRID_SIZE, j*GRID_SIZE, GRID_SIZE-1, GRID_SIZE-1); 	
    	 }
    }
}


document.addEventListener("DOMContentLoaded", function(e) {

	let timerId = null;

	const canvas = document.getElementById('myCanvas');
	canvas.onclick = function(event) {
		if (isRunning) return;

		const x = event.x / GRID_SIZE;
		const y = event.y / GRID_SIZE;
		field[x][y] = !field[x][y];

	}
	const ctx = canvas.getContext("2d");

	document.getElementById('start').onclick = function(){ 
		this.timerId = setTimeout(function tick() {
		  drawGrid(ctx);
		  timerId = setTimeout(tick, 500); 
		}, 500, ctx);
		console.log(`start is pressed, timerId:${timerId}`);

	};

	document.getElementById('stop').onclick = function() {
		console.log(`stop is pressed, timerId:${timerId}`);
		if (timerId) {
			clearTimeout(timerId);
		}
	};
	
});