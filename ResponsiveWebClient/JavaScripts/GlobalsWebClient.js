
var GlobalWebClientModule = (function () {

    // Globals & Configs

    var bDebug = false;
    var webServerPrefix = "http://127.0.0.1:4500/?";
    var imageResourcePath = "./Resources/Pictures/";

    // Current User Context : Local cache

	var currentUserName_Key = "currentUserName";
	var currentBudget_Id_Key = "currentBudget_Id";
	var currentExpense_Category_Key = "currentExpense_Category";
    var currentExpense_SubCategory_Key = "currentExpense_SubCategory";

    // All Category & SubCategory Names for <Key, Value> Pair Retrieval
	
    var categoryNames = ["food", "accommodation", "entertainment", "familycare", "movie", "medicalandfitness",
        "miscellaneous", "shopping", "transportation", "vacation"];
    var categoryContainer_ImageNames = ["food.jpg", "accommodation.jpg", "entertainment.jpg", "familycare.jpg", "movie.jpg", "gym.jpg",
        "miscellaneous.jpg", "shopping.jpg", "transportation.jpg", "vacation.jpg"]
    var categoryPageNames = ["./Food.html", "./Accommodation.html", "./Entertainment.html", "./FamilyCare.html",
        "./Entertainment.html", "./MedicalAndFitness.html", "./Miscellaneous.html", "./Shopping.html", "./Transportation.html",
        "./Vacation.html"];

    var food_SubCategories = ["coffeeshop", "groceries", "restaurants"];
    var foodCategoryContainer_ImageNames = ["coffeeshop.jpg", "groceries.jpg", "restaurants.jpg"];
    var foodCategoryPageNames = ["./Expense_Info.html"];

    var accomodation_SubCategories = ["emi", "housekeeping", "hotel", "rent", "utilities"];
    var accomodationCategoryContainer_ImageNames = ["emi.jpg", "housekeeping.jpg", "hotel.jpg", "rent.jpg", "utilities.jpg"];
    var accomodationCategoryPageNames = ["./Expense_Info.html"];

    var entertainment_SubCategories = ["movie", "clubs"];
    var entertainmentCategoryContainer_ImageNames = ["movie.jpg", "clubs.jpg"];
    var entertainmentCategoryPageNames = ["./Expense_Info.html"];

    var familycare_SubCategories = ["childcare", "education", "gifts"];
    var familycareCategoryContainer_ImageNames = ["childcare.png", "education.jpg", "gifts.jpeg"];
    var familycareCategoryPageNames = ["./Expense_Info.html"];

    var medicalAndFitness_SubCategories = ["gym", "skincare", "generic", "insurance"];
    var medicalAndFitnessCategoryContainer_ImageNames = ["gym.jpg", "skincare.jpg", "generic.jpg", "insurance.jpg"];
    var medicalAndFitnessCategoryPageNames = ["./Expense_Info.html"];

    var miscellaneous_SubCategories = ["charity"];
    var miscellaneousCategoryContainer_ImageNames = ["charity.jpg"];
    var miscellaneousCategoryPageNames = ["./Expense_Info.html"];

    var shopping_SubCategories = ["gadgets", "fashion"];
    var shoppingCategoryContainer_ImageNames = ["gadgets.jpg", "fashion.jpg"];
    var shoppingCategoryPageNames = ["./Expense_Info.html"];

    var transportation_SubCategories = ["carinsurance", "vehiclemaintenance", "fuel", "rentalcar", "taxi", "train"];
    var transportationCategoryContainer_ImageNames = ["carinsurance.jpg", "vehiclemaintenance.jpg", "fuel.jpg", "rentalcar.jpg",
        "taxi.jpg", "train.jpg"];
    var transportationCategoryPageNames = ["./Expense_Info.html"];

	var vacation_SubCategories = ["accommodation","sightseeing","fuel","rentalcar","taxi","train"];
    var vacationCategoryContainer_ImageNames = ["accommodation.jpg", "sightseeing.jpg", "fuel.jpg", "rentalcar.jpg",
        "taxi.jpg", "train.jpg"];
    var vacationCategoryPageNames = ["./Expense_Info.html"];

    // Form Data Input Ids, Keys & Validation Reqs

    var userRegistrationData_InputIds = ["UserType", "Name", "Location", "Email", "Address", "UserName", "Password", "Repeat-Password"];
    var userRegistrationData_Keys = ["User_Id", "UserType", "Name", "Location", "Email", "Address", "UserName", "Password", "Repeat-Password"];
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
        imageResourcePath: imageResourcePath,

        // Current User Context : Local cache

		currentUserName_Key : currentUserName_Key,
		currentBudget_Id_Key : currentBudget_Id_Key,
		currentExpense_Category_Key : currentExpense_Category_Key,
		currentExpense_SubCategory_Key : currentExpense_SubCategory_Key,

        // Global data related to Categories & SubCategories

        categoryNames: categoryNames,
        categoryContainer_ImageNames: categoryContainer_ImageNames,
        categoryPageNames: categoryPageNames,

        food_SubCategories: food_SubCategories,
        foodCategoryContainer_ImageNames: foodCategoryContainer_ImageNames,
        foodCategoryPageNames: foodCategoryPageNames,

        accomodation_SubCategories: accomodation_SubCategories,
        accomodationCategoryContainer_ImageNames: accomodationCategoryContainer_ImageNames,
        accomodationCategoryPageNames: accomodationCategoryPageNames,

        entertainment_SubCategories: entertainment_SubCategories,
        entertainmentCategoryContainer_ImageNames: entertainmentCategoryContainer_ImageNames,
        entertainmentCategoryPageNames: entertainmentCategoryPageNames,

        familycare_SubCategories: familycare_SubCategories,
        familycareCategoryContainer_ImageNames: familycareCategoryContainer_ImageNames,
        familycareCategoryPageNames: familycareCategoryPageNames,

        medicalAndFitness_SubCategories: medicalAndFitness_SubCategories,
        medicalAndFitnessCategoryContainer_ImageNames: medicalAndFitnessCategoryContainer_ImageNames,
        medicalAndFitnessCategoryPageNames: medicalAndFitnessCategoryPageNames,

        miscellaneous_SubCategories: miscellaneous_SubCategories,
        miscellaneousCategoryContainer_ImageNames: miscellaneousCategoryContainer_ImageNames,
        miscellaneousCategoryPageNames: miscellaneousCategoryPageNames,

        shopping_SubCategories: shopping_SubCategories,
        shoppingCategoryContainer_ImageNames: shoppingCategoryContainer_ImageNames,
        shoppingCategoryPageNames: shoppingCategoryPageNames,

        transportation_SubCategories: transportation_SubCategories,
        transportationCategoryContainer_ImageNames: transportationCategoryContainer_ImageNames,
        transportationCategoryPageNames: transportationCategoryPageNames,

        vacation_SubCategories: vacation_SubCategories,
        vacationCategoryContainer_ImageNames: vacationCategoryContainer_ImageNames,
        vacationCategoryPageNames: vacationCategoryPageNames,

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