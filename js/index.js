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
            console.error(err);
            manageSpinner(false);
        });
}


const displayIssues = (issues) => {
    issuesContainer.innerHTML = "";
    const dataArray = Array.isArray(issues) ? issues : [];

    dataArray.forEach(issue => {
        const isOpen = issue.status.toLowerCase() === "open";
        const borderColor = isOpen ? "border-[#00A96E]" : "border-[#A855F7]";
        const statusIcon = isOpen ? "./assets/Open-Status.png" : "./assets/Closed-Status.png";
        
        let priorityClass = "";
        if(issue.priority.toLowerCase() === 'high'){
             priorityClass = "bg-[#FFEDED] text-[#FF4D4F]"
        }
        else if(issue.priority.toLowerCase() === 'medium'){
             priorityClass = "bg-[#FFF7E6] text-[#FAAD14]"
        }
        else{
             priorityClass = "bg-[#F0F5FF] text-[#2F54EB]"
        }

        const tagsHTML = (issue.labels || []).map(tag => {
    let tagStyle = "";
    let icon = "";
    const tagName = tag.toLowerCase();

    
    if (tagName.includes('bug')) {
        tagStyle = "bg-[#FFEDED] text-[#FF4D4F]"; 
        icon = "fa-bug";
    } 
    else if (tagName.includes('help')) {
        tagStyle = "bg-[#FFF7E6] text-[#FAAD14]"; 
        icon = "fa-circle-info";
    } 
    else if (tagName.includes('enhancement')) {
        tagStyle = "bg-[#E6FFFA] text-[#00A96E]"; 
        icon = "fa-wand-magic-sparkles";
    } 
    else if (tagName.includes('documentation')) {
        tagStyle = "bg-[#E6F7FF] text-[#1890FF]"; 
        icon = "fa-book";
    } 
    else if (tagName.includes('question')) {
        tagStyle = "bg-[#F9F0FF] text-[#722ED1]"; 
        icon = "fa-circle-question";
    } 
    else {
        
        tagStyle = "bg-gray-100 text-gray-600"; 
        icon = "fa-tag";
    }

        return `<span class="${tagStyle} text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase">
                <i class="fa-solid ${icon}"></i> ${tag}
            </span>`;
    }).join('');

        const card = document.createElement("div");
        card.className = `bg-white border-t-4 ${borderColor} p-5 rounded-lg shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all relative`;
        card.onclick = () => loadSingleIssue(issue.id);

        card.innerHTML = `
            <div class="mb-4">
                <div class="flex justify-between items-start mb-3">
                    <img src="${statusIcon}" class="w-5 h-5 object-contain" alt="${issue.status}">
                    
                    <span class="${priorityClass} text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                        ${issue.priority}
                    </span>
                </div>

                <h2 class="font-bold text-gray-800 text-[16px] leading-tight mb-2">${issue.title}</h2>
                <p class="text-[13px] text-gray-500 line-clamp-2 mb-4">${issue.description}</p>
                
                <div class="flex gap-2 mb-4">
                    ${tagsHTML}
                </div>
            </div>

            <div class="border-t border-gray-100 pt-3">
                <div class="text-[11px] text-gray-400">
                    <p class="mb-1">#${issue.id} by ${issue.author}</p>
                    <p>${issue.createdAt || '1/15/2024'}</p>
                </div>
            </div>
        `;
        issuesContainer.append(card);
    });
};


const loadSingleIssue = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(data => {
            showModal(data.data);
        })
        .catch(err => console.log(err));
};


const showModal = (issue) => {
    const oldModal = document.getElementById('issue-modal');
    if (oldModal) oldModal.remove();

    const statusLower = issue.status.toLowerCase();
    const isOpen = statusLower === "open";

    const statusBgColor = isOpen ? "bg-[#00A96E]" : "bg-[#FF4D4F]";

    const statusText = issue.status.charAt(0).toUpperCase() + issue.status.slice(1);

    const tagConfig = {
        'bug': { style: "bg-[#FFEDED] text-[#FF4D4F]", icon: "fa-bug" },
        'help wanted': { style: "bg-[#FFF7E6] text-[#FAAD14]", icon: "fa-circle-info" },
        'enhancement': { style: "bg-[#E6FFFA] text-[#00A96E]", icon: "fa-wand-magic-sparkles" },
        'documentation': { style: "bg-[#E6F7FF] text-[#1890FF]", icon: "fa-book" },
        'question': { style: "bg-[#F9F0FF] text-[#722ED1]", icon: "fa-circle-question" },
        'default': { style: "bg-gray-100 text-gray-600", icon: "fa-tag" }
    };

    const tagsHTML = (issue.labels || []).map(tag => {
        const config = tagConfig[tag.toLowerCase()] || tagConfig['default'];
        return `<span class="${config.style} text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase">
                    <i class="fa-solid ${config.icon}"></i> ${tag}
                </span>`;
    }).join('');

  
    let priorityBadge = "bg-[#2F54EB]";
    if(issue.priority.toLowerCase() === 'high') priorityBadge = "bg-[#FF4D4F]";
    else if(issue.priority.toLowerCase() === 'medium') priorityBadge = "bg-[#FAAD14]";

    const modal = document.createElement('div');
    modal.id = 'issue-modal';
    modal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto';
    
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-xl p-6 md:p-8 shadow-2xl relative my-auto animate-fade-in">
            <h2 class="text-xl md:text-2xl font-bold text-[#1F2937] mb-2 leading-tight">${issue.title}</h2>
            
            <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="${statusBgColor} text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase">
                    ${statusText}
                </span>
                <span class="text-[#64748B] text-[11px] md:text-[13px]">• Opened by ${issue.author} • ${issue.createdAt || '22/02/2026'}</span>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-6">
                ${tagsHTML}
            </div>

            <p class="text-[#64748B] text-sm mb-8 leading-relaxed">${issue.description}</p>

            <div class="bg-[#F8FAFC] rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <p class="text-[10px] text-[#64748B] mb-1 font-medium">Assignee:</p>
                    <p class="font-bold text-[#1F2937] text-base">${issue.author}</p>
                </div>
                <div class="sm:text-right">
                    <p class="text-[11px] text-[#64748B] mb-1 font-medium">Priority:</p>
                    <span class="${priorityBadge} text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase">
                        ${issue.priority}
                    </span>
                </div>
            </div>

            <div class="flex justify-end">
                <button onclick="this.closest('#issue-modal').remove()" class="w-full sm:w-auto bg-[#4A00FF] text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-[#3b00cc] transition-all active:scale-95">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

const filterIssues = (status, event) => {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('bg-[#4A00FF]', 'text-[#FFFFFF]', 'border-none');
        tab.classList.add('bg-[#FFFFFF]', 'text-[#64748B]', 'border-[#E4E4E7]', 'border');
    });

    const currentTab = event.currentTarget;
    currentTab.classList.remove('bg-[#FFFFFF]', 'text-[#64748B]', 'border-[#E4E4E7]', 'border');
    currentTab.classList.add('bg-[#4A00FF]', 'text-[#FFFFFF]', 'border-none');


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
        })
        .catch(err => {
            console.error("error", err);
            manageSpinner(false);
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
        alert("Invalid login!");
    }
}


