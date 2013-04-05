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
	var moMouseEventComponent = null;
	var moDrawComponent = null;
	
	var moOldCardStack;
	var moNewCardStack;
	
	this.draw = function(poCanvas)
	{
		var cardWidth = moCardImage.width * 0.5;
		poCanvas.drawImage(moCardImage, (mbFaceUp ? 0.0 : cardWidth), 0.0, cardWidth, moCardImage.height, this.fPositionX, this.fPositionY, cardWidth * this.fScale, moCardImage.height * this.fScale);
		
		if(mbFaceUp && this.sText != "")
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
	
	this.setFaceUp = function(pbNewFaceUp)
	{
		if(mbFaceUp != pbNewFaceUp)
		{
			mbFaceUp = pbNewFaceUp;
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
			mbShouldDrawText = mbFaceUp;
		}
	};
	
	this.getSize = function()
	{
		var size = new Object();
		size.x = moCardImage.width * 0.5 * this.fScale;
		size.y = moCardImage.height * this.fScale;
		
		return size;
	}
	
	this.updateCursor = function()
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
	
	this.onMouseOver = function()
	{
		this.updateCursor();
	}
	
	this.onMouseOut = function()
	{
		this.updateCursor();
	}
	
	this.onMouseDown = function(piButton)
	{
		if(piButton == MouseClickType.eLeftClick)
		{
			this.updateCursor();
		}
	}
	
	this.onMouseUp = function(piButton)
	{
		if(piButton == MouseClickType.eLeftClick)
		{
			if(moNewCardStack != null)
			{
				moNewCardStack.popCard();
				while(moNewCardStack.getCardCount() != 0)
				{
					moOldCardStack.pushCard(moNewCardStack.popCard());
				}
				moOldCardStack.pushCard(this);
				
				moNewCardStack = null;
				moOldCardStack = null;
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
				moOldCardStack = this.oParentStack;
				moNewCardStack = new CardStack(CardStackStyling.DragStack);
				moNewCardStack.setPosition(this.fPositionX, this.fPositionY);
				moNewCardStack.pushCard(this.oParentStack.popCard());
				moNewCardStack.bBeingMoved = true;
			}
			
			moNewCardStack.onMouseDrag(piButton, pfDeltaMoveX, pfDeltaMoveY);
		}
	}
	
	this.onMouseWheel = function(piDelta)
	{
		if(this.oParentStack != null && moNewCardStack != null)
		{
			if(piDelta > 0)
			{
				if(moOldCardStack.getCardCount() > 0)
				{
					moNewCardStack.popCard();
					moNewCardStack.pushCard(moOldCardStack.popCard());
					moNewCardStack.pushCard(this);
				}
			}
			else
			{
				if(moNewCardStack.getCardCount() > 1)
				{
					moNewCardStack.popCard();
					moOldCardStack.pushCard(moNewCardStack.popCard());
					moNewCardStack.pushCard(this);
				}
			}
		}
	}
}