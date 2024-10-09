const snackBar = document.querySelector('#snackbar');

const showSnackBar = (content) => {
    let para = snackBar.querySelector("p");
    para.innerHTML = content;
    snackBar.className = "show";
    setTimeout(() => { 
        snackBar.className = snackBar.className.replace("show", ""); 
        para.innerHTML = "";
    }, 3000);
};