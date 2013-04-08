var MouseClickType = {}
MouseClickType.eLeftClick = 0;
MouseClickType.eMiddleClick = 1;
MouseClickType.eRightClick = 2;

/**
	Support function for Owner: onMouseOver, onMouseIn, onMouseOut, onMouseDown, onMouseUp, onMouseDrag, onMouseWheel
*/
function MouseEventComponent(poOwner, pfTop, pfLeft, pfWidth, pfHeight, piZOrder)
{
	this.moOwner = poOwner;
	this.oRectangle = new Rectangle(pfTop, pfLeft, pfWidth, pfHeight);
	
	this.bMouseOver = false;
	this.tbMouseDown = [];
	this.toMousePosition = [];
	
	var miZOrder = 0;
	
	if(piZOrder != null)
	{
		miZOrder = piZOrder;
	}
	
	this.getZOrder = function()
	{
		return miZOrder;
	}
	
	this.setZOrder = function(piZOrder)
	{
		miZOrder = piZOrder;
		goMouseEventManagerInstance.sortComponents();
	}
	
	this.update = function(pfTop, pfLeft, pfWidth, pfHeight, piZOrder)
	{
		this.oRectangle.updateBounds(pfLeft, pfTop, pfWidth, pfHeight);
		
		if(piZOrder != null && miZOrder != piZOrder)
		{
			miZOrder = piZOrder;
			goMouseEventManagerInstance.sortComponents();
		}
	}
}

function MouseEventManager()
{
	this.tbButtonDown = [];
	this.toMouseEventComponents = [];
	
	this.addComponent = function(poOwner, pfTop, pfLeft, pfWidth, pfHeight)
	{
		var oComponent = null;
		
		for(var i = 0; i < this.toMouseEventComponents.length; ++i)
		{
			if(this.toMouseEventComponents[i].poOwner == poOwner)
			{
				oComponent = this.toMouseEventComponents[i];
				break;
			}
		}
		
		if(oComponent != null)
		{
			alert("moMouseEventComponent already exists");
		}
		else
		{
			oComponent = new MouseEventComponent(poOwner, pfTop, pfLeft, pfWidth, pfHeight);
			this.toMouseEventComponents.push(oComponent);
		}
		
		return oComponent;
	}
	
	this.removeComponent = function(poOwner)
	{
		for(var i = 0; i < this.toMouseEventComponents.length; ++i)
		{
			if(this.toMouseEventComponents[i].moOwner == poOwner)
			{
				this.toMouseEventComponents.splice(i, 1);
				return;
			}
		}
		
		alert("Couldn't remove specified Mouse Event Component");
	}
	
	function sortFunction(poComponentA, poComponentB)
	{
		return poComponentA.getZOrder() < poComponentB.getZOrder();
	}
	
	this.sortComponents = function()
	{
		this.toMouseEventComponents.sort(sortFunction);
	}
	
	this.isMouseInsideComponent = function(pfMousePosX, pfMousePosY, poComponent)
	{
		return poComponent.oRectangle.isInside(pfMousePosX, pfMousePosY);
	}
	
	this.updateMouseOver = function(pfMousePosX, pfMousePosY, poComponent)
	{
		var bIsMouseInside = this.isMouseInsideComponent(pfMousePosX, pfMousePosY, poComponent);
		var bReturnValue = bIsMouseInside;
		if(bIsMouseInside)
		{
			var bWasMouseOver = poComponent.bMouseOver;
			poComponent.bMouseOver = true;
			
			if(!bWasMouseOver)
			{
				if(poComponent.moOwner.onMouseIn)
				{
					bReturnValue = poComponent.moOwner.onMouseIn();
				}
			}
			
			if(poComponent.moOwner.onMouseOver)
			{
				bReturnValue = bReturnValue || poComponent.moOwner.onMouseOver();
			}
		}
		else if (!bIsMouseInside && poComponent.bMouseOver)
		{
			poComponent.bMouseOver = false;
			if(poComponent.moOwner.onMouseOut)
			{
				bReturnValue = poComponent.moOwner.onMouseOut();
			}			
		}
		
		if(bReturnValue == null)
		{
			bReturnValue = false;
		}
		
		return bReturnValue;
	};
	
	this.updateMouseDrag = function(piButton, pfMousePosX, pfMousePosY, poComponent)
	{
		if(poComponent.tbMouseDown[piButton])
		{
			if(poComponent.moOwner.onMouseDrag)
			{
				var fDeltaMoveX = pfMousePosX - poComponent.toMousePosition[piButton].X;
				var fDeltaMoveY = pfMousePosY - poComponent.toMousePosition[piButton].Y;
				
				poComponent.toMousePosition[piButton].X = pfMousePosX;
				poComponent.toMousePosition[piButton].Y = pfMousePosY;
				poComponent.moOwner.onMouseDrag(piButton, fDeltaMoveX, fDeltaMoveY);
			}
		}
	};
	
	this.updateMousePosition = function(pfMousePosX, pfMousePosY)
	{
		var bMouseOverUpdateDone = false;
		for(var i = 0; i < this.toMouseEventComponents.length; ++i)
		{
			var oComponent = this.toMouseEventComponents[i];
			if(!bMouseOverUpdateDone)
			{
				bMouseOverUpdateDone = this.updateMouseOver(pfMousePosX, pfMousePosY, oComponent);
			}
			
			if(oComponent.moOwner.onMouseMove)
			{
				oComponent.moOwner.onMouseMove(pfMousePosX, pfMousePosY);
			}
			
			for(var j = 0; j < this.tbButtonDown.length; ++j)
			{
				if(this.tbButtonDown[j])
				{
					this.updateMouseDrag(j, pfMousePosX, pfMousePosY, oComponent);
				}
			}
		}
	}

	this.updateMouseClick = function(pfMousePosX, pfMousePosY, piButton, pbClicked)
	{
		this.tbButtonDown[piButton] = pbClicked;
		
		for(var i = 0; i < this.toMouseEventComponents.length; ++i)
		{
			var oComponent = this.toMouseEventComponents[i];
			if(pbClicked)
			{
				var bIsMouseInside = this.isMouseInsideComponent(pfMousePosX, pfMousePosY, oComponent);
				if(bIsMouseInside)
				{
					oComponent.tbMouseDown[piButton] = true;
					
					if(oComponent.moOwner.onMouseDown)
					{
						oComponent.moOwner.onMouseDown(piButton, pfMousePosX, pfMousePosY);
					}
					
					if(oComponent.toMousePosition[piButton] == null)
					{
						oComponent.toMousePosition[piButton] = {}
					}
					oComponent.toMousePosition[piButton].X = pfMousePosX;
					oComponent.toMousePosition[piButton].Y = pfMousePosY;
				}
			}
			else if(oComponent.tbMouseDown[piButton])
			{
				oComponent.tbMouseDown[piButton] = false;
				if(oComponent.moOwner.onMouseUp)
				{
					oComponent.moOwner.onMouseUp(piButton, pfMousePosX, pfMousePosY);
				}
			}
		}
	}
	
	this.UpdateMouseWheel = function(piWheelDelta)
	{
		var bCancelMouseWheel = false;
		for(var i = 0; i < this.toMouseEventComponents.length; ++i)
		{
			var oComponent = this.toMouseEventComponents[i];
			if(oComponent.moOwner.onMouseWheel)
			{
				var bComponentCancelsMouseWheel = oComponent.moOwner.onMouseWheel(piWheelDelta);
				if(bComponentCancelsMouseWheel == null)
				{
					bComponentCancelsMouseWheel = false;
				}
				bCancelMouseWheel = bCancelMouseWheel || bComponentCancelsMouseWheel;
			}
		}
		
		return bCancelMouseWheel;
	}
}

var goMouseEventManagerInstance = new MouseEventManager();

function initializeMouseEventManager()
{
	var oContainer = document.getElementById('canvas');
	
	oContainer.addEventListener( "mousemove",
		function(e)
		{
			var oContainer = document.getElementById('canvas');
			goMouseEventManagerInstance.updateMousePosition(e.pageX - oContainer.offsetLeft, e.pageY - oContainer.offsetTop);
		}, false 
	);
	
	oContainer.addEventListener( "mousedown",
		function(e)
		{
			var oContainer = document.getElementById('canvas');
			goMouseEventManagerInstance.updateMouseClick(e.pageX - oContainer.offsetLeft, e.pageY - oContainer.offsetTop, e.button, true);
		}, false 
	);
	
	oContainer.addEventListener( "mouseup",
		function(e)
		{
			var oContainer = document.getElementById('canvas');
			goMouseEventManagerInstance.updateMouseClick(e.pageX - oContainer.offsetLeft, e.pageY - oContainer.offsetTop, e.button, false);
		}, false 
	);
	
	var oMouseWheelFunction = 
		function(e)
		{
			var iDelta = 0;
			if (!e) /* For IE. */
			{
				e = window.event;
			}
			if (e.wheelDelta) /* IE/Opera. */
			{
				iDelta = e.wheelDelta/120;
			}
			else if (e.detail) /* Mozilla case. */
			{ 
				/** In Mozilla, sign of delta is different than in IE.
				 * Also, delta is multiple of 3.
				 */
				iDelta = -e.detail/3;
			}
			
			var bPreventMouseWheel = false;
			/** If delta is nonzero, handle it.
			 * Basically, delta is now positive if wheel was scrolled up,
			 * and negative, if wheel was scrolled down.
			 */
			if (iDelta)
			{
				bPreventMouseWheel = goMouseEventManagerInstance.UpdateMouseWheel(iDelta);
			}
			/** Prevent default actions caused by mouse wheel.
			 * That might be ugly, but we handle scrolls somehow
			 * anyway, so don't bother here..
			 */
			if (bPreventMouseWheel && e.preventDefault)
					e.preventDefault();
			e.returnValue = !bPreventMouseWheel;
		}
	
	if (oContainer.addEventListener)
        window.addEventListener('DOMMouseScroll', oMouseWheelFunction, false);
	window.onmousewheel = document.onmousewheel = oMouseWheelFunction;
}
gtfInitializationFunctions.push(initializeMouseEventManager);
