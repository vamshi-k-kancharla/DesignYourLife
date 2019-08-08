
var RenderingHelperUtilsModule = (function () {

    /**
     *
     * Dynamically adjust the height of Side Navigators based on main window container height
     *  
     * @param {string} mainContentWindowId  : Id of main content window
     * @param {string} leftNavigatorId  : Id of Left Side Navigator
     * @param {string} rightNavigatorId  : Id of Right Side Navigator
     * @param {string} headerNavId  : Id of Header Navigator
     * @param {string} footerNavId  : Id of Footer Navigator
     * @param {string} bottomBufferFactor  : Buffer height of Side Navigators as a factor of content window
     *
     */

    function changeHeightOfSideNavigators(mainContentWindowId, leftNavigatorId, rightNavigatorId, headerNavId,
        footerNavId, bottomBufferFactor) {

        if (GlobalWebClientModule.bDebug == true) {

            alert("screen.height : " + screen.height + "; screen.width : " + screen.width);
            alert("mainContentWindow.clientHeight : " + document.getElementById(mainContentWindowId).clientHeight);
            alert("document.height : " + $(document).height() + "; document.width : " + $(document).width());
        }

        var sideNavigatorHeightWithPadding = 0;
        var currentPageHeight = $(document).height();

        if ((document.getElementById(headerNavId).clientHeight +
            document.getElementById(footerNavId).clientHeight +
            document.getElementById(mainContentWindowId).clientHeight) < currentPageHeight) {

            sideNavigatorHeightWithPadding = (currentPageHeight - document.getElementById(headerNavId).clientHeight -
                document.getElementById(footerNavId).clientHeight) * bottomBufferFactor;

        } else {

            sideNavigatorHeightWithPadding = document.getElementById(mainContentWindowId).clientHeight * bottomBufferFactor;
        }

        var navigatorHeight = sideNavigatorHeightWithPadding.toString() + "px";
        document.getElementById(leftNavigatorId).style.height = navigatorHeight;
        document.getElementById(rightNavigatorId).style.height = navigatorHeight;
    }

    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        changeHeightOfSideNavigators: changeHeightOfSideNavigators,

    };

})();
