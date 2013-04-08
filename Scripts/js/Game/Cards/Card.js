function Card(psCardImagePath)
{
	this.fPositionX = 0;
	this.fPositionY = 0;
	this.fScale = 1.0;
	this.sText = "";
	
	this.oParentStack = null;
	
	var moCardImage = new Image();
	moCardImage.src = psCardImagePath;
	var mbFaceUp = false;
	var mbDrawText = false;
	var moMouseEventComponent = null;
	var moDrawComponent = null;
	
	
	var moOldCardStack;
	var moNewCardStack;
	
	this.draw = function(poCanvas)
	{
		var cardWidth = moCardImage.width * 0.5;
		poCanvas.drawImage(moCardImage, (mbFaceUp ? cardWidth : 0.0), 0.0, cardWidth, moCardImage.height, this.fPositionX, this.fPositionY, cardWidth * this.fScale, moCardImage.height * this.fScale);
		
		if(mbDrawText && this.sText != "")
		{
			Text.drawText(poCanvas, this.sText, this.fPositionX + this.getSize().x * 0.5, this.fPositionY + this.getSize().y * 0.5, FontTypes.oCard, "center", "middle");
		}
		
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
			
			if(pbEnableDrag)
			{
				if(!mbFaceUp)
				{
					goMouseEventManagerInstance.removeComponent(this);
					moMouseEventComponent = null;
				}
				else
				{
					moMouseEventComponent = 
					goMouseEventManagerInstance.addComponent(this, this.fPositionY, this.fPositionX, this.getSize().x, this.getSize().y);
				}
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
				var oCardSlot = goCardStackManager.getCardSlotAtPosition(pfPositionX, pfPositionY);
				
				if(oCardSlot != null)
				{
					bValidCardSlot = oCardSlot.validate(moNewCardStack);
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
					oCardSlot.assignCardStack(moNewCardStack);
					moNewCardStack.bBeingMoved = false;
				}
				
				moOldCardStack.flipFrontCard();
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
			if(moNewCardStack == null)
			{
				var bShouldFlipCard = this.oParentStack.getDropOutMaxCount() - 1 != 0;
				
				moOldCardStack = this.oParentStack;
				moNewCardStack = new CardStack(CardStackStyling.VisualStyle.oDragStack, CardStackStyling.InteractiveStyle.oDragStack);
				moNewCardStack.setPosition(this.fPositionX, this.fPositionY);
				moNewCardStack.pushCard(this.oParentStack.popCard(bShouldFlipCard));
				moNewCardStack.bBeingMoved = true;
				
				moMouseEventComponent.setZOrder(100);
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
					moNewCardStack.popCard();
					moNewCardStack.pushCard(moOldCardStack.popCard(bShouldFlipCard));
					moNewCardStack.pushCard(this);
				}
			}
			else
			{
				if(moNewCardStack.getCardCount() > 1)
				{
					moNewCardStack.popCard();
					moOldCardStack.pushCard(moNewCardStack.popCard(), this.getCardDropOutCount() != 0);
					moNewCardStack.pushCard(this);
				}
			}
			
			return true;
		}
	}
}