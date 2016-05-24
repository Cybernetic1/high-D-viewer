var audio = new Audio('beep.mp3');
audio.play();

var dim = 3;

var canvas = null;
var width = 0;
var height = 0;
var ctx = null;

// **** prepare Model-View-Projection matrix
var viewMatrix = GL.Matrix.lookAt(3, 3, 3,
		0, 0, 0,  0, 1, 0);
									// (fov, aspect, near, far):
var projMatrix = GL.Matrix.perspective(40, 1.0, 0.1, 100.0);
var mvpMatrix = projMatrix.multiply(viewMatrix);

var origin = new GL.Vector(0.0, 0.0, 0.0);
var axisX = new GL.Vector(1, 0, 0);
var axisY = new GL.Vector(0, 1, 0);
var axisZ = new GL.Vector(0, 0, 1);

var preMatrix = new GL.Matrix.identity();
var rotX = new GL.Matrix.identity();
var rotY = new GL.Matrix.identity();
var rotZ = new GL.Matrix.identity();

var newX = new GL.Vector(1, 0, 0);
var newY = new GL.Vector(0, 1, 0);
var newZ = new GL.Vector(0, 0, 1);

function renewX()
{
	var camx = 0;
	document.getElementById("camx").value = 0;

	// save the old matrices:
	preMatrix = GL.Matrix.multiply(rotZ, preMatrix);
	preMatrix = GL.Matrix.multiply(rotY, preMatrix);
	preMatrix = GL.Matrix.multiply(rotX, preMatrix);

	newY = rotX.transformVector(axisY);
	newZ = rotX.transformVector(axisZ);
	axisY.x = newY.x; axisY.y = newY.y; axisY.z = newY.z;
	axisZ.x = newZ.x; axisZ.y = newZ.y; axisZ.z = newZ.z;
	newX = rotY.transformVector(axisX);
	newZ = rotY.transformVector(axisZ);
	axisX.x = newX.x; axisX.y = newX.y; axisX.z = newX.z;
	axisZ.x = newZ.x; axisZ.y = newZ.y; axisZ.z = newZ.z;
	newX = rotZ.transformVector(axisX);
	newY = rotZ.transformVector(axisY);
	axisX.x = newX.x; axisX.y = newX.y; axisX.z = newX.z;
	axisY.x = newY.x; axisY.y = newY.y; axisY.z = newY.z;

	GL.Matrix.identity(rotZ);
	GL.Matrix.identity(rotY);
	GL.Matrix.identity(rotX);

	viewMatrix = GL.Matrix.lookAt(3, 3, 3,
			0, 0, 0,  0, 1, 0);
										// (fov, aspect, near, far):
	projMatrix = GL.Matrix.perspective(40, 1.0, 0.1, 100.0);

	m0 = GL.Matrix.multiply(rotX, preMatrix);
	m1 = GL.Matrix.multiply(rotY, m0);
	m2 = GL.Matrix.multiply(rotZ, m1);
	m3 = GL.Matrix.multiply(viewMatrix, m2);
	mvpMatrix = GL.Matrix.multiply(projMatrix, m3);
	draw();
}

function rotateX()
{
	var camx = document.getElementById("camx").value;

	rotX = GL.Matrix.rotate(camx, axisX.x, axisX.y, axisX.z);
	
	viewMatrix = GL.Matrix.lookAt(3, 3, 3,
			0, 0, 0,  0, 1, 0);
										// (fov, aspect, near, far):
	projMatrix = GL.Matrix.perspective(40, 1.0, 0.1, 100.0);

	m0 = GL.Matrix.multiply(rotX, preMatrix);
	m1 = GL.Matrix.multiply(rotY, m0);
	m2 = GL.Matrix.multiply(rotZ, m1);
	m3 = GL.Matrix.multiply(viewMatrix, m2);
	mvpMatrix = GL.Matrix.multiply(projMatrix, m3);
	draw();
}

function renewY()
{
	var camy = 0;
	document.getElementById("camy").value = 0;

	// save the old matrices:
	preMatrix = GL.Matrix.multiply(rotZ, preMatrix);
	preMatrix = GL.Matrix.multiply(rotY, preMatrix);
	preMatrix = GL.Matrix.multiply(rotX, preMatrix);

	newY = rotX.transformVector(axisY);
	newZ = rotX.transformVector(axisZ);
	axisY.x = newY.x; axisY.y = newY.y; axisY.z = newY.z;
	axisZ.x = newZ.x; axisZ.y = newZ.y; axisZ.z = newZ.z;
	newX = rotY.transformVector(axisX);
	newZ = rotY.transformVector(axisZ);
	axisX.x = newX.x; axisX.y = newX.y; axisX.z = newX.z;
	axisZ.x = newZ.x; axisZ.y = newZ.y; axisZ.z = newZ.z;
	newX = rotZ.transformVector(axisX);
	newY = rotZ.transformVector(axisY);
	axisX.x = newX.x; axisX.y = newX.y; axisX.z = newX.z;
	axisY.x = newY.x; axisY.y = newY.y; axisY.z = newY.z;

	GL.Matrix.identity(rotZ);
	GL.Matrix.identity(rotY);
	GL.Matrix.identity(rotX);

	viewMatrix = GL.Matrix.lookAt(3, 3, 3,
			0, 0, 0,  0, 1, 0);
										// (fov, aspect, near, far):
	projMatrix = GL.Matrix.perspective(40, 1.0, 0.1, 100.0);

	m0 = GL.Matrix.multiply(rotX, preMatrix);
	m1 = GL.Matrix.multiply(rotY, m0);
	m2 = GL.Matrix.multiply(rotZ, m1);
	m3 = GL.Matrix.multiply(viewMatrix, m2);
	mvpMatrix = GL.Matrix.multiply(projMatrix, m3);
	draw();
}

function rotateY()
{
	var camy = document.getElementById("camy").value;

	rotY = GL.Matrix.rotate(camy, axisY.x, axisY.y, axisY.z);

	viewMatrix = GL.Matrix.lookAt(3, 3, 3,
			0, 0, 0,  0, 1, 0);
										// (fov, aspect, near, far):
	projMatrix = GL.Matrix.perspective(40, 1.0, 0.1, 100.0);

	m0 = GL.Matrix.multiply(rotX, preMatrix);
	m1 = GL.Matrix.multiply(rotY, m0);
	m2 = GL.Matrix.multiply(rotZ, m1);
	m3 = GL.Matrix.multiply(viewMatrix, m2);
	mvpMatrix = GL.Matrix.multiply(projMatrix, m3);
	draw();
}

function renewZ()
{
	var camz = 0;
	document.getElementById("camz").value = 0;

	// save the old matrices:
	preMatrix = GL.Matrix.multiply(rotZ, preMatrix);
	preMatrix = GL.Matrix.multiply(rotY, preMatrix);
	preMatrix = GL.Matrix.multiply(rotX, preMatrix);

	newY = rotX.transformVector(axisY);
	newZ = rotX.transformVector(axisZ);
	axisY.x = newY.x; axisY.y = newY.y; axisY.z = newY.z;
	axisZ.x = newZ.x; axisZ.y = newZ.y; axisZ.z = newZ.z;
	newX = rotY.transformVector(axisX);
	newZ = rotY.transformVector(axisZ);
	axisX.x = newX.x; axisX.y = newX.y; axisX.z = newX.z;
	axisZ.x = newZ.x; axisZ.y = newZ.y; axisZ.z = newZ.z;
	newX = rotZ.transformVector(axisX);
	newY = rotZ.transformVector(axisY);
	axisX.x = newX.x; axisX.y = newX.y; axisX.z = newX.z;
	axisY.x = newY.x; axisY.y = newY.y; axisY.z = newY.z;

	GL.Matrix.identity(rotZ);
	GL.Matrix.identity(rotY);
	GL.Matrix.identity(rotX);

	viewMatrix = GL.Matrix.lookAt(3, 3, 3,
			0, 0, 0,  0, 1, 0);
										// (fov, aspect, near, far):
	projMatrix = GL.Matrix.perspective(40, 1.0, 0.1, 100.0);

	m0 = GL.Matrix.multiply(rotX, preMatrix);
	m1 = GL.Matrix.multiply(rotY, m0);
	m2 = GL.Matrix.multiply(rotZ, m1);
	m3 = GL.Matrix.multiply(viewMatrix, m2);
	mvpMatrix = GL.Matrix.multiply(projMatrix, m3);
	draw();
}

function rotateZ()
{
	var camz = document.getElementById("camz").value;

	rotZ = GL.Matrix.rotate(camz, axisZ.x, axisZ.y, axisZ.z);

	viewMatrix = GL.Matrix.lookAt(3, 3, 3,
			0, 0, 0,  0, 1, 0);
										// (fov, aspect, near, far):
	projMatrix = GL.Matrix.perspective(40, 1.0, 0.1, 100.0);

	m0 = GL.Matrix.multiply(rotX, preMatrix);
	m1 = GL.Matrix.multiply(rotY, m0);
	m2 = GL.Matrix.multiply(rotZ, m1);
	m3 = GL.Matrix.multiply(viewMatrix, m2);
	mvpMatrix = GL.Matrix.multiply(projMatrix, m3);
	draw();
}

function draw()
{
	canvas = document.getElementById("canvas");
	width = canvas.width;
	height = canvas.height;
	if (canvas == null || !canvas.getContext)
		exit(0);
	canvas.style.backgroundColor = 'rgba(0, 0, 0, 1.0)';

	ctx = canvas.getContext("2d");
	// ctx.fillStyle = "#000000";
	ctx.clearRect(0, 0, width, height);
	ctx.lineWidth = 2;
	showAxes(ctx);
	ctx.strokeStyle = "rgb(99,99,99)";

	// loop over all vertices on hypercube
	for (var i = 0; i < Math.pow(2,dim); ++i)
	{
		// find coordinates of v1
		v1 = new Array(dim);
		var num = i;
		for (var j = 0; j < dim; ++j)
		{
			v1[j] = num % 2;
			num = Math.floor(num / 2);
		}

		// For each v1, find its Hamming-distance = 1 neightbors
		v2 = new Array(dim);
		for (j = 0; j < dim; ++j)
		{
			// copy v1's coordinates
			for (k = 0; k < dim; ++k)
				v2[k] = v1[k];
			v2[j] = (v1[j] == 1 ? 0 : 1);		// flip the coordinate
			
			// plot the edge v1---v2
			var vec1 = new GL.Vector(0.0, 0.0, 0.0);
			var vec2 = new GL.Vector(0.0, 0.0, 0.0);
			for (k = 0; k < dim; ++k)
			{
				vec1.x = (v1[0] == 1 ? 1.0 : 0.0);
				vec1.y = (v1[1] == 1 ? 1.0 : 0.0);
				vec1.z = (v1[2] == 1 ? 1.0 : 0.0);
				
				vec2.x = (v2[0] == 1 ? 1.0 : 0.0);
				vec2.y = (v2[1] == 1 ? 1.0 : 0.0);
				vec2.z = (v2[2] == 1 ? 1.0 : 0.0);
			}
			drawLine(vec1, vec2);
		}		
	}
}

function drawLine(q1, q2)
{
    // Put into perspective
    var p1 = mvpMatrix.transformPoint(q1);
    var p2 = mvpMatrix.transformPoint(q2);

    // Transform to screen space [-1,1]
    p1.x /= p1.z;
    p1.y /= p1.z;
    p2.x /= p2.z;
    p2.y /= p2.z;

    // Put into screen coordinates
    p1.xwin = (p1.x + 1.0) * 0.5 * width + 0.0;
    p1.ywin = (p1.y + 1.0) * 0.5 * height + 0.0;

    p2.xwin = (p2.x + 1.0) * 0.5 * width + 0.0;
    p2.ywin = (p2.y + 1.0) * 0.5 * height + 0.0;

    // console.log(p1.xwin, p1.ywin);
    // console.log(p2.xwin, p2.ywin);

    ctx.beginPath();
    ctx.moveTo(p1.xwin, p1.ywin);
    ctx.lineTo(p2.xwin, p2.ywin);
    ctx.stroke();
}

function showAxes(ctx) {
	ctx.beginPath();

	// X axis
	ctx.strokeStyle = "rgb(255,0,0)";
	var axisTip = new GL.Vector(2.0, 0.0, 0.0);
	drawLine(origin, axisTip);
	
	// X axis
	ctx.strokeStyle = "rgb(0,255,0)";
	axisTip.x = 0.0; axisTip.y = 2.0;
	drawLine(origin, axisTip);
	
	// Z axis
	ctx.strokeStyle = "rgb(0,0,255)";
	axisTip.y = 0.0; axisTip.z = 2.0;
	drawLine(origin, axisTip);
}
