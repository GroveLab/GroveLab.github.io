const orcidId = '0000-0001-5390-7579';
const orcidApiUrl = `https://pub.orcid.org/v3.0/${orcidId}/works`;

// Journal name → logo (local path takes priority, then favicon domain, then abbr fallback)
const JOURNAL_STYLES = {
    'nature':                      { local: null,                                          domain: 'nature.com',              abbr: 'NAT',  color: '#dc2626' },
    'nature microbiology':         { local: 'assets/images/journal-logos/nature-microbiology.jpg', domain: 'nature.com',     abbr: 'NMB',  color: '#b45309' },
    'nature communications':       { local: 'assets/images/journal-logos/nature-communications.png', domain: 'nature.com',   abbr: 'NCO',  color: '#c2410c' },
    'nature methods':              { local: null,                                          domain: 'nature.com',              abbr: 'NME',  color: '#7c2d12' },
    'nature medicine':             { local: null,                                          domain: 'nature.com',              abbr: 'NMD',  color: '#991b1b' },
    'nature chemical biology':     { local: null,                                          domain: 'nature.com',              abbr: 'NCB',  color: '#9f1239' },
    'science':                     { local: null,                                          domain: 'science.org',             abbr: 'SCI',  color: '#1d4ed8' },
    'science advances':            { local: null,                                          domain: 'science.org',             abbr: 'SCA',  color: '#1e40af' },
    'cell':                        { local: null,                                          domain: 'cell.com',                abbr: 'CELL', color: '#7c3aed' },
    'cell host & microbe':         { local: null,                                          domain: 'cell.com',                abbr: 'CHM',  color: '#6d28d9' },
    'cell reports':                { local: null,                                          domain: 'cell.com',                abbr: 'CR',   color: '#5b21b6' },
    'current biology':             { local: 'assets/images/journal-logos/current-biology.jpeg', domain: 'cell.com',          abbr: 'CB',   color: '#7c3aed' },
    'plos biology':                { local: null,                                          domain: 'plos.org',                abbr: 'PLB',  color: '#059669' },
    'plos pathogens':              { local: null,                                          domain: 'plos.org',                abbr: 'PLP',  color: '#047857' },
    'plos one':                    { local: null,                                          domain: 'plos.org',                abbr: 'PLO',  color: '#065f46' },
    'elife':                       { local: null,                                          domain: 'elifesciences.org',       abbr: 'ELF',  color: '#d97706' },
    'pnas':                        { local: null,                                          domain: 'pnas.org',                abbr: 'PNAS', color: '#0369a1' },
    'proceedings of the national academy of sciences': { local: null,                     domain: 'pnas.org',                abbr: 'PNAS', color: '#0369a1' },
    'embo reports':                { local: 'assets/images/journal-logos/embo-reports.png', domain: 'embopress.org',         abbr: 'EMBO', color: '#0f766e' },
    'molecular systems biology':   { local: 'assets/images/journal-logos/molecular-systems-biology.png', domain: 'embopress.org', abbr: 'MSB', color: '#0891b2' },
    'journal of virology':         { local: null,                                          domain: 'asm.org',                 abbr: 'JVI',  color: '#0d9488' },
    'mbio':                        { local: null,                                          domain: 'asm.org',                 abbr: 'MBI',  color: '#0891b2' },
    'microbiology spectrum':       { local: null,                                          domain: 'asm.org',                 abbr: 'MSP',  color: '#0e7490' },
    'viruses':                     { local: null,                                          domain: 'mdpi.com',                abbr: 'VIR',  color: '#0284c7' },
    'journal of general virology': { local: null,                                          domain: 'microbiologyresearch.org', abbr: 'JGV', color: '#155e75' },
    'emerging infectious diseases':{ local: null,                                          domain: 'cdc.gov',                 abbr: 'EID',  color: '#166534' },
    'biorxiv':                     { local: 'assets/images/journal-logos/biorxiv.png',    domain: 'biorxiv.org',             abbr: 'BXV',  color: '#475569' },
    'medrxiv':                     { local: null,                                          domain: 'medrxiv.org',             abbr: 'MXV',  color: '#475569' },
    'pre-print':                   { local: 'assets/images/journal-logos/biorxiv.png',    domain: 'biorxiv.org',             abbr: 'BXV',  color: '#475569' },
};

function getJournalStyle(journalName) {
    const key = journalName.toLowerCase().trim();
    if (JOURNAL_STYLES[key]) return JOURNAL_STYLES[key];

    // Partial match — catches "Nature XXX" variants
    for (const [k, v] of Object.entries(JOURNAL_STYLES)) {
        if (key.includes(k) || k.includes(key)) return v;
    }

    // Hash-based colour fallback
    const colours = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#6366f1'];
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colours[Math.abs(hash) % colours.length];
    const abbr = key.split(/\s+/).filter(w => w.length > 2).slice(0, 3).map(w => w[0].toUpperCase()).join('') || '?';
    return { domain: null, abbr, color };
}

function buildBadge(style, journalName) {
    // Local file takes priority; favicon service is the fallback
    const logoUrl = style.local
        ? style.local
        : style.domain
            ? `https://www.google.com/s2/favicons?sz=128&domain=${style.domain}`
            : null;

    if (logoUrl) {
        return `
            <div class="pub-badge pub-badge--logo" style="--badge-color: ${style.color}">
                <img
                    src="${logoUrl}"
                    alt="${journalName} logo"
                    class="pub-badge-img"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
                >
                <span class="pub-badge-abbr" style="display:none">${style.abbr}</span>
            </div>`;
    }
    return `
        <div class="pub-badge" style="--badge-color: ${style.color}">
            <span class="pub-badge-abbr">${style.abbr}</span>
        </div>`;
}

async function fetchPublications() {
    try {
        const response = await fetch(orcidApiUrl, {
            headers: { 'Accept': 'application/vnd.orcid+json' }
        });
        if (!response.ok) throw new Error('Failed to fetch publications');
        const data = await response.json();
        return data.group;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function displayPublications(publications) {
    const container = document.getElementById('publications');

    publications.forEach((pub, index) => {
        const work = pub['work-summary'][0];
        const year = work['publication-date']?.year?.value ?? 'N/A';
        if (year < 2016) return;

        const title      = work.title.title.value;
        const journalName = work['journal-title']?.value ?? 'Pre-Print';
        const doi        = work['external-ids']['external-id'].find(id => id['external-id-type'] === 'doi');
        const doiUrl     = doi ? `https://doi.org/${doi['external-id-value']}` : null;

        const style = getJournalStyle(journalName);
        const badge = buildBadge(style, journalName);

        const el = document.createElement('article');
        el.className = 'publication';
        el.style.animationDelay = `${index * 40}ms`;

        el.innerHTML = `
            ${badge}
            <div class="pub-body">
                <h3 class="pub-title">
                    ${doiUrl
                        ? `<a href="${doiUrl}" target="_blank" rel="noopener noreferrer">${title}</a>`
                        : title}
                </h3>
                <p class="pub-meta">
                    <span class="pub-journal">${journalName}</span>
                    <span class="pub-sep">·</span>
                    <span class="pub-year">${year}</span>
                </p>
            </div>
            ${doiUrl ? `<div class="pub-arrow"><i class="fas fa-arrow-right"></i></div>` : ''}
        `;

        if (doiUrl) {
            el.addEventListener('click', (e) => {
                if (!e.target.closest('a')) window.open(doiUrl, '_blank', 'noopener,noreferrer');
            });
            el.style.cursor = 'pointer';
        }

        container.appendChild(el);
    });
}

async function loadPublications() {
    const loadingEl = document.getElementById('loading');
    const errorEl   = document.getElementById('error');
    try {
        const publications = await fetchPublications();
        loadingEl.style.display = 'none';
        displayPublications(publications);
    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.textContent = 'Failed to load publications. Please try again later.';
        errorEl.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', loadPublications);
