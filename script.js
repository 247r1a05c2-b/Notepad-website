// DOM Elements
const addBtn = document.getElementById('addBtn');
const downloadBtn = document.getElementById('downloadBtn');
const newFileBtn = document.getElementById('newFileBtn');
const noteText = document.getElementById('noteText');
const notesContainer = document.getElementById('notesContainer');
const currentFileNameSpan = document.getElementById('currentFileName');

// All files in memory
let files = {};
let currentFile = 'File1';

// Load existing file from localStorage or initialize
files[currentFile] = JSON.parse(localStorage.getItem(currentFile)) || [];
renderNotes();

// Add Note
addBtn.addEventListener('click', () => {
    const text = noteText.value.trim();
    if(text) {
        files[currentFile].push(text);
        saveCurrentFile();
        noteText.value = '';
        renderNotes();
    }
});

// Render Notes
function renderNotes() {
    notesContainer.innerHTML = '';
    files[currentFile].forEach((note, index) => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
            <p>${note}</p>
            <button onclick="deleteNote(${index})">Delete</button>
        `;
        notesContainer.appendChild(noteCard);
    });
    currentFileNameSpan.textContent = currentFile;
}

// Delete Note
function deleteNote(index) {
    files[currentFile].splice(index, 1);
    saveCurrentFile();
    renderNotes();
}

// Save current file to localStorage
function saveCurrentFile() {
    localStorage.setItem(currentFile, JSON.stringify(files[currentFile]));
}

// Download current file as .txt
downloadBtn.addEventListener('click', () => {
    if(files[currentFile].length === 0){
        alert("No notes in current file!");
        return;
    }
    const blob = new Blob([files[currentFile].join('\n\n')], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Create new file
newFileBtn.addEventListener('click', () => {
    const newFileName = prompt("Enter new file name:");
    if(newFileName && !files[newFileName]) {
        currentFile = newFileName;
        files[currentFile] = [];
        renderNotes();
    } else if(files[newFileName]) {
        alert("File already exists. Choose a different name.");
    }
});

// Make deleteNote accessible in HTML
window.deleteNote = deleteNote;
