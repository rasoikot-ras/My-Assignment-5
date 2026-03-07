
//user and password
function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-page').classList.remove('hidden');
        fetchIssues();
    } 
    else {
        alert("Invalid");
    }
}

const issuesContainer = document.getElementById("issuesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const btnSearch = document.getElementById("btn-search");
const inputSearch = document.getElementById("input-search");
const issueDetailsModal = document.getElementById("issue-details-modal");

function showLoading() {
  loadingSpinner.classList.remove("hidden");
  issuesContainer.innerHTML = "";
}

function hideLoading() {
  loadingSpinner.classList.add("hidden");
}


// all issues load

async function loadCategories() {
  showLoading();
  const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
  const data = await res.json();
  displayIssues(data);
  hideLoading();
}

function displayIssues(issues) {
  issuesContainer.innerHTML = "";
  issues.forEach((issue) => {

    const borderStyle = issue.status.toLowerCase() === "open" ? "border-green-500" : "border-purple-500";

    const card = document.createElement("div");
    card.className = `card bg-white shadow-sm border-t-4 ${borderStyle} p-4`;
    card.innerHTML = `
      <div class="card-body p-0 space-y-2">
        <h2 onclick="openIssueModal(${issue.id})" class="card-title cursor-pointer hover:text-blue-500 transition">
            ${issue.title}
        </h2>
        <p class="text-sm text-gray-500 line-clamp-2">${issue.description}</p>
        <div class="flex gap-2">
            <div class="badge badge-outline text-xs">Author: ${issue.author}</div>
            <div class="badge badge-ghost text-xs">${issue.priority}</div>
        </div>
        <div class="flex justify-between items-center mt-4 pt-2 border-t">
          <span class="text-xs font-bold text-gray-400 uppercase">${issue.category}</span>
          <button onclick="openIssueModal(${issue.id})" class="btn btn-primary btn-xs">Details</button>
        </div>
      </div>`;
    issuesContainer.appendChild(card);
  });
}