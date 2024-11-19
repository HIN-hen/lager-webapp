// Config
const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const scrollbarWidthCssVar = "--pico-scrollbar-width";
const animationDuration = 400; // milliseconds
const title = document.querySelector('.title');
const photo = document.querySelector('.photo');
const download = document.querySelector('.download-image');
let visibleModal = null;
let modalData = null;
let modalTarget = null;
const titleConfirm = document.querySelector('.titleConfirm');
const contentConfirm = document.querySelector('.contentConfirm');

// Toggle modal
const toggleModal = (event) => {
    event.preventDefault();
    const modal = document.getElementById(event.currentTarget.dataset.target);
    const current = event.currentTarget;
    modalTarget = current.getAttribute('data-target'); // confirm-modal, modal
    // complete possible modal data
    modalData = {
            title: current.getAttribute('data-title'), // title, used in all modals
            content: current.getAttribute('data-content'), // only confirmation
            src: (current.src || current.getAttribute('data-image')) // only with image
    }
    if (!modal) return;
    modal && (modal.open ? closeModal(modal) : openModal(modal));
};

//-- Create dynamic modal content
const createContent = async () => { 

    // not needed: const getBase64StringFromDataURL = (dataURL) => dataURL.replace('data:', '').replace(/^.+,/, '');

    if (modalTarget === 'confirm-modal') {
        titleConfirm.innerHTML = modalData.title; // title
        contentConfirm.innerHTML = modalData.content; // content
    }
    if (modalTarget === 'modal') {
        
        fetch(modalData.src) // needed to make image email friendly.
            .then((res) => res.blob())
            .then((blob) => {
                // Read the Blob as DataURL using the FileReader API
                const reader = new FileReader();
                reader.onloadend = () => {
                    
                    title.innerHTML = modalData.title; // title
                    photo.setAttribute('title', `${modalData.title}`); // image title
                    photo.setAttribute('src', `${reader.result}`) // image source (convert to base64 for email copy)
                    download.setAttribute('href', `${modalData.src}`); // download image
                }
                reader.readAsDataURL(blob);
        });   
    }
};

// Open modal
const openModal = async (modal) => {
    const { documentElement: html } = document;
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth) {
        html.style.setProperty(scrollbarWidthCssVar, `${scrollbarWidth}px`);
    }
    html.classList.add(isOpenClass, openingClass);
    // load content into modal after modal has opened, dynamic switch content
    await createContent();
    setTimeout(() => {
        visibleModal = modal;
        html.classList.remove(openingClass);
    }, animationDuration);
    modal.showModal();
};

// Close modal
const closeModal = (modal) => {
    modalData = null;
    visibleModal = null;
    modalTarget = null;
    const { documentElement: html } = document;
    html.classList.add(closingClass);
    setTimeout(() => {
        html.classList.remove(closingClass, isOpenClass);
        html.style.removeProperty(scrollbarWidthCssVar);
        modal.close();
    }, animationDuration);
};

// Close with a click outside
document.addEventListener("click", (event) => {
    if (visibleModal === null) return;
    const modalContent = visibleModal.querySelector("article");
    const isClickInside = modalContent.contains(event.target);
    !isClickInside && closeModal(visibleModal);
});

// Close with Esc key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && visibleModal) {
        closeModal(visibleModal);
    }
});

// Get scrollbar width
const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
};

// Is scrollbar visible
const isScrollbarVisible = () => {
    return document.body.scrollHeight > screen.height;
};
