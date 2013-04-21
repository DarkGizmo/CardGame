var FPS = 30.0;

function UpdateComponent(poOwner, pfOrder)
{
	this.oOwner = poOwner;
	
	var mfOrder = pfOrder;
	
	this.setOrder = function(pfOrder)
	{
		mfOrder = pfOrder;
		goUpdateManager.sortComponents();
	}
	
	this.getOrder = function()
	{
		return mfOrder;
	}
}

function UpdateManager()
{
	this.toUpdateComponents = [];
	
	this.addComponent = function(poOwner, pfOrder)
	{
		var oComponent = null;
		
		for(var i = 0; i < this.toUpdateComponents.length; ++i)
		{
			if(this.toUpdateComponents[i].oOwner == poOwner)
			{
				oComponent = this.toUpdateComponents[i];
				break;
			}
		}
		
		if(oComponent != null)
		{
			alert("UpdateComponent already exists");
		}
		else
		{
			oComponent = new UpdateComponent(poOwner, pfOrder);
			this.toUpdateComponents.push(oComponent);
			this.sortComponents();
		}
		
		return oComponent;
	}
	
	this.removeComponent = function(poOwner)
	{
		for(var i = 0; i < this.toUpdateComponents.length; ++i)
		{
			if(this.toUpdateComponents[i].oOwner == poOwner)
			{
				this.toUpdateComponents.splice(i, 1);
				return;
			}
		}
		
		alert("Couldn't remove specified Update Component");
	}
	
	function sortFunction(poComponentA, poComponentB)
	{
		poComponentA.getOrder() > poComponentB.getOrder();
	}
	
	this.sortComponents = function()
	{
		this.toUpdateComponents.sort(sortFunction);
	}
	
	this.Update = function()
	{
		var deltaTime = 1.0 / FPS;
		for(var i = 0; i < goUpdateManager.toUpdateComponents.length; ++i)
		{
			if(goUpdateManager.toUpdateComponents[i].oOwner.update != null)
			{
				goUpdateManager.toUpdateComponents[i].oOwner.update(deltaTime);
			}
		}
	}
}

function initializeUpdateManager()
{
	setInterval(updateUpdateManager, 1000.0 / FPS);
}
	
function updateUpdateManager()
{
	goUpdateManager.Update();
}

var goUpdateManager = new UpdateManager();

gtfInitializationFunctions.push(initializeUpdateManager);