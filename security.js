/**
 * Copyright Protection System
 * - Encrypted copyright injection
 * - DOM tampering detection
 * - Self-healing if removed
 */
(function() {
    // Encrypted copyright data (Base64 encoded)
    const encodedText = 'Q3JlYXRlZCBieSA8YSBocmVmPSJodHRwczovL2dpdGh1Yi5jb20vSHlwZXJkZXZpbC1YIiB0YXJnZXQ9Il9ibGFuayIgcmVsPSJub29wZW5lciBub3JlZmVycmVyIj5IeXBlcmRldmlsLVg8L2E+';
    const authorName = atob('SHlwZXJkZXZpbC1Y');
    const repoLink = atob('aHR0cHM6Ly9naXRodWIuY29tL0h5cGVyZGV2aWwtWA==');

    // Create copyright element
    function createCopyright() {
        const copyright = document.createElement('div');
        copyright.className = 'copyright-protected';
        copyright.innerHTML = `Created by <a href="${repoLink}" target="_blank" rel="noopener noreferrer">${authorName}</a>`;
        
        // Anti-tampering attributes
        copyright.setAttribute('data-protected', 'true');
        copyright.setAttribute('data-created', new Date().toISOString());
        
        return copyright;
    }

    // Inject copyright into DOM
    function injectCopyright() {
        const copyright = createCopyright();
        document.body.appendChild(copyright);
        
        // Self-healing mechanism
        setInterval(() => {
            if (!document.querySelector('.copyright-protected')) {
                document.body.appendChild(createCopyright());
            }
        }, 3000);
    }

    // DOM Ready handler
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectCopyright);
    } else {
        injectCopyright();
    }

    // Console warning
    console.log('%c⚠️ This project is protected by copyright. Removing credits violates license terms.', 
        'color: #ff0000; font-weight: bold; font-size: 12px;');
})();