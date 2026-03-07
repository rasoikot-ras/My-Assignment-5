//user and password
function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-page').classList.remove('hidden');
        // loadIssues();
    } 
    else {
        alert("Invalid");
    }
}

const issuesContainer = document.getElementById("issuescontainer");
const loadingSpinner = document.getElementById("loader");
const issueCountDisplay = document.getElementById("issue-count");
const searchInput = document.getElementById("searchinput");


async function loadCategories() {
    //async await
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json;
    data.issues.forEach((issue) => {
        console.log(issue)
    });

}

