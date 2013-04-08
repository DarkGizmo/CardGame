/**
	CardStackManager brings all the card stacks together so they can be queried
	when a cards are dropped to move them from stack to stack.
	
	Stacks needs to have
	- isPositionOnCardStack, which accepts (pfPositionX, pfPositionY) and returns true if this particular positon is on the card stack
*/
function CardStackManager()
{
	var mtoCardStacks = [];
	
	this.registerCardSlot = function(poCardSlot)
	{
		mtoCardStacks.push(poCardSlot);
	}
	
	this.unregisterCardSlot = function(poCardSlot)
	{
		for(var i = 0; i < mtoCardStacks.length; ++i)
		{
			if(mtoCardStacks[i] == poCardSlot)
			{
				mtoCardStacks.splice(i,1);
				return;
			}
		}
	}
	
	this.getCardSlotAtPosition = function(pfPositionX, pfPositionY)
	{
		for(var i = 0; i < mtoCardStacks.length; ++i)
		{
			if(mtoCardStacks[i].isPositionOnCardStack(pfPositionX, pfPositionY))
			{
				return mtoCardStacks[i];
			}
		}
	}
}

var goCardStackManager = new CardStackManager();