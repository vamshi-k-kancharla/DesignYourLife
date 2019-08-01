
var GlobalWebClientModule = (function () {

    var bDebug = false;

	var currentUserName_Key = "currentUserName";
	var currentBudget_Id_Key = "currentBudget_Id";
	var currentExpense_Category_Key = "currentExpense_Category";
    var currentExpense_SubCategory_Key = "currentExpense_SubCategory";

    // All Category & SubCategory Names for <Key, Value> Pair Retrieval
	
    var categoryNames = ["food", "accommodation", "entertainment", "familycare", "movie", "medicalandfitness", "miscellaneous", "shopping", "transportation", "vacation"];

	var food_SubCategories = ["coffeeshop","groceries","restaurants"];
	var accomodation_SubCategories = ["emi","housekeeping","hotel","rent","utilities"];
	var familycare_SubCategories = ["childcare","education","gifts"];
	var medicalAndFitness_SubCategories = ["gym","skincare","generic","insurance"];
	var miscellaneous_SubCategories = ["charity"];
	var shopping_SubCategories  = ["gadgets","fashion"];
	var transportation_SubCategories = ["carinsurance","vehicalmaintenance","fuel","rentalcar","taxi","train"];
	var vacation_SubCategories = ["accomodation","sightseeing","fuel","rentalcar","taxi","train"];

    // dummy Result Object For <Key, Value> Pairs display

    var dummyResultObject_SummaryDetails = { currentCategory: "dummy", noOfExpenses: "100", expenditure: "4500" };

    // Expose local variables for global access

    return {

        bDebug: bDebug,

		currentUserName_Key : currentUserName_Key,
		currentBudget_Id_Key : currentBudget_Id_Key,
		currentExpense_Category_Key : currentExpense_Category_Key,
		currentExpense_SubCategory_Key : currentExpense_SubCategory_Key,

        categoryNames: categoryNames,

        food_SubCategories: food_SubCategories,
		accomodation_SubCategories : accomodation_SubCategories,
		familycare_SubCategories : familycare_SubCategories,
        medicalAndFitness_SubCategories: medicalAndFitness_SubCategories,
        miscellaneous_SubCategories: miscellaneous_SubCategories,
        shopping_SubCategories: shopping_SubCategories,
        transportation_SubCategories: transportation_SubCategories,
        vacation_SubCategories: vacation_SubCategories,

        dummyResultObject_SummaryDetails: dummyResultObject_SummaryDetails
	}

}) ();