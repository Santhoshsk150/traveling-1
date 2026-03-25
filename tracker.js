/**
 * COMPLIANT TRACKER DEMO (tracker.js)
 * Privacy-first, consent-based telemetry script.
 * No PII is harvested whatsoever without separate explicit validation.
 */

class PrivacyTracker {
    constructor(endpoint = 'http://localhost:3000') {
        this.endpoint = endpoint;
        this.hasConsent = localStorage.getItem('demo_consent') === 'true';
        this.sessionId = this.getOrSetSessionId();
    }

    // Uses rotating synthetic short-IDs instead of persistent device fingerprinting
    getOrSetSessionId() {
        let sid = sessionStorage.getItem('anon_session_id');
        if (!sid) {
            sid = 'anon_' + Math.random().toString(36).substring(2, 10);
            sessionStorage.setItem('anon_session_id', sid);
        }
        return sid;
    }

    sendEvent(eventType, metadata = {}) {
        if (!this.hasConsent) {
            console.warn(`[Ethical Tracker] Intercepted '${eventType}' event. Transmit BLOCKED due to absent user consent.`);
            return;
        }

        const payload = {
            eventType,
            ts: new Date().toISOString(),
            sessionId: this.sessionId, // anonymized short string
            page: window.location.pathname,
            metadata
        };

        console.log(`[Ethical Tracker] Consent found. Dispatching minimal payload:`, payload);
        
        // Simulating backend send (Fail silently if local backend is off)
        fetch(`${this.endpoint}/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => {
            if(res.ok) console.log('[Ethical Tracker] Successfully stored on server.');
        }).catch(err => {
            console.log('[Ethical Tracker Network] Server offline. This is absolutely normal if the Node.js backend is not currently running.');
        });
    }
}

// Global instantiation
window.AppTracker = new PrivacyTracker();

// Document interactions
document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById('consent-banner');
    const tableBody = document.getElementById('events-table-body');
    
    // UI Init - Hide banner if preference saved
    if (localStorage.getItem('demo_consent') !== null) {
        if(banner) banner.style.display = 'none';
    }

    function addRowToFakeTable(type) {
        if(!window.AppTracker.hasConsent) return;
        if(tableBody) {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-white/5 transition border-b border-white/5 animate-pulse";
            tr.innerHTML = `
                <td class="py-3 px-2 text-gray-500">${new Date().toISOString()}</td>
                <td class="py-3 px-2 text-neonCyan">${type}</td>
                <td class="py-3 px-2">${window.AppTracker.sessionId}</td>
                <td class="py-3 px-2">${window.location.pathname}</td>
            `;
            tableBody.prepend(tr);
            // Remove pulse after brief mapping
            setTimeout(() => tr.classList.remove('animate-pulse'), 1000);
        }
    }

    document.getElementById('btn-accept')?.addEventListener('click', () => {
        localStorage.setItem('demo_consent', 'true');
        window.AppTracker.hasConsent = true;
        banner.style.display = 'none';
        window.AppTracker.sendEvent('consent_granted');
        addRowToFakeTable('consent_granted');
        alert("Verification confirmed: Local Consent Granted. Analytics enabled.");
    });

    document.getElementById('btn-deny')?.addEventListener('click', () => {
        localStorage.setItem('demo_consent', 'false');
        window.AppTracker.hasConsent = false;
        banner.style.display = 'none';
        alert("Action secured: Consent Denied. All Analytics disabled. Zero transmission.");
    });

    document.getElementById('btn-reset-consent')?.addEventListener('click', () => {
        localStorage.removeItem('demo_consent');
        window.AppTracker.hasConsent = false;
        window.location.reload();
    });

    // Synthetic triggers for demo
    document.getElementById('btn-click-event')?.addEventListener('click', () => {
        if(!window.AppTracker.hasConsent) return alert("You must Accept consent before tracking triggers.");
        window.AppTracker.sendEvent('synthetic_click', { target: 'demo_btn' });
        addRowToFakeTable('synthetic_click');
    });

    document.getElementById('btn-page-event')?.addEventListener('click', () => {
        if(!window.AppTracker.hasConsent) return alert("You must Accept consent before tracking triggers.");
        window.AppTracker.sendEvent('synthetic_pageview', { title: document.title });
        addRowToFakeTable('synthetic_pageview');
    });
});
