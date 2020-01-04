const GRID_SIZE = 70
const GRID_NUMBER = 4
const colors = ['red', 'green', 'blue', 'yellow', 'pink', 'purple', 'magenta', 'cyan'];
const DEFAULT_FRAME_RATE = 250;
const NEIGBOURS_NUMBER = 8;

const field = Array(GRID_NUMBER).fill(Array(GRID_NUMBER).fill(false));
const field2 = Array(GRID_NUMBER).fill(Array(GRID_NUMBER).fill(false));


const drawField = function(ctx) {
	const x_length = field.length-1;
	const neigbours = Array(NEIGBOURS_NUMBER).fill(false);

	let countNeigbours = 0;
	for (let x = 0; x < field.length; x++) {
		const y_length = field[x].length-1;
		for (let y = 0; y < field[x].length; y++) {
			if (x==0) {
				if (y==0) {
					neigbours[0] = field[0][y_length];
					neigbours[1] = field[1][y_length];
					neigbours[2] = field[1][0];
					neigbours[3] = field[1][1];
					neigbours[4] = field[0][1];
					neigbours[5] = field[x_length][1];
					neigbours[6] = field[x_length][0];
					neigbours[7] = field[x_length][y_length];
				} else if (y==y_length) {
					neigbours[0] = field[0][y-1];
					neigbours[1] = field[1][y-1];
					neigbours[2] = field[1][y];
					neigbours[3] = field[1][0];
					neigbours[4] = field[0][0];
					neigbours[5] = field[x_length][0];
					neigbours[6] = field[x_length][y];
					neigbours[7] = field[x_length][y-1];
				} else {
					neigbours[0] = field[0][y-1];
					neigbours[1] = field[x+1][y-1];
					neigbours[2] = field[x+1][y];
					neigbours[3] = field[x+1][y+1];
					neigbours[4] = field[0][y+1];
					neigbours[5] = field[x_length][y+1];
					neigbours[6] = field[x_length][y];
					neigbours[7] = field[x_length][y-1];
				}
			} else if (x==x_length) {
				if (y==0) {
					neigbours[0] = field[x][y_length];
					neigbours[1] = field[0][y_length];
					neigbours[2] = field[0][0];
					neigbours[3] = field[1][0];
					neigbours[4] = field[x][1];
					neigbours[5] = field[x-1][1];
					neigbours[6] = field[x-1][0];
					neigbours[7] = field[x-1][y_length];
				} else if (y==y_length) {
					neigbours[0] = field[x][y-1];
					neigbours[1] = field[0][y-1];
					neigbours[2] = field[0][y];
					neigbours[3] = field[0][0];
					neigbours[4] = field[x][y];
					neigbours[5] = field[x-1][0];
					neigbours[6] = field[x-1][y];
					neigbours[7] = field[x-1][y-1];
				} else {
					neigbours[0] = field[x][y-1];
					neigbours[1] = field[0][y-1];
					neigbours[2] = field[0][y];
					neigbours[3] = field[0][y+1];
					neigbours[4] = field[x][y+1];
					neigbours[5] = field[x-1][y+1];
					neigbours[6] = field[x-1][y];
					neigbours[6] = field[x-1][y-1];
				}
			} else {
				neigbours[0] = field[x][y-1];
				neigbours[1] = field[x+1][y-1];
				neigbours[2] = field[x+1][y];
				neigbours[3] = field[x+1][y+1];
				neigbours[4] = field[x][y+1];
				neigbours[5] = field[x-1][y+1];
				neigbours[6] = field[x-1][y];
				neigbours[7] = field[x-1][y-1];				
			}
			
			countNeigbours = neigbours.reduce((a,b) => {return a+b});
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
	for (let x = 0; x < field.length; x++) {
		for (let y = 0; y < field[x].length; y++) {
			field[x][y] = field2[x][y];
 			if (field[x][y]) {
	 			ctx.fillRect(x*GRID_SIZE, y*GRID_SIZE, GRID_SIZE-1, GRID_SIZE-1); 	
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
		console.log(`frameRate:${this.value}`);
		frameRate = this.value;
	};


	const canvas = document.getElementById('myCanvas');
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];

	canvas.onclick = function(event) {
		if (!isRunning) {
			const x = Math.floor(event.x / GRID_SIZE);
			const y = Math.floor(event.y / GRID_SIZE);
			console.log(`x:${x},y:${y}; e.x: ${event.x}, e.y: ${event.y}`);
			field[x][y] = !field[x][y];
			isInitialized = true;
			ctx.fillRect(x*GRID_SIZE, y*GRID_SIZE, GRID_SIZE-1, GRID_SIZE-1);
		}		
	}

	let timerId = null;

	document.getElementById('start').onclick = function(){ 
		console.log(`start.onclick isInitialized:${isInitialized}`);
		if (isInitialized && !isRunning) {
			timerId = setInterval(function(){drawField(ctx)}, frameRate);
			isRunning = true;
		}		
		console.log(`start is pressed, timerId:${timerId}`);
	};

	document.getElementById('stop').onclick = function() {
		console.log(`stop is pressed, timerId:${timerId}`);
		if (timerId) {
			clearInterval(timerId);
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

