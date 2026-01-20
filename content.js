
// Watch for DOM changes to inject buttons
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            injectButtons();
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

function injectButtons() {
    // Find all tweet actions groups (comment, retweet, like, share)
    // Selector: [role="group"] is the action bar
    const groups = document.querySelectorAll('div[role="group"]:not(.tic-processed)');

    groups.forEach(group => {
        // Find the article to ensure we are in a tweet
        const article = group.closest('article[data-testid="tweet"]');
        if (!article) return;

        // Mark group as processed
        group.classList.add('tic-processed');

        // Create button
        const btn = createBtn();
        btn.onclick = (e) => handleCombine(e, article);

        // Append to the group. 
        // Twitter uses flexbox. We likely want to insert it at the end or near the share button.
        // The last element is usually the "Share" or "Views" button.
        group.appendChild(btn);
    });
}

function createBtn() {
    const div = document.createElement('div');
    // Mimic Twitter's action buttons structure usually: 
    // div (hover circle) -> svg
    div.className = 'tic-btn css-1dbjc4n r-18u37iz r-1h0z5md'; // specific twitch classes might help layout but safe to just use custom css
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', 'Combine Images');
    div.setAttribute('title', 'Combine Images');

    // Icon: Snowflake style (FrostFall theme)
    div.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2">
        <g>
            <path d="M21 11h-3.64l1.88-2.61c.45-.63.3-1.51-.33-1.96-.63-.45-1.51-.3-1.96.33L15.2 9.2V6c0-.77-.63-1.4-1.4-1.4-.77 0-1.4.63-1.4 1.4v3.2l-1.75-2.43c-.45-.63-1.33-.78-1.96-.33-.63.45-.78 1.33-.33 1.96L10.24 11H6.6c-.77 0-1.4.63-1.4 1.4 0 .77.63 1.4 1.4 1.4h3.64l-1.88 2.61c-.45.63-.3 1.51.33 1.96.26.19.56.28.85.28.43 0 .86-.2 1.11-.56l1.75-2.43V19c0 .77.63 1.4 1.4 1.4.77 0 1.4-.63 1.4-1.4v-3.2l1.75 2.43c.25.35.68.56 1.11.56.29 0 .59-.09.85-.28.63-.45.78-1.33.33-1.96L17.36 14H21c.77 0 1.4-.63 1.4-1.4 0-.77-.63-1.4-1.4-1.4z"></path>
        </g>
    </svg>
    `;
    return div;
}

async function handleCombine(e, article) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const originalContent = btn.innerHTML;

    try {
        // Loading state
        btn.classList.add('tic-loading');
        // Simple spinner or text
        btn.innerHTML = '<span style="font-size:12px">...</span>';

        const images = getTweetImages(article);

        if (images.length === 0) {
            alert('No images found in this tweet!');
            return;
        }

        const blobs = await Promise.all(images.map(url => fetchImage(url)));
        const bitmaps = await Promise.all(blobs.map(blob => createImageBitmap(blob)));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate dimensions
        let totalHeight = 0;
        let maxWidth = 0;

        bitmaps.forEach(bmp => {
            totalHeight += bmp.height;
            maxWidth = Math.max(maxWidth, bmp.width);
        });

        canvas.width = maxWidth;
        canvas.height = totalHeight;

        // Draw with center alignment
        let currentY = 0;
        bitmaps.forEach(bmp => {
            const x = (maxWidth - bmp.width) / 2;
            ctx.drawImage(bmp, x, currentY);
            currentY += bmp.height;
        });

        // Show Preview instead of auto-download
        canvas.toBlob((blob) => {
            showPreviewModal(blob);
        }, 'image/png');

    } catch (err) {
        console.error('Error combining images:', err);
        alert('Failed to combine images. See console for details.');
    } finally {
        btn.classList.remove('tic-loading');
        btn.innerHTML = originalContent;
    }
}

function showPreviewModal(blob) {
    const url = URL.createObjectURL(blob);

    // Create Overlay
    const overlay = document.createElement('div');
    overlay.className = 'tic-modal-overlay';

    // HTML Structure
    overlay.innerHTML = `
        <div class="tic-modal-content">
            <button class="tic-modal-close" aria-label="Close">×</button>
            <img src="${url}" class="tic-modal-image" alt="Combined Image">
            <div class="tic-modal-actions">
                <button class="tic-btn-download">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 16v-2l-8-5-8 5v2h16zm2-8H1v11c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8zm-2 11H3v-2l8-5 8 5v2zM5 8h14V6H5v2z"></path></svg>
                    Download Image
                </button>
            </div>
        </div>
    `;

    // Event Listeners
    const closeBtn = overlay.querySelector('.tic-modal-close');
    const downloadBtn = overlay.querySelector('.tic-btn-download');
    const img = overlay.querySelector('.tic-modal-image');

    // Close on Escape key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal(overlay, url, escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Close on X
    closeBtn.onclick = () => closeModal(overlay, url, escHandler);

    // Close on clicking background (but not image/content)
    overlay.onclick = (e) => {
        if (e.target === overlay) closeModal(overlay, url, escHandler);
    };

    // Download Handler
    downloadBtn.onclick = () => {
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `frostfall-${timestamp}.png`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    document.body.appendChild(overlay);
}

function closeModal(overlay, url, escHandler) {
    // Remove Esc listener
    if (escHandler) {
        document.removeEventListener('keydown', escHandler);
    }

    // Remove DOM
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }

    // Cleanup URL object after a short delay to ensure any pending downloads/renders are done
    // Or just revoke it. Chrome sometimes crashes if revoked synchronously during a download click?
    // Let's revoke it immediately as standard, but if crash persists, maybe defer
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

function getTweetImages(article) {
    // Select images that look like media
    const imgs = Array.from(article.querySelectorAll('img[src*="pbs.twimg.com/media"]'));

    // Filter out images inside nested tweets (quotes)
    // Strategy: The image's closest 'article' ancestor must be the current article.
    // If there is another article in between, it's a quote (if quotes use article tags).
    // Or check for specific Quote wrappers.

    return imgs.filter(img => {
        // Check if image is within this specific tweet's context
        const closestTweet = img.closest('[data-testid="tweet"]');
        if (closestTweet !== article) return false;

        // Exclude images inside Quote Tweets or Cards
        // Quote tweets are usually wrapped in a div with role="link" (and tabindex="0" etc)
        // Main tweet images are wrapped in 'a' tags, not 'div[role="link"]'
        if (img.closest('div[role="link"]')) return false;

        return true;
    }).map(img => {
        // Get high res URL
        const url = new URL(img.src);
        // Replace name=small/medium with name=large or orig
        if (url.searchParams.has('name')) {
            url.searchParams.set('name', 'orig');
        }
        return url.toString();
    });
}

async function fetchImage(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    return response.blob();
}

// Initial Run
injectButtons();
