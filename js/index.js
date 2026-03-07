// //user and password
// function handleLogin() {
//     const user = document.getElementById('username').value;
//     const pass = document.getElementById('password').value;

//     if (user === 'admin' && pass === 'admin123') {
//         document.getElementById('login-page').classList.add('hidden');
//         document.getElementById('main-page').classList.remove('hidden');
//         loadAllIssues();
//     } 
//     else {
//         alert("Invalid");
//     }
// }



const issuesContainer = document.getElementById("issuescontainer");
const loadingSpinner = document.getElementById("loader");
const issueCountDisplay = document.getElementById("issue-count");
const searchInput = document.getElementById("searchinput");


const manageSpinner = (status) => {
    if (status === true) {
        loadingSpinner.classList.remove("hidden");
        issuesContainer.classList.add("hidden");
    } else {
        loadingSpinner.classList.add("hidden");
        issuesContainer.classList.remove("hidden");
    }
};


const loadAllIssues = () => {
    manageSpinner(true);
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
           
            const issues = Array.isArray(data) ? data : (data.data || []);
            
            issueCountDisplay.innerText = issues.length;
            displayIssues(issues);
            manageSpinner(false);
        })
        .catch(err => {
            console.error("error", err);
            manageSpinner(false);
        });
}


const displayIssues = (issues) => {
    issuesContainer.innerHTML = "";
    
    if (!issues || issues.length === 0) {
        issuesContainer.innerHTML = `<p class="col-span-full text-center py-10">No issues found!</p>`;
        return;
    }

    issues.forEach(issue => { 
        const isOpen = issue.status.toLowerCase() === "open";
        const borderColor = isOpen ? "border-[#00A96E]" : "border-[#A855F7]";
        const badgeColor = isOpen ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600";

        const card = document.createElement("div");
        card.className = `bg-white border-t-4 ${borderColor} p-5 rounded-lg shadow-md flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all`;
        card.onclick = () => loadSingleIssue(issue.id);

        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-2">
                    <span class="${badgeColor} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">${issue.status}</span>
                    <span class="text-gray-400 text-[10px] font-bold uppercase">${issue.priority}</span>
                </div>
                <h2 class="font-bold text-gray-800 text-[15px] leading-tight mb-2">${issue.title}</h2>
                <p class="text-[12px] text-gray-400 line-clamp-2 mb-4">${issue.description}</p>
            </div>
            <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                <div class="text-[11px] text-gray-400">
                    <p>#${issue.id} by ${issue.author}</p>
                    <p>${issue.createdAt || '1/15/2026'}</p>
                </div>
                <button class="text-[#4A00FF] font-bold text-[11px]">Details</button>
            </div>
        `;
        issuesContainer.append(card);
    });
};

const filterIssues = (status) => {
    manageSpinner(true);
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            const issues = Array.isArray(data) ? data : (data.data || []);
            const filtered = status === 'all' ? issues : issues.filter(i => i.status.toLowerCase() === status);
            
            issueCountDisplay.innerText = filtered.length;
            displayIssues(filtered);
            manageSpinner(false);
        });
};

const handleSearch = () => {
    const text = searchInput.value.trim();
    if (!text) {
        loadAllIssues();
        return;
    }
    
    manageSpinner(true);
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)
        .then(res => res.json())
        .then(data => {
            const searchResult = Array.isArray(data) ? data : (data.data || []);
            issueCountDisplay.innerText = searchResult.length;
            displayIssues(searchResult);
            manageSpinner(false);
        });
};


const loadSingleIssue = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(data => {
            const issue = data.data;
            alert(`Issue: ${issue.title}\nAuthor: ${issue.author}\nStatus: ${issue.status}\n\nDescription: ${issue.description}`);
        });
};


function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-page').classList.remove('hidden');
        loadAllIssues();
    } else {
        alert("Invalid Username or Password!");
    }
}