var FPS = 30.0;

var gtfInitializationFunctions = new Array();
var gtfUpdateFunctions = new Array();

function addListener(obj, eventName, listener)
{
	if(obj.addEventListener)
	{
		obj.addEventListener(eventName, listener, false);
	}
	else
	{
		obj.attachEvent("on" + eventName, listener);
	}
}

addListener(window, "load", 
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
