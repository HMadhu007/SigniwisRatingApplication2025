
debugger

function userProfileinfo(){

    debugger
    document.getElementById('infoPopUp').style.display="block"
    
}
function oCloseuserInfoPopup(){
    
    debugger
    document.getElementById('infoPopUp').style.display="none"
}

function AdminNotification()
{
    debugger
    // alert("welcome")
    document.getElementById("AdminNotificationPopUp").style.display="block"
    document.getElementById("popupBackground").style.display="block"
    document.getElementById("popupBackground").style.filter = 'blur(8px)'


}
function AdminNotifyCloseBtn()
{
    debugger
    document.getElementById("AdminNotificationPopUp").style.display="none"
    document.getElementById("popupBackground").style.display="none"

}
function UsersDetailsPopUpCloseBtn()
{
    document.getElementById("UsersDetailsPopUp").style.display="none"
    document.getElementById("popupBackground").style.display="none"
}

  //****************** Search functionality*****************************
  const searchByEMPId = ()=>{
    debugger
    const searchbox = document.getElementById("SearchByEMPId").value
    const storeitems = document.getElementById("RecordsTable")
    const product = document.querySelectorAll(".searchbyID")
    const pname = storeitems.getElementsByTagName("td")

    for(var i=0;i<pname.length;i++){
        let match = product[i].getElementsByTagName('td')[0]

        if(match){
           let textvalue = match.textContent || match.innerHTML

           if(textvalue.toUpperCase().indexOf(searchbox)>-1){
            product[i].style.display = "";
           }else{
            product[i].style.display = "none";
           }

        }
    }
}

  const searchByEMPName = ()=>{
    debugger
  const searchbox = document.getElementById("SearchByEMPName").value.toUpperCase()
  const storeitems = document.getElementById("RecordsTable")
  const product = document.querySelectorAll(".searchbyName")
  const pname = storeitems.getElementsByTagName("td")

  for(var i=0;i<pname.length;i++){
      let match = product[i].getElementsByTagName('td')[1]

      if(match){
         let textvalue = match.textContent || match.innerHTML

         if(textvalue.toUpperCase().indexOf(searchbox)>-1){
          product[i].style.display = "";
         }else{
          product[i].style.display = "none";
         }

      }
  }
}
// *************************************************

function ClicktoViewEmp(id){

    debugger
    // alert(id)
    localStorage.setItem("Empid",id)
    document.getElementById("UsersDetailsPopUp").style.display="block"
    document.getElementById("popupBackground").style.display="block"
    document.getElementById("popupBackground").style.filter = 'blur(8px)'
    document.getElementById("EmpIdForFeatchData").value = id

  
        
    
    // document.getElementById("EmployeeData").innerHTML = `
    //     `
  }

function onPress() {
    debugger
    alert("data deleted successfully")
}