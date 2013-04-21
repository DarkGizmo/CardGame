var gtfInitializationFunctions = new Array();

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
	for(var i = 0; i < gtfInitializationFunctions.length; ++i)
	{
		gtfInitializationFunctions[i]();
	}
}
