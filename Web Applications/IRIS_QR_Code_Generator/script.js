const btn = document.querySelector('.btn');
const code = document.querySelector('.code');
const input = document.querySelector('.input');
const toast = document.querySelector('.toast');
const codeContainer = document.querySelector('.code-container');
btn.addEventListener('click', generate);

function generate() {
    const data = input.value.trim();
    
    if (data === '') {
        showToast("Please enter text or URL.");
        return;
    }
    
    const encodedData = encodeURIComponent(data);
    const URL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedData}`;
    codeContainer.style.display = 'block'; 
    code.src = URL;
    showToast("Successfully Generated!");
}

function showToast(message) {
    toast.innerText = message;
    toast.classList.add("show");
    // setTimeout(function() {
    //     toast.classList.remove("show");
    // }, 2000);
}
