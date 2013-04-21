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
		goMouseEventManager.sortComponents();
	}
	
	this.update = function(pfTop, pfLeft, pfWidth, pfHeight, piZOrder)
	{
		this.oRectangle.updateBounds(pfLeft, pfTop, pfWidth, pfHeight);
		
		if(piZOrder != null && miZOrder != piZOrder)
		{
			miZOrder = piZOrder;
			goMouseEventManager.sortComponents();
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
			this.sortComponents();
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
			poComponent.bMouseOver = true; // We want this set before calling the events
			
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
	
		// Create a copy of the current components in case some are added or removed
		var toMouseEventComponentCopy = [].concat(this.toMouseEventComponents);
		for(var i = 0; i < toMouseEventComponentCopy.length; ++i)
		{
			var oComponent = toMouseEventComponentCopy[i];
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
		var bPreventMouseDown = false;
		this.tbButtonDown[piButton] = pbClicked;
		
		// Create a copy of the current components in case some are added or removed
		var toMouseEventComponentCopy = [].concat(this.toMouseEventComponents);
		for(var i = 0; i < toMouseEventComponentCopy.length && !bPreventMouseDown; ++i)
		{
			var oComponent = toMouseEventComponentCopy[i];
			if(pbClicked)
			{
				var bIsMouseInside = this.isMouseInsideComponent(pfMousePosX, pfMousePosY, oComponent);
				if(bIsMouseInside)
				{
					oComponent.tbMouseDown[piButton] = true;
					
					if(oComponent.moOwner.onMouseDown)
					{
						bPreventMouseDown = oComponent.moOwner.onMouseDown(piButton, pfMousePosX, pfMousePosY);
						
						if(bPreventMouseDown == null)
						{
							bPreventMouseDown = false;
						}
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
		
		return bPreventMouseDown;
	}
	
	this.UpdateMouseWheel = function(piWheelDelta)
	{
		var bCancelMouseWheel = false;
		
		// Create a copy of the current components in case some are added or removed
		var toMouseEventComponentCopy = [].concat(this.toMouseEventComponents);
		for(var i = 0; i < toMouseEventComponentCopy.length; ++i)
		{
			var oComponent = toMouseEventComponentCopy[i];
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

var goMouseEventManager = new MouseEventManager();

function initializeMouseEventManager()
{
	var oContainer = document.getElementById('canvas');
	
	oContainer.addEventListener( "mousemove",
		function(e)
		{
			var oContainer = document.getElementById('canvas');
			var oRectangle = oContainer.getBoundingClientRect();
			goMouseEventManager.updateMousePosition(e.clientX - oRectangle.left, e.clientY - oRectangle.top);
		}, false 
	);
	
	oContainer.addEventListener( "mousedown",
		function(e)
		{
			var oContainer = document.getElementById('canvas');
			var oRectangle = oContainer.getBoundingClientRect();
			var bPreventMouseDown = goMouseEventManager.updateMouseClick(e.clientX - oRectangle.left, e.clientY - oRectangle.top, e.button, true);
			
			if (bPreventMouseDown && e.preventDefault)
			{
				e.preventDefault();
			}
			e.returnValue = !bPreventMouseDown;
		}, false 
	);
	
	oContainer.addEventListener( "mouseup",
		function(e)
		{
			var oContainer = document.getElementById('canvas');
			var oRectangle = oContainer.getBoundingClientRect();
			goMouseEventManager.updateMouseClick(e.clientX - oRectangle.left, e.clientY - oRectangle.top, e.button, false);
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
				bPreventMouseWheel = goMouseEventManager.UpdateMouseWheel(iDelta);
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
	{
        window.addEventListener('DOMMouseScroll', oMouseWheelFunction, false);
	}
	
	document.onmousewheel = oMouseWheelFunction;
}
gtfInitializationFunctions.push(initializeMouseEventManager);
