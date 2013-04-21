var goCanvas;
var giScreenWidth;
var giScreenHeight;

function DrawComponent(poOwner, pfZOrder)
{
	this.oOwner = poOwner;
	this.fPositionX = 0.0;
	this.fPositionY = 0.0;
	this.fRotation = 0.0;
	this.fAlpha = 1.0;
	
	var mfZOrder = pfZOrder;

	this.setZOrder = function(pfZOrder)
	{
		mfZOrder = pfZOrder;
		goDrawManager.sortComponents();
	}
	
	this.getZOrder = function()
	{
		return mfZOrder;
	}
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
				return;
			}
		}
		
		alert("Couldn't remove specified Draw Component");
	}
	
	function sortFunction(poComponentA, poComponentB)
	{
		return poComponentA.getZOrder() - poComponentB.getZOrder();
	}
	
	this.sortComponents = function()
	{
		this.toDrawComponents.sort(sortFunction);
	}
	
	this.update = function()
	{
		goCanvas.clearRect(0, 0, giScreenWidth, giScreenHeight)
		goCanvas.save();
		
		if(moBackgroundImage != null)
		{
			goCanvas.drawImage(moBackgroundImage,0,0);
		}
		
		
		for(var i = 0; i < goDrawManager.toDrawComponents.length; ++i)
		{
			var oComponent = goDrawManager.toDrawComponents[i];
			if(oComponent.oOwner.draw != null)
			{
				goCanvas.save();
				{
					goCanvas.globalAlpha = oComponent.fAlpha;
					goCanvas.translate(oComponent.fPositionX, oComponent.fPositionY);
					goCanvas.rotate(oComponent.fRotation);
					
					oComponent.oOwner.draw(goCanvas);
				}
				goCanvas.restore();
			}
		}
	}
	
	this.setBackground = function(psPath)
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
	
	goUpdateManager.addComponent(goDrawManager);
}

var goDrawManager = new DrawManager();

gtfInitializationFunctions.push(initializeDrawManager);
