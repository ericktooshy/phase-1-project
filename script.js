let drills = [];
let savedDrills = JSON.parse(localStorage.getItem('savedDrills')) || [];

const drillsList = document.getElementById('drills-list');
const savedList = document.getElementById('saved-list');
const levelSelect = document.getElementById('level');
const filterBtn = document.getElementById('filter-btn');
const randomBtn = document.getElementById('random-btn');
const viewSavedBtn = document.getElementById('view-saved');
const backBtn = document.getElementById('back-btn');
const drillsContainer = document.getElementById('drills-container');
const savedContainer = document.getElementById('saved-drills');
const detailsContainer = document.getElementById('drill-details');

fetch('drills.json')
    .then(response => response.json())
    .then(data => {
        drills = data.drills;
        displayDrills(drills);
    })
    .catch(error => {
        drillsList.innerHTML = '<p>Error loading drills.</p>';
    });

function displayDrills(drillsToShow) {
    drillsList.innerHTML = '';
    
    if (drillsToShow.length === 0) {
        drillsList.innerHTML = '<p>No drills found.</p>';
        return;
    }
    
    drillsToShow.forEach(drill => {
        const drillCard = document.createElement('div');
        drillCard.className = 'drill-card';
        drillCard.innerHTML = `
            <h3>${drill.name}</h3>
            <span class="level ${drill.skillLevel}">${drill.skillLevel}</span>
            <p>${drill.description.substring(0, 80)}...</p>
        `;
        drillCard.addEventListener('click', () => showDrillDetails(drill.id));
        drillsList.appendChild(drillCard);
    });
}

function showDrillDetails(drillId) {
    const drill = drills.find(d => d.id === drillId);
    if (!drill) return;
    
    document.getElementById('detail-title').textContent = drill.name;
    document.getElementById('detail-level').textContent = drill.skillLevel;
    document.getElementById('detail-duration').textContent = drill.duration;
    document.getElementById('detail-equipment').textContent = drill.equipment.join(', ');
    document.getElementById('detail-description').textContent = drill.description;
    
    const saveBtn = document.getElementById('save-btn');
    const isSaved = savedDrills.includes(drillId);
    saveBtn.textContent = isSaved ? 'Remove from Saved' : 'Save Drill';
    saveBtn.onclick = () => toggleSaveDrill(drillId, isSaved);
    
    detailsContainer.classList.remove('hidden');
    drillsContainer.classList.add('hidden');
    savedContainer.classList.add('hidden');
}

function toggleSaveDrill(drillId, isSaved) {
    if (isSaved) {
        savedDrills = savedDrills.filter(id => id !== drillId);
    } else {
        savedDrills.push(drillId);
    }
    
    localStorage.setItem('savedDrills', JSON.stringify(savedDrills));
    showDrillDetails(drillId);
}

filterBtn.addEventListener('click', () => {
    const level = levelSelect.value;
    let filteredDrills = drills;
    
    if (level !== 'all') {
        filteredDrills = drills.filter(drill => drill.skillLevel === level);
    }
    
    displayDrills(filteredDrills);
});

randomBtn.addEventListener('click', () => {
    if (drills.length === 0) return;
    const randomIndex = Math.floor(Math.random() * drills.length);
    showDrillDetails(drills[randomIndex].id);
});

viewSavedBtn.addEventListener('click', () => {
    savedList.innerHTML = '';
    
    if (savedDrills.length === 0) {
        savedList.innerHTML = '<p>No saved drills.</p>';
    } else {
        const savedDrillsData = drills.filter(drill => savedDrills.includes(drill.id));
        savedDrillsData.forEach(drill => {
            const drillCard = document.createElement('div');
            drillCard.className = 'drill-card';
            drillCard.innerHTML = `
                <h3>${drill.name}</h3>
                <span class="level ${drill.skillLevel}">${drill.skillLevel}</span>
                <p>${drill.description.substring(0, 80)}...</p>
            `;
            drillCard.addEventListener('click', () => showDrillDetails(drill.id));
            savedList.appendChild(drillCard);
        });
    }
    
    savedContainer.classList.remove('hidden');
    drillsContainer.classList.add('hidden');
    detailsContainer.classList.add('hidden');
});

backBtn.addEventListener('click', () => {
    savedContainer.classList.add('hidden');
    drillsContainer.classList.remove('hidden');
});

document.getElementById('close-btn').addEventListener('click', () => {
    detailsContainer.classList.add('hidden');
    drillsContainer.classList.remove('hidden');
});