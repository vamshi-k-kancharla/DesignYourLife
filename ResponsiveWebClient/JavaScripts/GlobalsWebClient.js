
var GlobalWebClientModule = (function () {

    // Globals & Configs

    var bDebug = false;
    var webServerPrefix = "http://127.0.0.1:4500/?";

    // Current User Context : Local cache

	var currentUserName_Key = "currentUserName";
	var currentBudget_Id_Key = "currentBudget_Id";
	var currentExpense_Category_Key = "currentExpense_Category";
    var currentExpense_SubCategory_Key = "currentExpense_SubCategory";

    // All Category & SubCategory Names for <Key, Value> Pair Retrieval
	
    var categoryNames = ["food", "accommodation", "entertainment", "familycare", "movie", "medicalandfitness", "miscellaneous", "shopping", "transportation", "vacation"];

	var food_SubCategories = ["coffeeshop","groceries","restaurants"];
	var accomodation_SubCategories = ["emi","housekeeping","hotel","rent","utilities"];
    var entertainment_SubCategories = ["movie", "clubs"];
	var familycare_SubCategories = ["childcare","education","gifts"];
	var medicalAndFitness_SubCategories = ["gym","skincare","generic","insurance"];
	var miscellaneous_SubCategories = ["charity"];
	var shopping_SubCategories  = ["gadgets","fashion"];
    var transportation_SubCategories = ["carinsurance","vehiclemaintenance","fuel","rentalcar","taxi","train"];
	var vacation_SubCategories = ["accommodation","sightseeing","fuel","rentalcar","taxi","train"];

    // Form Data Input Ids, Keys & Validation Reqs

    var userRegistrationData_InputIds = ["UserType", "Name", "Location", "Email", "Address", "UserName", "Password"];
    var userRegistrationData_Keys = ["User_Id", "UserType", "Name", "Location", "Email", "Address", "UserName", "Password"];
    var userRegistrationData_RequiredKeys = ["User_Id", "UserType", "Name", "Email", "Address", "UserName", "Password"];

    var userAuthenticationData_InputIds = ["UserName", "Pwd"];
    var userAuthenticationData_Keys = ["UserName", "Password"];
    var userAuthenticationData_RequiredKeys = ["UserName", "Password"];

    var budgetRecordData_InputIds = ["BudgetName", "Budget_Type", "Place", "StartDate", "EndDate", "Amount"];
    var budgetRecordData_Keys = ["Budget_Id", "BudgetName", "Budget_Type", "Place", "StartDate", "EndDate", "Amount", "UserName"];
    var budgetRecordData_RequiredKeys = ["Budget_Id", "BudgetName", "Budget_Type", "Place", "StartDate", "EndDate", "Amount", "UserName"];

    var expenseRecordData_InputIds = ["ExpenseName", "Expense_Type", "Place", "Date", "Amount", "MerchantName", "Budget_Id"];
    var expenseRecordData_Keys = ["Expense_Id", "ExpenseName", "Expense_Type", "Place", "Date",
        "Amount", "MerchantName", "Budget_Id", "Expense_Category", "Expense_SubCategory", "UserName"];
    var expenseRecordData_RequiredKeys = ["Expense_Id", "ExpenseName", "Expense_Type", "Place", "Date", "Amount",
        "MerchantName", "Budget_Id", "Expense_Category", "Expense_SubCategory", "UserName"];

    // dummy Result Object For <Key, Value> Pairs display

    var dummyResultObject_SummaryDetails = { currentCategory: "dummy", noOfExpenses: "100", expenditure: "4500" };
    var dummyResultObject_ExpenseDetails = { merchantName: "Subway", place: "Hyderabad", expenditure: "200" };

    // Expose local variables for global access

    return {

        // Globals & Configs

        bDebug: bDebug,
        webServerPrefix: webServerPrefix,

        // Current User Context : Local cache

		currentUserName_Key : currentUserName_Key,
		currentBudget_Id_Key : currentBudget_Id_Key,
		currentExpense_Category_Key : currentExpense_Category_Key,
		currentExpense_SubCategory_Key : currentExpense_SubCategory_Key,

        // Global data related to Categories & SubCategories

        categoryNames: categoryNames,

        food_SubCategories: food_SubCategories,
        accomodation_SubCategories: accomodation_SubCategories,
        entertainment_SubCategories: entertainment_SubCategories,
		familycare_SubCategories : familycare_SubCategories,
        medicalAndFitness_SubCategories: medicalAndFitness_SubCategories,
        miscellaneous_SubCategories: miscellaneous_SubCategories,
        shopping_SubCategories: shopping_SubCategories,
        transportation_SubCategories: transportation_SubCategories,
        vacation_SubCategories: vacation_SubCategories,

        // Global data related to Form Data Input Processing

        userRegistrationData_InputIds: userRegistrationData_InputIds,
        userRegistrationData_Keys: userRegistrationData_Keys,
        userRegistrationData_RequiredKeys: userRegistrationData_RequiredKeys,

        userAuthenticationData_InputIds: userAuthenticationData_InputIds,
        userAuthenticationData_Keys: userAuthenticationData_Keys,
        userAuthenticationData_RequiredKeys: userAuthenticationData_RequiredKeys,

        budgetRecordData_InputIds: budgetRecordData_InputIds,
        budgetRecordData_Keys: budgetRecordData_Keys,
        budgetRecordData_RequiredKeys: budgetRecordData_RequiredKeys,

        expenseRecordData_InputIds: expenseRecordData_InputIds,
        expenseRecordData_Keys: expenseRecordData_Keys,
        expenseRecordData_RequiredKeys: expenseRecordData_RequiredKeys,

        // Dummy Result Objects

        dummyResultObject_SummaryDetails: dummyResultObject_SummaryDetails,
        dummyResultObject_ExpenseDetails: dummyResultObject_ExpenseDetails
	}

}) ();