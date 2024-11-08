import './index.css';
import { initialCards } from './cards';
import { createCard, deleteCard, likeCard} from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { getUserInfo, getCards, editUserInfo } from './components/api.js';
import { cohortId, token } from './components/api';


const cardList = document.querySelector('.places__list');

let userId;

// Переменные картинки \\
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const captionElement = imagePopup.querySelector('.popup__caption');

// Переменные профиля \\
const nameElement = document.querySelector('.profile__title');
const avatarElement = document.querySelector('.profile__image');
const aboutElement = document.querySelector('.profile__description');
const editButton = document.querySelector('.profile__edit-button');
const profileEditForm = document.querySelector('form[name="edit-profile"]');
const nameInput = profileEditForm.querySelector('.popup__input_type_name');
const jobInput = profileEditForm.querySelector('.popup__input_type_description');
const jobElement = document.querySelector('.profile__description');
const profileEditPopup = profileEditForm.closest('.popup');

// Переменные карточки \\
const addButton = document.querySelector('.profile__add-button');
const addCardPopup = document.querySelector('.popup_type_new-card');
const addFormElement = addCardPopup.querySelector('.popup__form');
const cardNameInput = addFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = addFormElement.querySelector('.popup__input_type_url');

// Переменные аватара \\
const editAvatarButton = document.querySelector('.profile__edit-avatar-button');
const avatarPopup = document.querySelector('.popup_type_new-avatar');
const avatarInput = avatarPopup.querySelector('#link');
const avatarForm = avatarPopup.querySelector('.popup__form');


// Вызов каждой карточки \\
initialCards.forEach(cardData => {
    if (cardData._id) {
        const cardElement = createCard(cardData, deleteCard, likeCard, handleImageClick, cohortId, token);
        cardList.appendChild(cardElement);
    }
});


// Функции \\
function handleProfileEditFormSubmit(evt) {
    evt.preventDefault();

    const submitButton = evt.submitter;
    toggleButtonLoadingState(submitButton, true);

    const nameValue = nameInput.value;
    const jobValue = jobInput.value;

    editUserInfo(nameValue, jobValue, nameElement, aboutElement)
        .then(() => {
            nameElement.textContent = nameValue;
            jobElement.textContent = jobValue;
            closeModal(profileEditPopup);
        })
        .catch(err => {
            console.error("Ошибка при сохранении данных:", err);
        })
        .finally(() => {
            toggleButtonLoadingState(submitButton, false);
        });
}

function handleAddCardFormSubmit(evt) {
    evt.preventDefault();

    const cardName = cardNameInput.value;
    const cardLink = cardLinkInput.value;
    const submitButton = evt.submitter; 

    addNewCard(cardName, cardLink, submitButton)
    .then(() => {
        closeModal(addCardPopup);
        addFormElement.reset();
    })
    .catch(err => {
        console.error("Ошибка при добавлении карточки на сервер:", err);
    });
}

function handleAvatarFormSubmit(evt) {
    evt.preventDefault();

    const avatarUrl = avatarInput.value;
    const submitButton = evt.submitter;

    if (avatarUrl) {
        updateAvatar(avatarUrl, submitButton)
            .then(() => {
                avatarElement.style.backgroundImage = `url(${avatarUrl})`;
                closeModal(avatarPopup);
            })
            .catch(err => {
                console.error("Ошибка при обновлении аватара:", err);
            });
    } else {
        console.error("Неверный формат URL аватара");
    }
}

avatarForm.addEventListener('submit', handleAvatarFormSubmit);


function handleImageClick(cardData) {
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    captionElement.textContent = cardData.name;
    openModal(imagePopup);
}

// Закрытие попапов \\
const closeButtons = document.querySelectorAll('.popup__close');
const popups = document.querySelectorAll('.popup');

function setupPopupCloseListeners() {
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popup = button.closest('.popup');
            closeModal(popup);
        });
    });

    popups.forEach(popup => {
        popup.addEventListener('click', (event) => {
            if (event.target === popup) {
                closeModal(popup);
            }
        });
    });
}

// Добавление обработчиков \\
editButton.addEventListener('click', () => {
    nameInput.value = nameElement.textContent;
    jobInput.value = jobElement.textContent;
    clearValidation(profileEditForm, validationConfig);
    openModal(profileEditPopup);
});

profileEditForm.addEventListener('submit', handleProfileEditFormSubmit);

addButton.addEventListener('click', () => {
    clearValidation(addFormElement, validationConfig);
    openModal(addCardPopup);
});

addFormElement.addEventListener('submit', handleAddCardFormSubmit);


editAvatarButton.addEventListener('click', () => {
    openModal(avatarPopup);
});



// Валидация \\
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__input-error_active'
};


enableValidation(validationConfig);
setupPopupCloseListeners();



Promise.all([getUserInfo(nameElement, aboutElement, avatarElement), getCards()])
    .then(([userData, cards]) => {
        userId = userData._id;
        cards.forEach(cardData => {
            const cardElement = createCard(
                cardData, 
                deleteCard, 
                likeCard, 
                handleImageClick, 
                userId,
                cohortId,
                token
            );
            cardList.appendChild(cardElement);
        });
    })
    .catch(err => {
        console.error("Ошибка при загрузке данных:", err);
    });


function addNewCard (name, link, submitButton) {
    toggleButtonLoadingState(submitButton, true);

    return fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
        method: 'POST',
        headers: {
            authorization: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            link: link
        })
    })
    .then (res => res.json())
    .then(newCardData => {
        const cardElement = createCard(newCardData, deleteCard, likeCard, handleImageClick, userId, cohortId, token);
        cardList.prepend(cardElement);
    })
    .catch(err => {
        console.error('Ошибка при добавлении новой карточки:', err);
    })
    .finally(() => {
        toggleButtonLoadingState(submitButton, false);
    });
}



function updateAvatar(url, submitButton) {
    toggleButtonLoadingState(submitButton, true);

    return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me/avatar`, {
        method: 'PATCH',
        headers: {
            authorization: token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar: url })
    })
    .then(res => res.json())
    .catch(err => {
        console.error("Ошибка при обновлении аватара:", err);
    })
    .finally(() => {
        toggleButtonLoadingState(submitButton, false);
    });
}


function toggleButtonLoadingState(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = 'Сохранение...';
    } else {
        button.textContent = button.dataset.originalText;
    }
}
