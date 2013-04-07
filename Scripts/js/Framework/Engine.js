var FPS = 30.0;

var gtfInitializationFunctions = new Array();
var gtfUpdateFunctions = new Array();

//Wait for DOM to load and init game
document.addEventListener('DOMContentLoaded', 
	function()
	{
		initializeEngine();
	}
);

function initializeEngine()
{
	setInterval(engineLoop, 1000.0 / FPS);

	for(var i = 0; i < gtfInitializationFunctions.length; ++i)
	{
		gtfInitializationFunctions[i]();
	}
}

function engineLoop()
{
	for(var i = 0; i < gtfUpdateFunctions.length; ++i)
	{
		gtfUpdateFunctions[i]();
	}
}