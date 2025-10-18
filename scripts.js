document.addEventListener('DOMContentLoaded', function() {
    // Initialize first link
    addNewLink();
});

// Global variables
let selectedPlatform = 'all';

// Platform Selection
document.querySelectorAll('.platform-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedPlatform = this.dataset.platform;
    });
});

// Add New Link
function addNewLink() {
    const linksContainer = document.getElementById('linksContainer');
    const linkItem = document.createElement('div');
    linkItem.className = 'link-item';
    linkItem.innerHTML = `
        <input type="text" class="link-title" placeholder="Link Title (e.g., My Website)">
        <input type="url" class="link-url" placeholder="https://example.com">
        <button class="remove-link" onclick="removeLink(this)">❌</button>
    `;
    linksContainer.appendChild(linkItem);
}

// Remove Link
function removeLink(button) {
    const linkItems = document.querySelectorAll('.link-item');
    if (linkItems.length > 1) {
        button.parentElement.remove();
    } else {
        alert('At least one link is required!');
    }
}

// Generate Bio Links
document.getElementById('generateBtn').addEventListener('click', function() {
    generateBioLinks();
});

function generateBioLinks() {
    const profileName = document.getElementById('profileName').value || 'Your Name';
    const bioDescription = document.getElementById('bioDescription').value || 'Social Media Creator';
    
    // Get all links
    const links = [];
    document.querySelectorAll('.link-item').forEach(item => {
        const title = item.querySelector('.link-title').value;
        const url = item.querySelector('.link-url').value;
        if (title && url) {
            links.push({ title, url });
        }
    });

    if (links.length === 0) {
        alert('Please add at least one link!');
        return;
    }

    // Get theme colors
    const theme = {
        bgColor: document.getElementById('bgColor').value,
        textColor: document.getElementById('textColor').value,
        buttonColor: document.getElementById('buttonColor').value
    };

    // Generate preview
    generatePreview(profileName, bioDescription, links, theme);
    
    // Generate platform specific codes
    generatePlatformCodes(profileName, bioDescription, links, theme);
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    document.getElementById('resetBtn').style.display = 'block';
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Generate Live Preview
function generatePreview(profileName, bioDescription, links, theme) {
    const preview = document.getElementById('bioPreview');
    
    let linksHTML = '';
    links.forEach(link => {
        linksHTML += `
            <a href="${link.url}" class="link-button" target="_blank" 
               style="background: ${theme.buttonColor}; color: white;">
                ${link.title}
            </a>
        `;
    });

    preview.innerHTML = `
        <div class="profile-name" style="color: ${theme.textColor};">${profileName}</div>
        <div class="bio-description" style="color: ${theme.textColor};">${bioDescription}</div>
        <div class="links-container">
            ${linksHTML}
        </div>
    `;
    
    // Apply background color to preview
    preview.style.backgroundColor = theme.bgColor;
}

// Generate Platform Specific Codes
function generatePlatformCodes(profileName, bioDescription, links, theme) {
    const platformCodes = document.getElementById('platformCodes');
    platformCodes.innerHTML = '';

    const platforms = selectedPlatform === 'all' 
        ? ['instagram', 'tiktok', 'youtube', 'twitter'] 
        : [selectedPlatform];

    platforms.forEach(platform => {
        const code = generatePlatformCode(platform, profileName, bioDescription, links, theme);
        const platformCard = createPlatformCard(platform, code);
        platformCodes.appendChild(platformCard);
    });
}

function generatePlatformCode(platform, profileName, bioDescription, links, theme) {
    const platforms = {
        instagram: {
            name: 'Instagram',
            icon: '📷',
            code: `Instagram Bio Template:\n\n${profileName}\n${bioDescription}\n\n🔗 Links:\n${links.map(link => `• ${link.title}: ${link.url}`).join('\n')}\n\n#Instagram #BioLinks`
        },
        tiktok: {
            name: 'TikTok',
            icon: '🎵', 
            code: `TikTok Bio:\n\n${profileName}\n${bioDescription}\n\nLinks in bio! 👆\n\n${links.map(link => `🔗 ${link.title}`).join(' | ')}\n\n#TikTok #Bio`
        },
        youtube: {
            name: 'YouTube',
            icon: '📺',
            code: `YouTube Description:\n\n${profileName}\n${bioDescription}\n\n📌 LINKS:\n${links.map(link => `${link.title}: ${link.url}`).join('\n')}\n\nSubscribe for more content! 👍`
        },
        twitter: {
            name: 'Twitter',
            icon: '🐦',
            code: `Twitter Profile:\n\n${profileName}\n${bioDescription}\n\n🔗: ${links[0]?.url || 'Add your main link'}\n\n#Twitter #Profile`
        }
    };

    return platforms[platform];
}

function createPlatformCard(platform, content) {
    const card = document.createElement('div');
    card.className = 'platform-code-card';
    
    card.innerHTML = `
        <div class="platform-header">
            <h4>${content.icon} ${content.name}</h4>
        </div>
        <div class="generated-content">${content.code}</div>
        <button class="copy-btn" onclick="copyToClipboard('${content.code.replace(/'/g, "\\'")}')">Copy ${content.name} Code</button>
    `;
    
    return card;
}

// Reset Tool
function resetTool() {
    // Clear inputs
    document.getElementById('profileName').value = '';
    document.getElementById('bioDescription').value = '';
    
    // Clear links (keep one)
    const linksContainer = document.getElementById('linksContainer');
    linksContainer.innerHTML = '';
    addNewLink(); // Add one empty link
    
    // Reset theme
    document.getElementById('bgColor').value = '#ffffff';
    document.getElementById('textColor').value = '#000000';
    document.getElementById('buttonColor').value = '#667eea';
    
    // Hide results
    document.getElementById('results').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    
    // Reset platform selection
    document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-platform="all"]').classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard! ✅');
    }).catch(err => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Copied to clipboard! ✅');
    });
}
