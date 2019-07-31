var GlobalWebClientModule = (function(){

	var currentUserName_Key = "currentUserName";
	var currentBudget_Id_Key = "currentBudget_Id";
	var currentExpense_Category_Key = "currentExpense_Category";
	var currentExpense_SubCategory_Key = "currentExpense_SubCategory";
	

	var categories_Key = ["food","accomodation","familycare","movie","medicalandfitness","miscellaneous","shopping","transportation","vacation"];
	var foodSubCategories = ["coffeeshop","groceries","restaurants"];
	var accomodationSubCategories = ["emi","housekeeping","hotel","rent","utilities"];
	var familycareSubCategories = ["childcare","education","gifts"];
	var medicalandfitnessSubCategories = ["gym","skincare","generic","insurance"];
	var miscellaneousSubCategories = ["charity"];
	var shoppingSubCategories  = ["gadgets","fashion"];
	var transportationSubCategories = ["carinsurance","vehicalmaintenance","fuel","rentalcar","taxi","train"];
	var vacationSubCategories = ["accomodation","sightseeing","fuel","rentalcar","taxi","train"];

	return {

		currentUserName_Key : currentUserName_Key,
		currentBudget_Id_Key : currentBudget_Id_Key,
		currentExpense_Category_Key : currentExpense_Category_Key,
		currentExpense_SubCategory_Key : currentExpense_SubCategory_Key,

		categories_Key : categories_Key,
		foodSubCategories : foodSubCategories,
		accomodationSubCategories : accomodationSubCategories,
		familycareSubCategories : familycareSubCategories,
		medicalandfitnessSubCategories : medicalandfitnessSubCategories,
		miscellaneousSubCategories : miscellaneousSubCategories,
		shoppingSubCategories : shoppingSubCategories,
		transportationSubCategories : transportationSubCategories,
		vacationSubCategories : vacationSubCategories
	}

}) ();