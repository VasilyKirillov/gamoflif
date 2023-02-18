const CELL_SIZE = 15
const GRID_NUMBER = 45
const colors = ['red', 'green', 'blue', 'yellow', 'pink', 'purple', 'magenta', 'cyan'];
const DEFAULT_FRAME_RATE = 250


const createField = function(value) {
	const field = [];
	for (let x = 0; x < GRID_NUMBER; x++) {
		field[x] = [];
		for (let y = 0; y < GRID_NUMBER; y++) {
			field[x][y] = value;			
		}		
	}
	return field;
}


const field = createField(false);
const field2 = createField(null);

const drawField = function(ctx, canvasWidth, canvasHeight) {
	const x_length = field.length-1;

	let countNeigbours;
	let dx;
	let dy;
	for (let x = 0; x < field.length; x++) {
		const y_length = field[x].length-1;
		for (let y = 0; y < field[x].length; y++) {
			countNeigbours = 0;
			// console.log(`x:${x}, y:${y}`);

			for (const neigbour of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
				dx = x + neigbour[0];
				dy = y + neigbour[1];

				if (dx < 0) {
					dx = x_length;
				}
				if (dx > x_length) {
					dx = 0;
				}
				if (dy < 0) {
					dy = y_length;
				}
				if (dy > y_length) {
					dy = 0;
				}
				// console.log(`dx:${dx}, dy:${dy}, field[dx][dy]:${field[dx][dy]}`);
				countNeigbours += field[dx][dy];
			}			
			console.log(`countNeigbours: ${countNeigbours}`);
			/*
			 * Rule1: Any live cell with two or three neighbors survives
			 * Rule2: Any dead cell with three live neighbors becomes a live cell
			 * Rule3: All other live cells die in the next generation. Similarly, all other dead cells stay dead.
			 */
			if ((field[x][y] && (countNeigbours==2 || countNeigbours==3)) 
				 || (!field[x][y] && countNeigbours==3)) {
				field2[x][y] = true;
			} else {
				field2[x][y] = false;
			}
		}
	}

	//updating field data and draw
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	for (let x = 0; x < field.length; x++) {
		for (let y = 0; y < field[x].length; y++) {
			field[x][y] = field2[x][y];
 			if (field[x][y]) {
	 			ctx.fillRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE-1, CELL_SIZE-1); 	
 			}
		}
	}
	console.log('drawField end');	
}


document.addEventListener("DOMContentLoaded", function(e) {
	let isRunning = false;
	let isInitialized = false;

	const frameRateInput = document.getElementById('frameRate');
	let frameRate = frameRateInput != undefined ? frameRateInput.value : DEFAULT_FRAME_RATE;
	frameRateInput.onchange = function() {
		// console.log(`frameRate:${this.value}`);
		frameRate = this.value;
	};

	const canvas = document.getElementById('myCanvas');
	const ctx = canvas.getContext("2d");
	const cellColor = colors[Math.floor(Math.random()*colors.length)];
	const bgCellColor = 'white';

	ctx.fillStyle = cellColor;

	const fillCell = function(event) {
		const rectangle = canvas.getBoundingClientRect();
			if (!isRunning) {
				const x = Math.floor((event.x - rectangle.x) / CELL_SIZE);
				const y = Math.floor((event.y - rectangle.y) / CELL_SIZE);
				field[x][y] = !field[x][y];
				isInitialized = true;
				if (field[x][y]) {
					ctx.fillStyle = cellColor;
				} else {
					ctx.fillStyle = bgCellColor;
				}
				ctx.fillRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE-1, CELL_SIZE-1);
				ctx.fillStyle = cellColor;
		}		
	}

	canvas.addEventListener('mousemove', function(event) {
		if(event.buttons == 1) {
			event.preventDefault();
			fillCell(event);
		}
	});


	canvas.onclick = function(event) {
		fillCell(event);		
	}


	let intervalId = null;

	document.getElementById('start').onclick = function(){ 
		console.log(`start.onclick isInitialized:${isInitialized}`);
		if (isInitialized && !isRunning) {
			intervalId = setInterval(function(){drawField(ctx, canvas.width, canvas.height)}, frameRate);
			isRunning = true;
		}		
		console.log(`start is pressed, intervalId:${intervalId}`);
	};

	document.getElementById('stop').onclick = function() {
		console.log(`stop is pressed, intervalId:${intervalId}`);
		if (intervalId) {
			clearInterval(intervalId);
			isRunning = false;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			field.forEach(row => {
				for (let i = 0; i < row.length; i++) {
					row[i] = false;
				}
			});
		}
	};

	
});

