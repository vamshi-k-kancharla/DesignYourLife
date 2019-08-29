
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

    /**
     *
     * @param {string} categoryName : Name of category for which SubCategory Images have to be returned
     * 
     * @returns {Array} SubCategoryImages : Array of SubCategory Images corresponding to given Category
     *
     */

    function retrieveSubCategoryImagesForCategory(categoryName) {

        switch (categoryName) {

            case "food":

                return GlobalWebClientModule.foodCategoryContainer_ImageNames;

            case "accommodation":

                return GlobalWebClientModule.accommodationCategoryContainer_ImageNames;

            case "entertainment":

                return GlobalWebClientModule.entertainmentCategoryContainer_ImageNames;

            case "familycare":

                return GlobalWebClientModule.familycareCategoryContainer_ImageNames;

            case "movie":

                return GlobalWebClientModule.movieCategoryContainer_ImageNames;

            case "medicalandfitness":

                return GlobalWebClientModule.medicalandfitnessCategoryContainer_ImageNames;

            case "miscellaneous":

                return GlobalWebClientModule.miscellaneousCategoryContainer_ImageNames;

            case "shopping":

                return GlobalWebClientModule.shoppingCategoryContainer_ImageNames;

            case "transportation":

                return GlobalWebClientModule.transportationCategoryContainer_ImageNames;

            case "vacation":

                return GlobalWebClientModule.vacationCategoryContainer_ImageNames;

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
        retrieveSubCategoryImagesForCategory: retrieveSubCategoryImagesForCategory,

    };

})();
