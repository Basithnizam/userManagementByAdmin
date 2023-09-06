var fPass = document.getElementById('first-password')
var cPass = document.getElementById('confirm_password')
var passwordMismatch = document.getElementById('passwordMismatch');

// Get the incorrectMessage element by its ID
const incorrectMessage = document.getElementById('incorrectMessage');

// Function to remove the element after 3 seconds (3000 milliseconds)
function removeIncorrectMessage() {
  if (incorrectMessage) {
    incorrectMessage.remove();
  }
}

// Set a timer to call the removeIncorrectMessage function after 3 seconds
setTimeout(removeIncorrectMessage, 2000); // 3000 milliseconds = 3 seconds




function validatepassword(){
    
    if (fPass.value !== cPass.value){
        passwordMismatch.innerHTML = "password dosen't match";
        return false;
    }else{
        passwordMismatch.innerHTML = "";
        return ture
        
    }
}



