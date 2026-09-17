import { auth, db } from "./firebase-init.js";
import { collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- State ---
    let currentUser = null;
    let currentMessages = [];

    // --- DOM Elements ---
    const messagesContainer = document.getElementById('messagesContainer');
    const refreshBtn = document.getElementById('refreshInbox');
    const markAllReadBtn = document.getElementById('markAllRead');
    
    // Desktop Reader Elements
    const readerEmpty = document.getElementById('readerEmpty');
    const readerContent = document.getElementById('readerContent');
    const readerSubject = document.getElementById('readerSubject');
    const readerSender = document.getElementById('readerSender');
    const readerEmail = document.getElementById('readerEmail');
    const readerDate = document.getElementById('readerDate');
    const readerAvatar = document.getElementById('readerAvatar');
    const readerBody = document.getElementById('readerBody');

    // Mobile Modal Elements
    const messageModal = document.getElementById('messageModal');
    const modalContainer = messageModal.querySelector('.modal-container');
    const modalBody = document.getElementById('modalBody');
    const modalSubject = document.getElementById('modalSubject');
    const modalSender = document.getElementById('modalSender');
    const modalEmail = document.getElementById('modalEmail');
    const modalDate = document.getElementById('modalDate');
    const closeBtns = document.querySelectorAll('.close-modal');

    // --- Auth Check ---
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            loadMessages();
        } else {
            window.location.href = 'login.html';
        }
    });

    // --- Event Listeners ---
    if(refreshBtn) refreshBtn.addEventListener('click', () => {
        const icon = refreshBtn.querySelector('i');
        icon.classList.remove('fa-arrow-rotate-right');
        icon.classList.add('fa-spinner', 'fa-spin');
        loadMessages().then(() => {
            icon.classList.remove('fa-spinner', 'fa-spin');
            icon.classList.add('fa-arrow-rotate-right');
        });
    });
    
    if(markAllReadBtn) markAllReadBtn.addEventListener('click', markAllAsRead);

    // ==========================================
    // MODAL DRAG-TO-CLOSE PHYSICS (Mobile)
    // ==========================================
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    modalContainer.addEventListener('touchstart', (e) => {
        if (modalBody.parentElement.scrollTop > 0) return; 
        startY = e.touches[0].clientY;
        isDragging = true;
        modalContainer.style.transition = 'none'; 
    }, { passive: true });

    modalContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        if (deltaY > 0) modalContainer.style.transform = `translateY(${deltaY}px)`;
    }, { passive: true });

    modalContainer.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        modalContainer.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'; 
        const deltaY = currentY - startY;
        if (deltaY > 120) closeModal();
        else modalContainer.style.transform = '';
        currentY = 0; startY = 0;
    });

    const closeModal = () => {
        messageModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalContainer.style.transform = '';
            modalContainer.style.transition = '';
        }, 300);
    };
    
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    messageModal.addEventListener('click', (e) => { if(e.target === messageModal) closeModal(); });

    // ==========================================
    // CORE LOGIC 
    // ==========================================
    async function loadMessages() {
        if (!currentUser) return;

        try {
            const q = query(collection(db, "messages"), where("recipientId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            
            currentMessages = [];
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                data.id = docSnap.id;
                currentMessages.push(data);
            });

            // Sort by newest first
            currentMessages.sort((a, b) => {
                const timeA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.date || 0).getTime();
                const timeB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.date || 0).getTime();
                return timeB - timeA; 
            });

            renderMessages();

        } catch (error) {
            console.error('Error loading messages:', error);
            messagesContainer.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--danger);">
                    <i class="fa-solid fa-circle-exclamation" style="font-size: 1.5rem; margin-bottom: 10px;"></i>
                    <p style="font-weight: 500;">Failed to sync inbox.</p>
                </div>`;
        }
    }

    function renderMessages() {
        messagesContainer.innerHTML = '';
        
        if (currentMessages.length === 0) {
            messagesContainer.innerHTML = `
                <div style="padding: 4rem 2rem; text-align: center; color: var(--text-secondary);">
                    <i class="fa-solid fa-check-circle" style="font-size: 2rem; margin-bottom: 1rem; color: var(--border);"></i>
                    <p style="font-size: 0.95rem;">You're all caught up.</p>
                </div>`;
            return;
        }

        currentMessages.forEach(msg => {
            const isUnread = !msg.read;
            const senderNameDisplay = msg.senderName || msg.senderEmail || 'SugarTrack ';
            
            const msgDiv = document.createElement('div');
            msgDiv.className = `email-item ${isUnread ? 'unread' : ''}`;
            msgDiv.dataset.id = msg.id;

            const dateStr = msg.timestamp && msg.timestamp.toDate ? formatCleanDate(msg.timestamp.toDate()) : formatCleanDate(msg.date);
            const bodyPreview = truncateText(msg.body || '', 90);
            
            // The dynamic mail icon
            const mailIconClass = isUnread ? 'fa-envelope' : 'fa-envelope-open';

            msgDiv.innerHTML = `
                <div class="mail-icon-box">
                    <i class="fa-solid ${mailIconClass}"></i>
                </div>
                <div class="e-content-col">
                    <div class="e-top-row">
                        <span class="e-name">SugarTrack</span>
                        <span class="e-time">${dateStr}</span>
                    </div>
                    <div class="e-subject">${escapeHtml(msg.subject || 'No Subject')}</div>
                    <div class="e-preview">${bodyPreview}</div>
                </div>
            `;
            //     <div class="mail-icon-box">
            //         <i class="fa-solid ${mailIconClass}"></i>
            //     </div>
            //     <div class="e-content-col">
            //         <div class="e-top-row">
            //             <span class="e-name">${escapeHtml(senderNameDisplay)}</span>
            //             <span class="e-time">${dateStr}</span>
            //         </div>
            //         <div class="e-subject">${escapeHtml(msg.subject || 'No Subject')}</div>
            //         <div class="e-preview">${bodyPreview}</div>
            //     </div>
            // `;

            msgDiv.addEventListener('click', () => openMessage(msg, msgDiv));
            messagesContainer.appendChild(msgDiv);
        });
    }

    async function openMessage(msg, element) {
        // Highlight active item in list
        document.querySelectorAll('.email-item').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');

        const senderNameDisplay = msg.senderName || 'SugarTrack';
        const initial = senderNameDisplay.charAt(0).toUpperCase();
        const fullDate = msg.timestamp && msg.timestamp.toDate 
            ? msg.timestamp.toDate().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'}) 
            : new Date(msg.date).toLocaleString();
        const formattedBody = escapeHtml(msg.body || '').replace(/\n/g, '<br><br>');

        const isDesktop = window.innerWidth > 992;

        if (isDesktop) {
            // Fill Desktop Reader Pane
            readerEmpty.style.display = 'none';
            readerContent.style.display = 'flex';
            
            readerSubject.textContent = msg.subject || 'No Subject';
            readerSender.textContent = senderNameDisplay;
            readerEmail.textContent = `<${'sugartrack.com'}>`;
            // readerEmail.textContent = `<${msg.senderEmail || 'system@sugartrack.com'}>`;
            readerDate.textContent = fullDate;
            readerAvatar.textContent = initial;
            readerBody.innerHTML = formattedBody;
        } else {
            // Fill Mobile Modal
            modalSubject.textContent = msg.subject || 'No Subject';
            modalSender.textContent = senderNameDisplay;
            modalEmail.textContent = `<${msg.senderEmail || 'system@sugartrack.com'}>`;
            modalDate.textContent = fullDate;
            modalBody.innerHTML = formattedBody;

            messageModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Handle Unread State
        if (!msg.read) {
            try {
                await updateDoc(doc(db, "messages", msg.id), { read: true, readAt: new Date() });
                msg.read = true;
                element.classList.remove('unread');
                
                // Change the envelope icon instantly!
                const icon = element.querySelector('.mail-icon-box i');
                if(icon) {
                    icon.classList.remove('fa-envelope');
                    icon.classList.add('fa-envelope-open');
                }
            } catch (error) { console.error('Error marking read:', error); }
        }
    }

    async function markAllAsRead() {
        const unreadMsgs = currentMessages.filter(m => !m.read);
        if (unreadMsgs.length === 0) return;
        
        const iconBtn = markAllReadBtn.querySelector('i');
        iconBtn.classList.replace('fa-check-double', 'fa-spinner');
        iconBtn.classList.add('fa-spin');
        markAllReadBtn.style.pointerEvents = "none";

        try {
            for (const msg of unreadMsgs) {
                await updateDoc(doc(db, "messages", msg.id), { read: true, readAt: new Date() });
                msg.read = true; 
            }
            renderMessages();
        } catch (error) { console.error(error); } 
        finally {
            iconBtn.classList.replace('fa-spinner', 'fa-check-double');
            iconBtn.classList.remove('fa-spin');
            markAllReadBtn.style.pointerEvents = "auto";
        }
    }

    // --- Clean Utilities ---
    function formatCleanDate(date) {
        if (!date) return '';
        if (typeof date === 'string') date = new Date(date);
        
        const now = new Date();
        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        
        if (isToday) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    function truncateText(text, maxLength) {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    function escapeHtml(text) {
        if (!text) return "";
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});