debugger
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