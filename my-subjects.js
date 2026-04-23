let mySubjects = JSON.parse(localStorage.getItem("mySubjects") || "[]");

function normalizeSubject(v) {
    return String(v || "").trim().toUpperCase();
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[m]));
}

function renderMySubjects() {
    const box = document.getElementById("mySubjectsList");
    if (!box) return;

    if (!mySubjects.length) {
        box.innerHTML = `<div class="my-empty">Chưa có môn nào</div>`;
        return;
    }

    box.innerHTML = mySubjects.map(subject => `
        <span class="my-tag">
            ${escapeHtml(subject)}
            <button type="button" onclick="removeMySubject('${escapeHtml(subject)}')">×</button>
        </span>
    `).join("");
}

function addMySubject() {
    const input = document.getElementById("mySubjectInput");
    if (!input) return;

    const values = input.value
        .split(",")
        .map(s => normalizeSubject(s))
        .filter(Boolean);

    if (!values.length) {
        input.focus();
        return;
    }

    values.forEach(value => {
        if (!mySubjects.includes(value)) {
            mySubjects.push(value);
        }
    });

    input.value = "";
    renderMySubjects();
    input.focus();
}

function removeMySubject(subject) {
    mySubjects = mySubjects.filter(s => s !== subject);
    renderMySubjects();
    saveMySubjects(true);
}

function saveMySubjects(silent = false) {
    localStorage.setItem("mySubjects", JSON.stringify(mySubjects));
}

function clearMySubjects() {
    if (!mySubjects.length) return;
    mySubjects = [];
    renderMySubjects();
    saveMySubjects(true);
}

function openWithSubjects(page) {
    if (!mySubjects.length) {
        return;
    }

    const query = encodeURIComponent(mySubjects.join(", "));
    window.location.href = `${page}?m=${query}`;
}

document.addEventListener("DOMContentLoaded", renderMySubjects);
