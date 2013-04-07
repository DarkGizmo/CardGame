var goCanvas;
var giScreenWidth;
var giScreenHeight;

function DrawComponent(poOwner, pfZOrder)
{
	this.oOwner = poOwner;
	this.fZOrder = pfZOrder;
}

function DrawManager()
{
	this.toDrawComponents = [];
	
	var moBackgroundImage = null;
	
	this.addComponent = function(poOwner, pfZOrder)
	{
		var oComponent = null;
		
		for(var i = 0; i < this.toDrawComponents.length; ++i)
		{
			if(this.toDrawComponents[i].oOwner == poOwner)
			{
				oComponent = this.toDrawComponents[i];
				break;
			}
		}
		
		if(oComponent != null)
		{
			alert("DrawComponent already exists");
		}
		else
		{
			oComponent = new DrawComponent(poOwner, pfZOrder);
			this.toDrawComponents.push(oComponent);
			this.sortComponents();
		}
		
		return oComponent;
	}
	
	this.removeComponent = function(poOwner)
	{
		for(var i = 0; i < this.toDrawComponents.length; ++i)
		{
			if(this.toDrawComponents[i].oOwner == poOwner)
			{
				this.toDrawComponents.splice(i, 1);
				break;
			}
		}
	}
	
	function sortFunction(poComponentA, poComponentB)
	{
		poComponentA.fZOrder > poComponentB.fZOrder;
	}
	
	this.sortComponents = function()
	{
		this.toDrawComponents.sort(sortFunction);
	}
	
	this.Update = function()
	{
		goCanvas.clearRect(0, 0, giScreenWidth, giScreenHeight)
		goCanvas.save();
		
		if(moBackgroundImage != null)
		{
			goCanvas.drawImage(moBackgroundImage,0,0);
		}
		
		
		for(var i = 0; i < goDrawManagerInstance.toDrawComponents.length; ++i)
		{
			if(goDrawManagerInstance.toDrawComponents[i].oOwner.draw != null)
			{
				goDrawManagerInstance.toDrawComponents[i].oOwner.draw(goCanvas);
			}
		}
	}
	
	this.SetBackground = function(psPath)
	{
		moBackgroundImage = new Image();
		moBackgroundImage.src = psPath;
	}
}

function initializeDrawManager()
{
	goCanvas = document.getElementById('canvas').getContext('2d');
	document.getElementById('canvas').oncontextmenu = function() { return false; } ;
	
	giScreenWidth = parseInt(document.getElementById('canvas').width);
	giScreenHeight = parseInt(document.getElementById('canvas').height);
}
	
function updateDrawManager()
{
	goDrawManagerInstance.Update();
}

var goDrawManagerInstance = new DrawManager();

gtfInitializationFunctions.push(initializeDrawManager);
gtfUpdateFunctions.push(updateDrawManager);