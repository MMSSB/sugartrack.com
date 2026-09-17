// import { auth, db } from "./firebase-init.js";
// import { 
//     collection, query, where, orderBy, onSnapshot, 
//     doc, addDoc, updateDoc, deleteDoc, Timestamp 
// } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// /* --- STATE MANAGEMENT --- */
// let allReadings = [];
// let filteredReadings = [];
// let currentUser = null;
// let currentFilter = 'all';
// let currentDeleteId = null;

// /* --- DOM ELEMENTS --- */
// const dtTableBody = document.getElementById('desktopTableBody');
// const mbListBody = document.getElementById('mobileListBody');
// const dtSearch = document.getElementById('dt-search');
// const mbSearch = document.getElementById('mb-search');
// const readingModal = document.getElementById('readingModal');
// const deleteModal = document.getElementById('deleteModal');
// const readingForm = document.getElementById('readingForm');

// /* --- INITIALIZATION --- */
// document.addEventListener('DOMContentLoaded', () => {
//     auth.onAuthStateChanged(user => {
//         if (user) {
//             currentUser = user;
//             setupRealtimeListener(user);
//             updateUserUI(user);
//         } else {
//             window.location.href = 'login.html';
//         }
//     });

//     // Search Syncing
//     const handleSearch = (e) => {
//         const val = e.target.value;
//         if(dtSearch) dtSearch.value = val;
//         if(mbSearch) mbSearch.value = val;
//         applySearch(val);
//     };

//     if(dtSearch) dtSearch.addEventListener('input', handleSearch);
//     if(mbSearch) mbSearch.addEventListener('input', handleSearch);

//     // Form Submissions
//     if(readingForm) readingForm.addEventListener('submit', handleSaveReading);
    
//     // Explicit Delete Listener
//     document.getElementById('confirmDeleteBtn')?.addEventListener('click', handleConfirmDelete);
// });

// /* --- DATA HANDLING --- */
// function setupRealtimeListener(user) {
//     const q = query(collection(db, "readings"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
    
//     onSnapshot(q, (snapshot) => {
//         allReadings = [];
//         snapshot.forEach(docSnap => {
//             const data = docSnap.data();
//             let dateObj = new Date();
//             if (data.timestamp?.toDate) dateObj = data.timestamp.toDate();
//             else if (data.timestamp) dateObj = new Date(data.timestamp);

//             // FIX: Check for both 'note' (App) and 'notes' (Web)
//             // This ensures data from your app shows up here.
//             // const noteText = data.note || data.notes || "";
// // FIX: Check for 'note' (App), 'notes' (Web), and 'comment' (Old Script)
// const noteText = data.note || data.notes || data.comment || "";
//             allReadings.push({
//                 id: docSnap.id,
//                 ...data,
//                 dateObj: dateObj,
//                 glucose: parseInt(data.glucose) || 0,
//                 notes: noteText, // Internal variable we use in JS
//                 context: data.context ? data.context : "General"
//             });
//         });
//         applyFilters();
//         updateStats();
//     });
// }

// /* --- FILTER & SEARCH --- */
// window.setFilter = function(type) {
//     currentFilter = type;
//     document.querySelectorAll('.filter-btn').forEach(btn => {
//         if(btn.getAttribute('onclick')?.includes(type)) {
//             btn.classList.add('active');
//         } else {
//             btn.classList.remove('active');
//         }
//     });
//     applyFilters();
// };

// function applySearch(term) {
//     term = term.toLowerCase();
//     filteredReadings = allReadings.filter(r => 
//         (r.notes.toLowerCase().includes(term)) ||
//         (r.context.toLowerCase().includes(term)) ||
//         (r.glucose.toString().includes(term))
//     );
//     renderViews();
// }

// function applyFilters() {
//     const todayStr = new Date().toISOString().split('T')[0];
//     filteredReadings = allReadings.filter(r => {
//         if (currentFilter === 'today') return r.date === todayStr;
//         if (currentFilter === 'high') return r.glucose > 180;
//         if (currentFilter === 'low') return r.glucose < 70;
//         return true;
//     });
//     renderViews();
// }

// /* --- RENDERING --- */
// function renderViews() {
//     renderDesktop();
//     renderMobile();
// }

// function renderDesktop() {
//     if (!dtTableBody) return;
//     dtTableBody.innerHTML = filteredReadings.length ? '' : '<tr><td colspan="7" style="text-align:center; padding:2rem; opacity:0.6; color:var(--text-secondary)">No readings found</td></tr>';
    
//     filteredReadings.forEach(r => {
//         const tr = document.createElement('tr');
//         const status = getStatus(r.glucose);
        
//         tr.innerHTML = `
//             <td>${r.dateObj.toLocaleDateString()}</td>
//             <td>${formatTime(r.time)}</td>
//             <td style="font-weight:700; color:var(--text-primary)">
//                 ${r.glucose} <small style="color:var(--text-secondary); font-weight:400">mg/dL</small>
//             </td>
//             <td><span class="glucose-badge ${status.class}">${status.text}</span></td>
//             <td>${r.context}</td>
//             <td style="color:var(--text-secondary); max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">
//                 ${r.notes || '-'}
//             </td>
//             <td>
//                 <button class="icon-btn-small" onclick="window.openEditModal('${r.id}')" title="Edit">
//                     <i class="fa-solid fa-pen"></i>
//                 </button>
//             </td>
//         `;
//         dtTableBody.appendChild(tr);
//     });
// }

// function renderMobile() {
//     if (!mbListBody) return;
//     mbListBody.innerHTML = filteredReadings.length ? '' : '<div style="text-align:center; padding:2rem; opacity:0.6; color:var(--text-secondary)">No readings found</div>';

//     filteredReadings.forEach(r => {
//         const item = document.createElement('div');
//         item.className = 'history-item2';
//         item.onclick = () => window.openEditModal(r.id);
        
//         const status = getStatus(r.glucose);
        
//         // Logic to show dot only if notes exist
//         let notesHtml = '';
//         if (r.notes && r.notes.trim() !== "") {
//             notesHtml = `<span style="color:var(--text-secondary); font-weight:400;"> • ${r.notes}</span>`;
//         }

//         item.innerHTML = `
//             <div class="details">
//                 <div style="display:flex; align-items:center; gap:8px;">
//                     <span style="color:${status.color}; font-size:1.4rem; font-weight:700;">${r.glucose}</span>
//                     <span style="font-size:0.8rem; color:var(--text-secondary);">mg/dL</span>
//                 </div>
//                 <span style="font-size:0.85rem; color:var(--text-primary); margin-top:4px; display:block; font-weight:500;">
//                     <i class="fas fa-circle" style="color:${status.color}; font-size:8px; margin-right:4px;"></i> 
//                     ${r.context}${notesHtml}
//                 </span>
//             </div>
//             <div class="time" style="text-align:right;">
//                 <div style="font-weight:600; font-size:0.9rem; color:var(--text-primary)">${r.dateObj.toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
//                 <span style="font-weight:400; font-size:0.8rem; color:var(--text-secondary)">${formatTime(r.time)}</span>
//             </div>
//         `;
//         mbListBody.appendChild(item);
//     });
// }

// /* --- CRUD OPERATIONS --- */
// window.openAddReadingModal = function() {
//     document.getElementById('modalTitle').innerText = "Add Reading";
//     document.getElementById('readingId').value = "";
    
//     // Hide delete button on add
//     const delBtn = document.getElementById('modalDeleteBtn');
//     if(delBtn) delBtn.style.display = 'none';

//     readingForm.reset();
    
//     const now = new Date();
//     const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
//     document.getElementById('readingDate').value = localDate;
//     document.getElementById('readingTime').value = now.toTimeString().slice(0, 5);
    
//     readingModal.classList.add('active');
// };

// window.openEditModal = function(id) {
//     const r = allReadings.find(x => x.id === id);
//     if (!r) return;
    
//     document.getElementById('modalTitle').innerText = "Edit Reading";
//     document.getElementById('readingId').value = r.id;
    
//     // Show delete button
//     const delBtn = document.getElementById('modalDeleteBtn');
//     if(delBtn) delBtn.style.display = 'flex';

//     document.getElementById('readingDate').value = r.date;
//     document.getElementById('readingTime').value = r.time;
//     document.getElementById('readingGlucose').value = r.glucose;
//     document.getElementById('readingContext').value = r.context;
//     document.getElementById('readingNotes').value = r.notes;
    
//     readingModal.classList.add('active');
// };

// window.closeModal = () => readingModal.classList.remove('active');

// window.openDeleteConfirm = (id) => { 
//     currentDeleteId = id; 
//     deleteModal.classList.add('active'); 
// };

// window.closeDeleteModal = () => {
//     deleteModal.classList.remove('active');
//     currentDeleteId = null;
// };

// async function handleConfirmDelete() {
//     if (!currentDeleteId) return;
    
//     const btn = document.getElementById('confirmDeleteBtn');
//     const originalText = btn.innerText;
//     btn.innerText = "Deleting...";
    
//     try {
//         await deleteDoc(doc(db, "readings", currentDeleteId));
//         window.closeDeleteModal();
//     } catch (err) {
//         console.error("Delete failed:", err);
//         alert("Error: " + err.message);
//     } finally {
//         btn.innerText = originalText;
//     }
// }

// async function handleSaveReading(e) {
//     e.preventDefault();
//     const btn = document.getElementById('saveBtn');
//     const originalText = btn.innerText;
//     btn.innerText = "Saving...";
//     btn.disabled = true;

//     const id = document.getElementById('readingId').value;
//     const dateVal = document.getElementById('readingDate').value;
//     const timeVal = document.getElementById('readingTime').value;

//     const payload = {
//         userId: currentUser.uid,
//         glucose: parseInt(document.getElementById('readingGlucose').value),
//         date: dateVal,
//         time: timeVal,
//         context: document.getElementById('readingContext').value || "Manual",
//         // FIX: Save as 'note' (singular) to match your App version
//         note: document.getElementById('readingNotes').value || "", 
//         timestamp: Timestamp.fromDate(new Date(`${dateVal}T${timeVal}`))
//     };

//     try {
//         if (id) {
//             await updateDoc(doc(db, "readings", id), payload);
//         } else {
//             await addDoc(collection(db, "readings"), { ...payload, created: Timestamp.now() });
//         }
//         window.closeModal();
//     } catch(err) { 
//         console.error(err); 
//         alert("Error saving reading: " + err.message); 
//     } finally {
//         btn.innerText = originalText;
//         btn.disabled = false;
//     }
// }

// /* --- HELPERS --- */
// function updateStats() {
//     if (!allReadings.length) {
//         updateStatElements(0, "--", "--");
//         return;
//     }
    
//     const total = allReadings.length;
//     const sum = allReadings.reduce((a, b) => a + b.glucose, 0);
//     const avg = Math.round(sum / total);
//     const inRange = allReadings.filter(r => r.glucose >= 70 && r.glucose <= 180).length;
//     const rangePct = Math.round((inRange / total) * 100) + '%';
    
//     updateStatElements(total, avg, rangePct);
// }

// function updateStatElements(total, avg, range) {
//     // Desktop IDs
//     if(document.getElementById('dt-total')) document.getElementById('dt-total').innerText = total;
//     if(document.getElementById('dt-avg')) document.getElementById('dt-avg').innerText = avg;
//     if(document.getElementById('dt-range')) document.getElementById('dt-range').innerText = range;

//     // Mobile IDs
//     if(document.getElementById('mb-total')) document.getElementById('mb-total').innerText = total;
//     if(document.getElementById('mb-avg')) document.getElementById('mb-avg').innerText = avg;
//     if(document.getElementById('mb-range')) document.getElementById('mb-range').innerText = range;
// }

// function getStatus(g) {
//     if (g < 70) return { class: 'low', text: 'Low', color: '#ef4444' };
//     if (g > 180) return { class: 'high', text: 'High', color: '#f59e0b' };
//     return { class: 'normal', text: 'Normal', color: '#10b981' };
// }

// function formatTime(t) {
//     if (!t) return "";
//     const [h, m] = t.split(':');
//     const d = new Date(); d.setHours(h); d.setMinutes(m);
//     return d.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
// }

// function updateUserUI(user) {
//     document.querySelectorAll('.u-name').forEach(el => el.innerText = user.displayName || 'User');
// }


























import { auth, db } from "./firebase-init.js";
import { 
    collection, query, where, orderBy, onSnapshot, 
    doc, addDoc, updateDoc, deleteDoc, Timestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* --- STATE MANAGEMENT --- */
let allReadings = [];
let filteredReadings = [];
let currentUser = null;
let currentFilter = 'all';
let currentDeleteId = null;

/* --- DOM ELEMENTS --- */
const dtTableBody = document.getElementById('desktopTableBody');
const mbListBody = document.getElementById('mobileListBody');
const dtSearch = document.getElementById('dt-search');
const mbSearch = document.getElementById('mb-search');
const readingModal = document.getElementById('readingModal');
const deleteModal = document.getElementById('deleteModal');
const readingForm = document.getElementById('readingForm');

/* --- INITIALIZATION --- */
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            setupRealtimeListener(user);
            updateUserUI(user);
        } else {
            window.location.href = 'login.html';
        }
    });

    // Search Syncing
    const handleSearch = (e) => {
        const val = e.target.value;
        if(dtSearch) dtSearch.value = val;
        if(mbSearch) mbSearch.value = val;
        applySearch(val);
    };

    if(dtSearch) dtSearch.addEventListener('input', handleSearch);
    if(mbSearch) mbSearch.addEventListener('input', handleSearch);

    // Form Submissions
    if(readingForm) readingForm.addEventListener('submit', handleSaveReading);
    
    // Explicit Delete Listener
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', handleConfirmDelete);
});

/* --- DATA HANDLING --- */
function setupRealtimeListener(user) {
    const q = query(collection(db, "readings"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
    
    onSnapshot(q, (snapshot) => {
        allReadings = [];
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            let dateObj = new Date();
            if (data.timestamp?.toDate) dateObj = data.timestamp.toDate();
            else if (data.timestamp) dateObj = new Date(data.timestamp);

            const noteText = data.note || data.notes || data.comment || "";
            allReadings.push({
                id: docSnap.id,
                ...data,
                dateObj: dateObj,
                glucose: parseInt(data.glucose) || 0,
                notes: noteText,
                context: data.context ? data.context : "General"
            });
        });
        applyFilters();
        updateStats(); // This triggers the card updates
    });
}

/* --- FILTER & SEARCH --- */
window.setFilter = function(type) {
    currentFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if(btn.getAttribute('onclick')?.includes(type)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    applyFilters();
};

function applySearch(term) {
    term = term.toLowerCase();
    filteredReadings = allReadings.filter(r => 
        (r.notes.toLowerCase().includes(term)) ||
        (r.context.toLowerCase().includes(term)) ||
        (r.glucose.toString().includes(term))
    );
    renderViews();
}

function applyFilters() {
    const todayStr = new Date().toISOString().split('T')[0];
    filteredReadings = allReadings.filter(r => {
        if (currentFilter === 'today') return r.date === todayStr;
        if (currentFilter === 'high') return r.glucose > 180;
        if (currentFilter === 'low') return r.glucose < 70;
        return true;
    });
    renderViews();
}

/* --- RENDERING --- */
function renderViews() {
    renderDesktop();
    renderMobile();
}

function renderDesktop() {
    if (!dtTableBody) return;
    dtTableBody.innerHTML = filteredReadings.length ? '' : '<tr><td colspan="7" style="text-align:center; padding:2rem; opacity:0.6; color:var(--text-secondary)">No readings found</td></tr>';
    
    filteredReadings.forEach(r => {
        const tr = document.createElement('tr');
        const status = getStatus(r.glucose);
        
        tr.innerHTML = `
            <td>${r.dateObj.toLocaleDateString()}</td>
            <td>${formatTime(r.time)}</td>
            <td style="font-weight:700; color:var(--text-primary)">
                ${r.glucose} <small style="color:var(--text-secondary); font-weight:400">mg/dL</small>
            </td>
            <td><span class="glucose-badge ${status.class}">${status.text}</span></td>
            <td>${r.context}</td>
            <td style="color:var(--text-secondary); max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">
                ${r.notes || '-'}
            </td>
            <td>
                <button class="icon-btn-small" onclick="window.openEditModal('${r.id}')" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </td>
        `;
        dtTableBody.appendChild(tr);
    });
}

function renderMobile() {
    if (!mbListBody) return;
    mbListBody.innerHTML = filteredReadings.length ? '' : '<div style="text-align:center; padding:2rem; opacity:0.6; color:var(--text-secondary)">No readings found</div>';

    filteredReadings.forEach(r => {
        const item = document.createElement('div');
        item.className = 'history-item2';
        item.onclick = () => window.openEditModal(r.id);
        
        const status = getStatus(r.glucose);
        
        let notesHtml = '';
        if (r.notes && r.notes.trim() !== "") {
            notesHtml = `<span style="color:var(--text-secondary); font-weight:400;"> • ${r.notes}</span>`;
        }

        item.innerHTML = `
            <div class="details">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="color:${status.color}; font-size:1.4rem; font-weight:700;">${r.glucose}</span>
                    <span style="font-size:0.8rem; color:var(--text-secondary);">mg/dL</span>
                </div>
                <span style="font-size:0.85rem; color:var(--text-primary); margin-top:4px; display:block; font-weight:500;">
                    <i class="fas fa-circle" style="color:${status.color}; font-size:8px; margin-right:4px;"></i> 
                    ${r.context}${notesHtml}
                </span>
            </div>
            <div class="time" style="text-align:right;">
                <div style="font-weight:600; font-size:0.9rem; color:var(--text-primary)">${r.dateObj.toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
                <span style="font-weight:400; font-size:0.8rem; color:var(--text-secondary)">${formatTime(r.time)}</span>
            </div>
        `;
        mbListBody.appendChild(item);
    });
}

/* --- CRUD OPERATIONS --- */
window.openAddReadingModal = function() {
    document.getElementById('modalTitle').innerText = "Add Reading";
    document.getElementById('readingId').value = "";
    
    const delBtn = document.getElementById('modalDeleteBtn');
    if(delBtn) delBtn.style.display = 'none';

    readingForm.reset();
    
    const now = new Date();
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    document.getElementById('readingDate').value = localDate;
    document.getElementById('readingTime').value = now.toTimeString().slice(0, 5);
    
    readingModal.classList.add('active');
};

window.openEditModal = function(id) {
    const r = allReadings.find(x => x.id === id);
    if (!r) return;
    
    document.getElementById('modalTitle').innerText = "Edit Reading";
    document.getElementById('readingId').value = r.id;
    
    const delBtn = document.getElementById('modalDeleteBtn');
    if(delBtn) delBtn.style.display = 'flex';

    document.getElementById('readingDate').value = r.date;
    document.getElementById('readingTime').value = r.time;
    document.getElementById('readingGlucose').value = r.glucose;
    document.getElementById('readingContext').value = r.context;
    document.getElementById('readingNotes').value = r.notes;
    
    readingModal.classList.add('active');
};

window.closeModal = () => readingModal.classList.remove('active');

window.openDeleteConfirm = (id) => { 
    currentDeleteId = id; 
    deleteModal.classList.add('active'); 
};

window.closeDeleteModal = () => {
    deleteModal.classList.remove('active');
    currentDeleteId = null;
};

async function handleConfirmDelete() {
    if (!currentDeleteId) return;
    
    const btn = document.getElementById('confirmDeleteBtn');
    const originalText = btn.innerText;
    btn.innerText = "Deleting...";
    
    try {
        await deleteDoc(doc(db, "readings", currentDeleteId));
        window.closeDeleteModal();
    } catch (err) {
        console.error("Delete failed:", err);
        alert("Error: " + err.message);
    } finally {
        btn.innerText = originalText;
    }
}

async function handleSaveReading(e) {
    e.preventDefault();
    const btn = document.getElementById('saveBtn');
    const originalText = btn.innerText;
    btn.innerText = "Saving...";
    btn.disabled = true;

    const id = document.getElementById('readingId').value;
    const dateVal = document.getElementById('readingDate').value;
    const timeVal = document.getElementById('readingTime').value;

    const payload = {
        userId: currentUser.uid,
        glucose: parseInt(document.getElementById('readingGlucose').value),
        date: dateVal,
        time: timeVal,
        context: document.getElementById('readingContext').value || "Manual",
        note: document.getElementById('readingNotes').value || "", 
        timestamp: Timestamp.fromDate(new Date(`${dateVal}T${timeVal}`))
    };

    try {
        if (id) {
            await updateDoc(doc(db, "readings", id), payload);
        } else {
            await addDoc(collection(db, "readings"), { ...payload, created: Timestamp.now() });
        }
        window.closeModal();
    } catch(err) { 
        console.error(err); 
        alert("Error saving reading: " + err.message); 
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

/* --- HELPERS --- */
function updateStats() {
    if (!allReadings.length) {
        updateStatElements(0, "--", "--", "--");
        return;
    }
    
    const total = allReadings.length;
    const sum = allReadings.reduce((a, b) => a + b.glucose, 0);
    const avg = Math.round(sum / total);
    const inRange = allReadings.filter(r => r.glucose >= 70 && r.glucose <= 180).length;
    const rangePct = Math.round((inRange / total) * 100) + '%';
    
    // The query orders by timestamp desc, so [0] is the most recent
    const latest = allReadings[0].glucose;
    
    updateStatElements(total, avg, rangePct, latest);
}

function updateStatElements(total, avg, range, latest) {
    // Desktop IDs
    if(document.getElementById('dt-total')) document.getElementById('dt-total').innerText = total;
    if(document.getElementById('dt-avg')) document.getElementById('dt-avg').innerText = avg;
    if(document.getElementById('dt-range')) document.getElementById('dt-range').innerText = range;
    if(document.getElementById('dt-latest')) document.getElementById('dt-latest').innerText = latest;

    // Mobile IDs
    if(document.getElementById('mb-total')) document.getElementById('mb-total').innerText = total;
    if(document.getElementById('mb-avg')) document.getElementById('mb-avg').innerText = avg;
    if(document.getElementById('mb-range')) document.getElementById('mb-range').innerText = range;
    if(document.getElementById('mb-latest')) document.getElementById('mb-latest').innerText = latest;
}

function getStatus(g) {
    if (g < 70) return { class: 'low', text: 'Low', color: '#ef4444' };
    if (g > 180) return { class: 'high', text: 'High', color: '#f59e0b' };
    return { class: 'normal', text: 'Normal', color: '#10b981' };
}

function formatTime(t) {
    if (!t) return "";
    const [h, m] = t.split(':');
    const d = new Date(); d.setHours(h); d.setMinutes(m);
    return d.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
}

function updateUserUI(user) {
    document.querySelectorAll('.u-name').forEach(el => el.innerText = user.displayName || 'User');
}