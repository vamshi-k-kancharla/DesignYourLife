
var CategoryHelperUtilsModule = (function () {

    /**
     *
     * @param {string} categoryName : Name of category for which SubCategories have to be returned
     * 
     * @returns {Array} SubCategories : Array of SubCategories corresponding to given Category
     *
     */

    function retrieveSubCategoriesForCategory(categoryName) {

        switch (categoryName) {

            case "food":

                return GlobalWebClientModule.food_SubCategories;

            case "accommodation":

                return GlobalWebClientModule.accommodation_SubCategories;

            case "entertainment":

                return GlobalWebClientModule.entertainment_SubCategories;

            case "familycare":

                return GlobalWebClientModule.familycare_SubCategories;

            case "movie":

                return GlobalWebClientModule.movie_SubCategories;

            case "medicalandfitness":

                return GlobalWebClientModule.medicalandfitness_SubCategories;

            case "miscellaneous":

                return GlobalWebClientModule.miscellaneous_SubCategories;

            case "shopping":

                return GlobalWebClientModule.shopping_SubCategories;

            case "transportation":

                return GlobalWebClientModule.transportation_SubCategories;

            case "vacation":

                return GlobalWebClientModule.vacation_SubCategories;

            default:

                if (GlobalWebClientModule.bDebug == true) {

                    alert("Inappropriate CategoryName passed as input: ");
                }
                return null;
        }

    }

    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        retrieveSubCategoriesForCategory: retrieveSubCategoriesForCategory,

    };

})();
