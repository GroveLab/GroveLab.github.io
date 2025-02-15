const orcidId = '0000-0001-5390-7579';
const orcidApiUrl = `https://pub.orcid.org/v3.0/${orcidId}/works`;

async function fetchPublications() {
    try {
        const response = await fetch(orcidApiUrl, {
            headers: {
                'Accept': 'application/vnd.orcid+json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch publications');
        }
        const data = await response.json();
        return data.group;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function displayPublications(publications) {
    const publicationsContainer = document.getElementById('publications');
    publications.forEach(pub => {
        const work = pub['work-summary'][0];
        const year = work['publication-date'] ? work['publication-date'].year.value : 'N/A';

        if (year < 2016) {
            return;
        }

        const title = work.title.title.value;
        const journalTitle = work['journal-title'] ? work['journal-title'].value : 'Pre-Print';
        const doi = work['external-ids']['external-id'].find(id => id['external-id-type'] === 'doi');
        const doiUrl = doi ? `https://doi.org/${doi['external-id-value']}` : null;

        const pubElement = document.createElement('div');
        pubElement.className = 'publication';
        pubElement.innerHTML = `
            <h3>${title}</h3>
            <p><strong>Year:</strong> ${year}</p>
            <p><strong>Journal:</strong> ${journalTitle}</p>
            ${doiUrl ? `<p><a href="${doiUrl}" target="_blank">View Publication</a></p>` : ''}
        `;
        publicationsContainer.appendChild(pubElement);
    });
}

async function loadPublications() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    try {
        const publications = await fetchPublications();
        loadingElement.style.display = 'none';
        displayPublications(publications);
    } catch (error) {
        loadingElement.style.display = 'none';
        errorElement.textContent = 'Failed to load publications. Please try again later.';
        errorElement.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', loadPublications);