import './index.css';
import { initialCards } from './cards';
import { createCard, deleteCard, likeCard } from './components/card.js';

const cardList = document.querySelector('.places__list');

//Вызов каждой карточки\\
initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, deleteCard, likeCard, openPopup);
    cardList.appendChild(cardElement);
});


//Открытие попапов\\
function openPopup(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEsc);
}


//Закрытие попапов\\
const closeButtons = document.querySelectorAll('.popup__close');
const popups = document.querySelectorAll('.popup');

function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
}

function handleEsc(event) {
    if (event.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closePopup(openedPopup);
        }
    }
}

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const popup = button.closest('.popup');
        closePopup(popup);
    });
});

popups.forEach(popup => {
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup(popup);
        }
    });
});


//Редактирование профиля\\
const editButton = document.querySelector('.profile__edit-button');
const formElement = document.querySelector('.popup__form');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');

editButton.addEventListener('click', () => {
    const nameElement = document.querySelector('.profile__title');
    const jobElement = document.querySelector('.profile__description');
    
    nameInput.value = nameElement.textContent;
    jobInput.value = jobElement.textContent;
    
    openPopup(formElement.closest('.popup'));
});

function handleFormSubmit(evt) {
    evt.preventDefault();

    const nameValue = nameInput.value;
    const jobValue = jobInput.value;
    const nameElement = document.querySelector('.profile__title');
    const jobElement = document.querySelector('.profile__description');

    nameElement.textContent = nameValue;
    jobElement.textContent = jobValue;

    closePopup(formElement.closest('.popup'));
}

formElement.addEventListener('submit', handleFormSubmit);


//Добавление карточки\\\
const addButton = document.querySelector('.profile__add-button');
const addCardPopup = document.querySelector('.popup_type_new-card');
const addFormElement = addCardPopup.querySelector('.popup__form');
const cardNameInput = addFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = addFormElement.querySelector('.popup__input_type_url');

addButton.addEventListener('click', () => {
    openPopup(addCardPopup);
});

addFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const cardName = cardNameInput.value;
    const cardLink = cardLinkInput.value;

    const newCard = createCard({ name: cardName, link: cardLink }, deleteCard, likeCard, openPopup);
    cardList.prepend(newCard);
    
    closePopup(addCardPopup);
    addFormElement.reset();
});


