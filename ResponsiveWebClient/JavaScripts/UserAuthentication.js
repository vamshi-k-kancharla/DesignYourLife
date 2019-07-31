var userAuthenticationModule = (function(){

   var webServerPrefix = "http://127.0.0.1:4500/?";

   //user registraion for signup

         function userRegistration(){

           var todaysDate = new Date();
           var uniqueUserId = "UserId_" + todaysDate.getYear().toString() + todaysDate.getMonth().toString() + todaysDate.getDate().toString()
            + todaysDate.getHours().toString() + todaysDate.getMinutes().toString() + todaysDate.getSeconds().toString();

            var User_Id_value = uniqueUserId;
            var UserType_value = document.getElementById('UserType').value;
            var Name_value = document.getElementById('Name').value;
            var Location_value = document.getElementById('Location').value;
            var Email_value = document.getElementById('Email').value;
            var Address_value = document.getElementById('Address').value;
            var UserName_value = document.getElementById('UserName').value;
            var Password_value = document.getElementById('Password').value;

            if (User_Id_value == "" || UserType_value == "" || Name_value == "" || Location_value == "" || Email_value == "" || Address_value == "" || UserName_value == "" || Password_value == "" ){

              alert("one or many of the required input values are missing for User Registration : please try again");
             
              return ;

            }

            var userRegistration_keys = ["User_Id","UserType","Name","Location","Email","Address","UserName","Password"];
            var userRegistration_value = [User_Id_value,UserType_value,Name_value,Location_value,Email_value,Address_value,UserName_value,Password_value];
            var userRegistrationData = new Map();

            for(var i = 0; i < userRegistration_keys.length; i++){

              userRegistrationData.set(userRegistration_keys[i],userRegistration_value[i]);
            
            }


            var Client_Request = "UserRegistration";

            userRegistration_mongoDB(userRegistrationData,Client_Request);


          }

        function userRegistration_mongoDB(userRegistrationData,Client_Request) {

          var xmlhttp;

          var httpRequest = webServerPrefix;

          xmlhttp = new XMLHttpRequest();

          httpRequest += "Client_Request=" + Client_Request;

          var userRegistrationKey = userRegistrationData.keys();

          for (var presentKey of userRegistrationKey) {

            httpRequest += "&"
            httpRequest += presentKey + "=" + userRegistrationData.get(presentKey);
            
          }

          xmlhttp.open("POST", httpRequest, true);

          xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

          xmlhttp.setRequestHeader("accept", "application/json");

           xmlhttp.onreadystatechange = function () {

          if (this.readyState == 4 && this.status == 200) {

          responseObject = JSON.parse(this.responseText);

            alert("Request :" + responseObject.Request + " , status : " + responseObject.Status); 

            document.location.replace("./homepage.html");


           }

          };


          window.localStorage.setItem( HelperFunctionModule.currentUserName_Key, userRegistrationData.get("UserName") );

          xmlhttp.send();

        }

        //user authentication for login page


        function processUserLogin(){

          var UserName_value = document.getElementById('username').value;
          var Password_value = document.getElementById('pwd').value;

          if(UserName_value == "" || Password_value == ""){

            alert("please fill the UserName/password : please try again");

            return;
          }

          var userlogin_keys = ["UserName","Password"];
          var userlogin_values = [UserName_value,Password_value];
          var userLoginData = new Map();

          for(var i = 0 ; i < userlogin_keys.length ; i++){
            userLoginData.set(userlogin_keys[i],userlogin_values[i]);
          }

          var Client_Request = "UserAuthentication";

          processUserLogin_mongoDB(userLoginData,Client_Request);


        }

        function processUserLogin_mongoDB(userLoginData,Client_Request){

          var xmlhttp;

          var httpRequest = webServerPrefix;

          xmlhttp = new XMLHttpRequest();

          httpRequest += "Client_Request=" + Client_Request;

          var userloginKey = userLoginData.keys();

          for (var presentKey of userloginKey) {

            httpRequest += "&"
            httpRequest += presentKey + "=" + userLoginData.get(presentKey);
            
          }

          xmlhttp.open("POST", httpRequest, true);

          xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

          xmlhttp.setRequestHeader("accept", "application/json");

          xmlhttp.onreadystatechange = function() {

          if (this.readyState == 4 && this.status == 200) {

          responseObject = JSON.parse(this.responseText);

          alert("Request :"+ responseObject.Request +" , status :  "+ responseObject.Status); 

            document.location.replace("./categories.html");

           }else if (this.readyState == 4 && this.status == 400 ){

            responseObject = JSON.parse(this.responseText);

          alert("Request :"+ responseObject.Request +" , status :  "+ responseObject.Status); 

           }

          };

          xmlhttp.send();

        }




        // user Budget-Details




        function userAddBudget(){

           var todaysDate = new Date();
           var uniqueBudgetId = "Budget_Id_" + todaysDate.getYear().toString() + todaysDate.getMonth().toString() + todaysDate.getDate().toString()
            + todaysDate.getHours().toString() + todaysDate.getMinutes().toString() + todaysDate.getSeconds() + todaysDate.getMilliseconds().toString();

          var Budget_Id_value = uniqueBudgetId;
          var Name_Id_value = document.getElementById('Name').value;
          var Budget_Type_value = document.getElementById('Budget_Type').value;
          var Place_value = document.getElementById('Place').value;
          var StartDate_value = document.getElementById('StartDate').value;
          var EndDate_value = document.getElementById('EndDate').value;
          var Amount_value = document.getElementById('Amount').value;
          var UserName_value = window.localStorage.getItem(HelperFunctionModule.currentUserName_Key);

          if (Budget_Id_value == "" || Name_Id_value == "" || Budget_Type_value == "" || Place_value == "" || StartDate_value == "" || EndDate_value == "" || Amount_value == "" || UserName_value == "" ){

            alert("one or many of the required input values are missing : please try again");

            return ;

          }

          var userbudget_keys = ["Budget_Id","Name","Budget_Type","Place","StartDate","EndDate","Amount","UserName"];
          var userbudget_values = [Budget_Id_value,Name_Id_value,Budget_Type_value,Place_value,StartDate_value,EndDate_value,Amount_value,UserName_value];
          var userbudgetData = new Map();

          for(var i = 0 ; i < userbudget_keys.length ; i++){

            userbudgetData.set(userbudget_keys[i],userbudget_values[i]);

          }

          var Client_Request = "AddBudget";

          processUserAddBudget_mongoDB(userbudgetData,Client_Request);

        }

        function processUserAddBudget_mongoDB(userbudgetData,Client_Request){

          var xmlhttp;

          var httpRequest = webServerPrefix;

          xmlhttp = new XMLHttpRequest();

          httpRequest += "Client_Request=" + Client_Request;

          var userbudgetKey = userbudgetData.keys();

          for (var presentKey of userbudgetKey) {

            httpRequest += "&"
            httpRequest += presentKey + "=" + userbudgetData.get(presentKey);
            
          }

          xmlhttp.open("POST", httpRequest, true);

          xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

          xmlhttp.setRequestHeader("accept", "application/json");

          xmlhttp.onreadystatechange = function() {

          if (this.readyState == 4 && this.status == 200) {

          responseObject = JSON.parse(this.responseText);

          alert("Request :"+ responseObject.Request +" , status :  "+ responseObject.Status); 

          document.location.replace("./addexpense.html");

           }

          };

          window.localStorage.setItem( HelperFunctionModule.currentBudget_Id_Key, userbudgetData.get("Budget_Id") );
         
          xmlhttp.send();


          xmlhttp.send();

        }

        // user Expense-Details

        function userAddExpense(){

          var todaysDate = new Date();
          var uniqueExpenseId = "Exoense_Id_" + todaysDate.getYear().toString() + todaysDate.getMonth().toString() + todaysDate.getDate().toString()
            + todaysDate.getHours().toString() + todaysDate.getMinutes().toString() + todaysDate.getSeconds().toString() + todaysDate.getMilliseconds().toString();;

          var Expense_Id_value = uniqueExpenseId;
          var Name_Id_value = document.getElementById('Name').value;
          var Expense_Type_value = document.getElementById('Expense_Type').value;
          var Place_value = document.getElementById('Place').value;
          var Expense_Category_value = window.localStorage.getItem(HelperFunctionModule.currentExpense_Category_Key);
          var Expense_SubCategory_value = window.localStorage.getItem(HelperFunctionModule.currentExpense_SubCategory_Key);
          var Date_value = document.getElementById('Date').value;
          var Amount_value = document.getElementById('Amount').value;
          var MerchantName_value = document.getElementById('MerchantName').value;
          var Budget_Id_value = window.localStorage.getItem(HelperFunctionModule.currentBudget_Id_Key);
          var UserName_value = window.localStorage.getItem(HelperFunctionModule.currentUserName_Key);



          if(Expense_Id_value == "" || Name_Id_value == "" || Expense_Type_value == "" || Place_value == "" || Expense_Category_value == "" || Expense_SubCategory_value == "" || Date_value == "" || Amount_value == "" || MerchantName_value == "" || Budget_Id_value == "" ||  UserName_value == ""){

            alert("one or many of the required input values are missing : please try again");


          }

          var userexpense_keys = ["Expense_Id","Name","Expense_Type","Place","Expense_Category","Expense_SubCategory","Date","Amount","MerchantName","Budget_Id","UserName"];
          var userexpense_values = [Expense_Id_value,Name_Id_value,Expense_Type_value,Place_value,Expense_Category_value,Expense_SubCategory_value,Date_value,Amount_value,MerchantName_value,Budget_Id_value,UserName_value];
          var userexpenseData = new Map();

          for(var i=0 ; i < userexpense_keys.length ; i++){

            userexpenseData.set(userexpense_keys[i],userexpense_values[i]);
          }

          var Client_Request = "AddExpense";

          processUserAddExpense_mongoDB(userexpenseData,Client_Request);


        }

        function processUserAddExpense_mongoDB(userexpenseData,Client_Request){

          var xmlhttp;

          var httpRequest = webServerPrefix;

          xmlhttp = new XMLHttpRequest();

          httpRequest += "Client_Request=" + Client_Request;

          var userexpenseKey = userexpenseData.keys();

          for (var presentKey of userexpenseKey) {

            httpRequest += "&"
            httpRequest += presentKey + "=" + userexpenseData.get(presentKey);
            
          }

          xmlhttp.open("POST", httpRequest, true);

          xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

          xmlhttp.setRequestHeader("accept", "application/json");

          xmlhttp.onreadystatechange = function() {

          if (this.readyState == 4 && this.status == 200) {

          responseObject = JSON.parse(this.responseText);

          alert("Request :"+ responseObject.Request +" , status :  "+ responseObject.Status);

          document.location.replace("./addexpense.html"); 

           }

          };

          xmlhttp.send();

        }


        return {
          userRegistration : userRegistration ,
          processUserLogin : processUserLogin,
          userAddExpense : userAddExpense,
          userAddBudget : userAddBudget
        }
})();
