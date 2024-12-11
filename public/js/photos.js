const viewMode = document.getElementById('viewMode');
const localStorageViewMode = localStorage.getItem('photos-view-mode');
const isGridView = document.getElementById('mode-grid-view');
const isTableView = document.getElementById('mode-table-view');
const gridView = document.querySelector('#gridView');
const tableView = document.querySelector('#tableView');
const allActualPhotos = document.querySelectorAll('#tableView img');
const viewPort = document.getElementById('viewPort');
let viewPortContent = null;
const monthYearSelector = document.getElementById('monthYearSelector');
let lastMonthToSelect = null;

//-- get all photos without url (only the pure image file)
const getAllPhotosAsArrayWithoutUrl = () => {
    return Array.from(allActualPhotos).map(img => img.getAttribute('src'));
};

/* Todo: prevent redundant for loop (Optimization required!) */
/* *************************** */
/* Date (month/year/ selector) */
/* Autofill select options     */
/* *************************** */
const getAllAvailableDates = () => {
    const allAvDates = [];
    for (let i = 0; i < viewPortContent.length; i++) {
        const item = viewPortContent[i];
        const monthYear = item.id.substring(item.id.indexOf('.') + 1);
        allAvDates.push(monthYear);
    }
    const removeDuplicates = [... new Set(allAvDates)];
    removeDuplicates.forEach(el => {
        const newOption = document.createElement('option');
        newOption.value = el;
        newOption.text = el;
        monthYearSelector.appendChild(newOption);
    });

    lastMonthToSelect = removeDuplicates[0];
};

/* ********************************** */
/* Filter content (by date selection) */
/* grid view = card, table view = tr  */
/* ********************************** */
const monthYearLocalStorage = localStorage.getItem('monthYear');
monthYearSelector.value = monthYearLocalStorage !== null ? monthYearLocalStorage : 'show_all';

monthYearSelector.addEventListener('change', (event) => {
    const selected = event.target.value;
    localStorage.setItem('monthYear', selected);
    for (let i = 0; i < viewPortContent.length; i++) {
        const item = viewPortContent[i];
        const monthYear = item.id.substring(item.id.indexOf('.') + 1);
        if (selected === monthYear || selected === 'show_all') {
            item.classList.remove('d-none');
        } else {
            item.classList.add('d-none');
        }
    }
});

/* ****************** */
/* Dark-/Light - Mode */
/* ****************** */
const theme = document.querySelector('html');
const switchButton = document.querySelector('#themeSwitcher > button');
theme.setAttribute('data-theme', localStorage.getItem('theme'));
switchButton.classList.add(localStorage.getItem('theme'));
// Theme Switching: 1. get actual class, 2. overwrite with select class
switchButton.addEventListener('click', (event) => {
    const actClass = event.target.getAttribute('class');
    if (actClass === 'dark') {
        localStorage.setItem('theme', 'light');
        theme.setAttribute('data-theme', 'light');
        switchButton.classList.add('light');
        switchButton.classList.remove('dark')
    } else {
        localStorage.setItem('theme', 'dark');
        theme.setAttribute('data-theme', 'dark');
        switchButton.classList.add('dark');
        switchButton.classList.remove('light');
    }
});

/* ************************************* */
/* Delete photos functionality ********* */
/* ************************************* */
//- single file without confirmation (delete on both sides)
const deletePhoto = async (value) => {
    const item = value.split(",");
    const id = +item[0];
    const photo = item[1];
    const findItem = await viewPortContent[id];
    fetch('api/photos/delete', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([photo])
    }).then(() =>
        findItem.remove(),
        showSnackBar("Photo has been deleted.")
    ).catch(error =>
        console.log(error.message));
};

//-- all files with confirmation
const deleteAllPhotos = () => {
    const photos = getAllPhotosAsArrayWithoutUrl();
    fetch('api/photos/delete', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(photos)
    }).then(() =>
        location.reload()
    ).catch(error => console.log(error.message));
};

//-- setter: view mode table
const setTableViewMode = () => {
    viewPortContent = viewPort.querySelector('tbody').querySelectorAll('tr');
    localStorage.setItem('photos-view-mode', 'mode-table-view');
    tableView.classList.remove('d-none')
    gridView.classList.add('d-none');
    isGridView.removeAttribute('checked');
    isTableView.setAttribute('checked', 'checked');
}
//-- setter: view mode grid
const setGridViewMode = () => {
    viewPortContent = viewPort.querySelectorAll('article');
    localStorage.setItem('photos-view-mode', 'mode-grid-view');
    gridView.classList.remove('d-none');
    tableView.classList.add('d-none');
    isTableView.removeAttribute('checked');
    isGridView.setAttribute('checked', 'checked');
};

//-- view mode switching (grid, table)
viewMode.addEventListener('change', (event) => {
    const { id } = event.target;
    id === 'mode-table-view' ? setTableViewMode() : setGridViewMode();
    location.reload();
});

//-- format date to required download designation format (YYYY-MM-DD_HH:MM:SS.jpg)
const formatDateToDownloadDesignation = (event) => {
    let { id } = event.target; // keep it simple ... get required props from event target
    //const originalFileEnding = id.split('.')[1]; // set original file ending
   
    // build required format
    const ident = id.split('.')[0];
    const dt = new Date(parseInt(ident));
    const toIso = dt.toISOString();
    const toIsoWithoutSeconds = toIso.substring(0, toIso.lastIndexOf(':'));
    const destinationFormat = toIsoWithoutSeconds.replace('T', '_').replaceAll('-', '_');

    //event.target.setAttribute('download', destinationFormat + '.' + originalFileEnding); // overwrite download attribute with original file ending
    event.target.setAttribute('download', destinationFormat); // overwrite download attribute
};

//-- load required data after dom content was loaded
document.addEventListener('DOMContentLoaded', () => {
    localStorageViewMode !== null && localStorageViewMode === 'mode-table-view' ? setTableViewMode() : setGridViewMode();
    getAllAvailableDates();
    monthYearSelector.value = monthYearLocalStorage || lastMonthToSelect; // if no value set actual month as default fallback.
    monthYearSelector.dispatchEvent(new Event('change'));
});

// init image lazy loading ...
window.lazyLoadOptions = {};