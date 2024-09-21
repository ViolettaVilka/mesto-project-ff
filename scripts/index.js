// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const cardList = document.querySelector('.places__list');

//Добавление карточки
function createCard(cardData) {
    const template = document.getElementById('card-template');
    const cardElement = template.content.cloneNode(true);

    cardElement.querySelector('.card__title').textContent = cardData.name;
    cardElement.querySelector('.card__image').src = cardData.link;

    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', deleteCard);

    return cardElement;
}

//Удаление карточки
function deleteCard(evt) {
    evt.target.closest('.card').remove();
}

//Вызов каждой карточки
initialCards.forEach(function(cardData) {
    const cardElement = createCard(cardData, deleteCard);
    cardList.appendChild(cardElement); 
});