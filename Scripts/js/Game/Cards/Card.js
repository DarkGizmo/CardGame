function Card(psCardImagePath)
{
	this.fPositionX = 0;
	this.fPositionY = 0;
	this.fScale = 1.0;
	this.fRotation = 0.0;
	this.sText = "";
	
	this.oParentStack = null;
	
	var moCardImage = null;
	var mbFaceUp = false;
	var mbDrawText = false;
	var moMouseEventComponent = null;
	var moDrawComponent = null;
	
	
	var moOldCardStack;
	var moNewCardStack;
	
	this.ctor = function()
	{
		moCardImage = new Image();
		moCardImage.src = psCardImagePath;
	}
	
	this.draw = function(poCanvas)
	{
		poCanvas.save();
		{
			poCanvas.translate(this.fPositionX, this.fPositionY);
			poCanvas.rotate(this.fRotation);
			
			var cardWidth = moCardImage.width * 0.5;
			poCanvas.drawImage(moCardImage, (mbFaceUp ? cardWidth : 0.0), 0.0, cardWidth, moCardImage.height, 0, 0, cardWidth * this.fScale, moCardImage.height * this.fScale);
			
			if(mbDrawText && this.sText != "")
			{
				Text.drawText(poCanvas, this.sText, 0 + this.getSize().x * 0.5, 0 + this.getSize().y * 0.5, FontTypes.oCard, "center", "middle");
			}
		}
		poCanvas.restore();
		
		// Hack move this to an update manager
		if(moMouseEventComponent != null)
		{
			moMouseEventComponent.update(this.fPositionY, this.fPositionX , this.getSize().x, this.getSize().y);
		}
	};
	
	this.isFaceUp = function()
	{
		return mbFaceUp;
	}
	
	this.setFaceUp = function(pbNewFaceUp, pbEnableDrag)
	{
		if(pbEnableDrag == null)
		{
			pbEnableDrag = false;
		}
		
		if(mbFaceUp != pbNewFaceUp)
		{
			mbFaceUp = pbNewFaceUp;
			
			if(pbEnableDrag && mbFaceUp)
			{
				moMouseEventComponent = 
					goMouseEventManager.addComponent(this, this.fPositionY, this.fPositionX, this.getSize().x, this.getSize().y);
			}
			else if(moMouseEventComponent != null)
			{
				goMouseEventManager.removeComponent(this);
				moMouseEventComponent = null;
			}
			
			this.setDrawText(mbFaceUp);
		}
	};
	
	this.setDrawText = function(pbDrawText)
	{
		mbDrawText = pbDrawText;
	}
	
	this.getSize = function()
	{
		var size = new Object();
		size.x = moCardImage.width * 0.5 * this.fScale;
		size.y = moCardImage.height * this.fScale;
		
		return size;
	}
	
	this.updateCursor = function()
	{
		if(moMouseEventComponent != null)
		{
			if(moMouseEventComponent.tbMouseDown[MouseClickType.eLeftClick])
			{
				setCursorStyle("url(Assets/Images/UI/DragCursor.png)");
			}
			else if(moMouseEventComponent.bMouseOver)
			{
				setCursorStyle("url(Assets/Images/UI/GrabCursor.png)");
			}
			else
			{
				setCursorStyle("auto");
			}
		}
		else
		{
			setCursorStyle("auto");
		}
	}
	
	this.getCardDropOutCount = function()
	{
		return moOldCardStack.getDropOutMaxCount() - this.oParentStack.getCardCount();
	}
	
	this.onMouseIn = function()
	{
		this.updateCursor();
		
		return true;
	}
	
	this.onMouseOut = function()
	{
		this.updateCursor();
	}
	
	this.onMouseDown = function(piButton, pfPositionX, pfPositionY)
	{
		if(piButton == MouseClickType.eLeftClick)
		{
			this.updateCursor();
			
			return true;
		}
	}
	
	this.onMouseUp = function(piButton, pfPositionX, pfPositionY)
	{
		if(piButton == MouseClickType.eLeftClick)
		{
			if(moNewCardStack != null)
			{
				var bValidCardSlot = false;
				var oCardStack = goCardStackManager.getCardStackAtPosition(pfPositionX, pfPositionY);
				
				if(oCardStack != null)
				{
					bValidCardSlot = oCardStack.validate(moNewCardStack);
				}
				
				if(!bValidCardSlot)
				{
					moNewCardStack.popCard();
					while(moNewCardStack.getCardCount() != 0)
					{
						moOldCardStack.pushCard(moNewCardStack.popCard());
					}
					moOldCardStack.pushCard(this);
				}
				else
				{
					oCardStack.assignCardStack(moNewCardStack);
				}
				
				moOldCardStack.flipFrontCard();
				
				moNewCardStack.destroy();
				moNewCardStack = null;
				moOldCardStack = null;
				
				// This might have been invalidate if the card has changed stack
				if(moMouseEventComponent != null)
				{
					moMouseEventComponent.setZOrder(0);
				}
			}
			
			this.updateCursor();
		}
	}
	
	this.onMouseDrag = function(piButton, pfDeltaMoveX, pfDeltaMoveY)
	{
		if(piButton == MouseClickType.eLeftClick)
		{
			// We just started dragging
			if(moNewCardStack == null)
			{
				var bShouldFlipCard = this.oParentStack.getDropOutMaxCount() - 1 != 0;
				
				moOldCardStack = this.oParentStack;
				moNewCardStack = new CardStack(CardStackStyling.VisualStyle.oDragStack, CardStackStyling.InteractiveStyle.oDragStack);
				moNewCardStack.setPosition(this.fPositionX, this.fPositionY);
				moNewCardStack.pushCard(moOldCardStack.popCard(bShouldFlipCard));
				
				moMouseEventComponent.setZOrder(100);
				moNewCardStack.getDrawComponent().setZOrder(100);
			}
			
			moNewCardStack.onMouseDrag(piButton, pfDeltaMoveX, pfDeltaMoveY);
			
			return true;
		}
	}
	
	this.onMouseWheel = function(piDelta)
	{
		if(this.oParentStack != null && moNewCardStack != null)
		{
			if(piDelta > 0)
			{
				if(moOldCardStack.getCardCount() > 0 && this.getCardDropOutCount() != 0)
				{
					var bShouldFlipCard = moOldCardStack.getDropOutMaxCount() - this.oParentStack.getCardCount() - 1 != 0;
					// Keep this card on top, so that we don't recreate all the components for the new top card
					moNewCardStack.popCard();
					{
						moNewCardStack.pushCard(moOldCardStack.popCard(bShouldFlipCard));
					}
					moNewCardStack.pushCard(this);
				}
			}
			else
			{
				if(moNewCardStack.getCardCount() > 1)
				{
					// Keep this card on top, so that we don't recreate all the components for the new top card
					moNewCardStack.popCard();
					{
						moOldCardStack.pushCard(moNewCardStack.popCard(), this.getCardDropOutCount() != 0);
					}
					moNewCardStack.pushCard(this);
				}
			}
			
			return true;
		}
	}
	
	this.ctor();
}
