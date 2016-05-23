// function fun1(x) {return Math.sin(x);  }
// function fun2(x) {return Math.cos(3*x);}

var dim = 3;

var canvas = null;
var width = 0;
var height = 0;
var ctx = null;

// **** prepare Model-View-Projection matrix
var viewMatrix = GL.Matrix.lookAt(3, 3, 3,
		0, 0, 0,  0, -1, 0);
									// (fov, aspect, near, far):
var projMatrix = GL.Matrix.perspective(40, 1.0, 0.1, 100.0);
var mvpMatrix = projMatrix.multiply(viewMatrix);

var origin = new GL.Vector(0.0, 0.0, 0.0);
var axisX = new GL.Vector(1, 0, 0);
var axisY = new GL.Vector(0, 1, 0);
var axisZ = new GL.Vector(0, 0, 1);

function redraw()
{
	var camx = document.getElementById("camx").value;
	var camy = document.getElementById("camy").value;
	var camz = document.getElementById("camz").value;

	var newX, newY, newZ, newZ2;
	// **** prepare Model-View-Projection matrix
	rotX = GL.Matrix.rotate(camx, axisX.x, axisX.y, axisX.z);
	newY = rotX.transformVector(axisY);
	newZ = rotX.transformVector(axisZ);
	// axisY.x = newY.x; axisY.y = newY.y; axisY.z = newY.z;
	// axisZ.x = newZ.x; axisZ.y = newZ.y; axisZ.z = newZ.z;

	ctx.clearRect(0, 0, width, height);
	ctx.strokeStyle = "rgb(200,200,200)";
	drawLine(origin, newY);
	drawLine(origin, newZ);
	
	rotY = GL.Matrix.rotate(camy, newY.x, newY.y, newY.z);
	newX = rotY.transformVector(axisX);
	newZ2 = rotY.transformVector(newZ);
	// axisX.x = newX.x; axisX.y = newX.y; axisX.z = newX.z;
	// axisZ.x = newZ.x; axisZ.y = newZ.y; axisZ.z = newZ.z;
	
	rotZ = GL.Matrix.rotate(camz, newZ2.x, newZ2.y, newZ2.z);
	// newX = rotZ.transformVector(axisX);
	// newY = rotZ.transformVector(axisY);
	// axisX.x = newX.x; axisX.y = newX.y; axisX.z = newX.z;
	// axisY.x = newY.x; axisY.y = newY.y; axisY.z = newY.z;

	viewMatrix = GL.Matrix.lookAt(3, 3, 3,
			0, 0, 0,  0, -1, 0);
										// (fov, aspect, near, far):
	projMatrix = GL.Matrix.perspective(40, 1.0, 0.1, 100.0);

	m1 = rotZ.multiply(rotY);
	m2 = m1.multiply(rotX);
	m3 = viewMatrix.multiply(m2);
	mvpMatrix = projMatrix.multiply(m3);

	draw();
}

function draw()
{
	canvas = document.getElementById("canvas");
	width = canvas.width;
	height = canvas.height;
	if (canvas == null || !canvas.getContext)
		exit(0);

	ctx = canvas.getContext("2d");

	// var axes= {};
	// axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
	// axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
	// axes.scale = 40;                 // 40 pixels from x=0 to x=1
	// axes.doNegativeX = true;
	showAxes(ctx);
	// funGraph(ctx,axes,fun1,"rgb(11,153,11)",1);
	// funGraph(ctx,axes,fun2,"rgb(66,44,255)",2);

	ctx.lineWidth = 2;
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

	/* model coordinates = world coordinates
	var p1 = new GL.Vector(1.0, 1.0, 1.0);
	var p2 = new GL.Vector(-1.0, -1.0, -1.0);

	var v1 = mvpMatrix.transformPoint(p1);
	var v2 = mvpMatrix.transformPoint(p2);

	v1.x /= v1.z; v1.y /= v1.z;
	v2.x /= v2.z; v2.y /= v2.z;
	
	v1.xwin = (v1.x + 1.0) * 0.5 * width + 0.0;
	v1.ywin = (v1.y + 1.0) * 0.5 * height + 0.0;
	
	v2.xwin = (v2.x + 1.0) * 0.5 * width + 0.0;
	v2.ywin = (v2.y + 1.0) * 0.5 * height + 0.0;

	console.log(v1.xwin, v1.ywin);
	console.log(v2.xwin, v2.ywin);
	*/
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

function funGraph (ctx,axes,func,color,thick) {
	var xx, yy, dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;
	var iMax = Math.round((ctx.canvas.width-x0)/dx);
	var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	for (var i=iMin; i<=iMax; i++) {
		xx = dx*i;
		yy = scale*func(xx/scale);
		if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
		else         ctx.lineTo(x0+xx,y0-yy);
	}
	ctx.stroke();
}

function showAxes(ctx) {
	// var x0=axes.x0, w=ctx.canvas.width;
	// var y0=axes.y0, h=ctx.canvas.height;
	// var xmin = axes.doNegativeX ? 0 : x0;
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
