// let userReview=[{
//     "requestedDate":"11-06-2023",
//     "EmployeeName":"Chiranjeevi"
//   },
//   {
//     "requestedDate":"12-06-2023",
//     "EmployeeName":"Madhusudan"
//   },
//   {
//     "requestedDate":"13-06-2023",
//     "EmployeeName":"Ayaz"
   
//   }]


// userReview.forEach((emp,index)=>{

//    var rows = `<tr id="${index}EmpReviewDetails" ><td id="${index}requestedDate" >${emp.requestedDate}</td> 
//     <td id="${index}EmployeeName">${emp.EmployeeName}</td> <td><img id="${index}Button" src='../images/right-arrow.png' onclick=ClicktoViewEmp(${index}) height='25px' width='50px'/></td></tr>`
   
//     document.getElementById("userNotificationReviewpopup").innerHTML +=rows
// })



function userProfileinfo(){
    document.getElementById('infoPopUp').style.display="block"
    
}
function oCloseuserInfoPopup(){
    document.getElementById('infoPopUp').style.display="none"
}

function UserNotification()
{
    // alert("welcome")
    document.getElementById("bodyContainer").style.filter = 'blur(8px)'
    document.getElementById("UserNotificationPopUp").style.display="block"
    // document.getElementById("popupBackground").style.display="block"
    // document.getElementById("popupBackground").style.filter = 'blur(8px)'
  


}
function UserNotificationPopUp()
{
    document.getElementById("bodyContainer").style.filter = 'blur(0px)'
    document.getElementById("UserNotificationPopUp").style.display="none"
    // document.getElementById("popupBackground").style.display="none"


}
function ologout(){
    location.href='file:///D:/Application/RatingApplication/login/login.html'
}

