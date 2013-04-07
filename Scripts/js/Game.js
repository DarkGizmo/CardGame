function initializeGame()
{
	goDrawManagerInstance.SetBackground("Assets/Images/Background.png");
	
	var cardLot = new CardStack(CardStackStyling.StaminaBar);
	var cardLot2 = new CardStack(CardStackStyling.SimpleStack);
	
	var lotSize = Math.round(Math.random() * 10.0);
	for(i = 0; i < lotSize; ++i)
	{
		cardLot.pushCard(new Card("Assets/Images/Card.png"));
	}
	cardLot.setPosition(100, 100);
	
	lotSize = Math.round(Math.random() * 10.0);
	for(i = 0; i < lotSize; ++i)
	{
		cardLot2.pushCard(new Card("Assets/Images/Card.png"));
	}
	cardLot2.setPosition(250, 100);
}
gtfInitializationFunctions.push(initializeGame);