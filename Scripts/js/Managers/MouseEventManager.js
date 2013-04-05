var MouseClickType = {}
MouseClickType.eLeftClick = 0;
MouseClickType.eMiddleClick = 1;
MouseClickType.eRightClick = 2;

/**
	Support function for Owner: onMouseOver, onMouseOut, onMouseDown, onMouseUp, onMouseDrag, onMouseWheel
*/
function MouseEventComponent(poOwner, pfTop, pfLeft, pfWidth, pfHeight)
{
	this.moOwner = poOwner;
	this.mfTop = pfTop;
	this.mfLeft = pfLeft;
	this.mfRight = pfLeft + pfWidth;
	this.mfBottom = pfTop + pfHeight;
	
	this.bMouseOver = false;
	this.tbMouseDown = [];
	this.toMousePosition = [];
	
	this.update = function(pfTop, pfLeft, pfWidth, pfHeight)
	{
		this.mfTop = pfTop;
		this.mfLeft = pfLeft;
		this.mfRight = pfLeft + pfWidth;
		this.mfBottom = pfTop + pfHeight;
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
	
	this.isMouseInsideComponent = function(pfMousePosX, pfMousePosY, poComponent)
	{
		return 	pfMousePosX >= poComponent.mfLeft && pfMousePosX <= poComponent.mfRight && 
				pfMousePosY >= poComponent.mfTop && pfMousePosY <= poComponent.mfBottom;
	}
	
	this.updateMouseMove = function(pfMousePosX, pfMousePosY, poComponent)
	{
		var bIsMouseInside = this.isMouseInsideComponent(pfMousePosX, pfMousePosY, poComponent);
		if(bIsMouseInside && !poComponent.bMouseOver)
		{
			poComponent.bMouseOver = true;
			if(poComponent.moOwner.onMouseOver)
			{
				poComponent.moOwner.onMouseOver();
			}
		}
		else if (!bIsMouseInside && poComponent.bMouseOver)
		{
			poComponent.bMouseOver = false;
			if(poComponent.moOwner.onMouseOut)
			{
				poComponent.moOwner.onMouseOut();
			}			
		}
		
		if(poComponent.moOwner.onMouseMove)
		{
			poComponent.moOwner.onMouseMove(pfMousePosX, pfMousePosY);
		}
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
		for(var i = 0; i < this.toMouseEventComponents.length; ++i)
		{
			this.updateMouseMove(pfMousePosX, pfMousePosY, this.toMouseEventComponents[i]);
			
			for(var j = 0; j < this.tbButtonDown.length; ++j)
			{
				if(this.tbButtonDown[j])
				{
					this.updateMouseDrag(j, pfMousePosX, pfMousePosY, this.toMouseEventComponents[i]);
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
						oComponent.moOwner.onMouseDown(piButton);
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
					oComponent.moOwner.onMouseUp(piButton);
				}
			}
		}
	}
	
	this.UpdateMouseWheel = function(piWheelDelta)
	{
		for(var i = 0; i < this.toMouseEventComponents.length; ++i)
		{
			var oComponent = this.toMouseEventComponents[i];
			if(oComponent.moOwner.onMouseWheel)
			{
				oComponent.moOwner.onMouseWheel(piWheelDelta);
			}
		}
	}
}

var goMouseEventManagerInstance = new MouseEventManager();

function initializeMouseEventManager()
{
	var oContainer = document.getElementById('container');
	
	oContainer.addEventListener( "mousemove",
		function(e)
		{
			goMouseEventManagerInstance.updateMousePosition(e.pageX, e.pageY);
		}, false 
	);
	
	oContainer.addEventListener( "mousedown",
		function(e)
		{
			goMouseEventManagerInstance.updateMouseClick(e.pageX, e.pageY, e.button, true);
		}, false 
	);
	
	oContainer.addEventListener( "mouseup",
		function(e)
		{
			goMouseEventManagerInstance.updateMouseClick(e.pageX, e.pageY, e.button, false);
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
			/** If delta is nonzero, handle it.
			 * Basically, delta is now positive if wheel was scrolled up,
			 * and negative, if wheel was scrolled down.
			 */
			if (iDelta)
			{
				goMouseEventManagerInstance.UpdateMouseWheel(iDelta);
			}
			/** Prevent default actions caused by mouse wheel.
			 * That might be ugly, but we handle scrolls somehow
			 * anyway, so don't bother here..
			 */
			if (e.preventDefault)
					e.preventDefault();
			e.returnValue = false;
		}
	
	if (oContainer.addEventListener)
        window.addEventListener('DOMMouseScroll', oMouseWheelFunction, false);
	window.onmousewheel = document.onmousewheel = oMouseWheelFunction;
}
gtfInitializationFunctions.push(initializeMouseEventManager);