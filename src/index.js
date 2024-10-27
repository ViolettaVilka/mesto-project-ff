import './index.css';
import { initialCards } from './cards';
import { createCard, deleteCard, likeCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';

const cardList = document.querySelector('.places__list');

//Переменные попапа\\
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const captionElement = imagePopup.querySelector('.popup__caption');

//Переменные редактирования профиля\\
const editButton = document.querySelector('.profile__edit-button');
const profileEditForm = document.querySelector('form[name="edit-profile"]');
const nameInput = profileEditForm.querySelector('.popup__input_type_name');
const jobInput = profileEditForm.querySelector('.popup__input_type_description');
const nameElement = document.querySelector('.profile__title');
const jobElement = document.querySelector('.profile__description');
const profileEditPopup = profileEditForm.closest('.popup');

//Переменные добавления карточки\\
const addButton = document.querySelector('.profile__add-button');
const addCardPopup = document.querySelector('.popup_type_new-card');
const addFormElement = addCardPopup.querySelector('.popup__form');
const cardNameInput = addFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = addFormElement.querySelector('.popup__input_type_url');


//Вызов каждой карточки\\
initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, deleteCard, likeCard, handleImageClick);
    cardList.appendChild(cardElement);
});

//Функции\\
function handleProfileEditFormSubmit(evt) {
    evt.preventDefault();

    const nameValue = nameInput.value;
    const jobValue = jobInput.value;

    nameElement.textContent = nameValue;
    jobElement.textContent = jobValue;

    closeModal(profileEditPopup);
}

function handleAddCardFormSubmit(evt) {
    evt.preventDefault();
    const cardName = cardNameInput.value;
    const cardLink = cardLinkInput.value;

    const newCard = createCard({ name: cardName, link: cardLink }, deleteCard, likeCard, handleImageClick);
    cardList.prepend(newCard);

    closeModal(addCardPopup);
    addFormElement.reset();
}

function handleImageClick(cardData) {
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    captionElement.textContent = cardData.name;
    openModal(imagePopup);
}

//Закрытие попапов\\
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

//Добавление обработчиков\\
editButton.addEventListener('click', () => {
    nameInput.value = nameElement.textContent;
    jobInput.value = jobElement.textContent;

    openModal(profileEditPopup);
});

profileEditForm.addEventListener('submit', handleProfileEditFormSubmit);
addButton.addEventListener('click', () => {
    openModal(addCardPopup);
});
addFormElement.addEventListener('submit', handleAddCardFormSubmit);


setupPopupCloseListeners();