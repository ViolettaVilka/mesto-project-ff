export function createCard({cardData, deleteCard, likeCard, handleImageClick, userId}) {
    const template = document.getElementById('card-template');
    const cardElement = template.content.cloneNode(true);

    cardElement.querySelector('.card__title').textContent = cardData.name;
    const imageElement = cardElement.querySelector('.card__image');
    imageElement.src = cardData.link;
    imageElement.alt = cardData.name;

    //Удаление карточки\\
    const deleteButton = cardElement.querySelector('.card__delete-button');
   
    if (cardData.owner._id !== userId) {
        deleteButton.style.display = 'none';
    } else {
        deleteButton.addEventListener('click', (evt) => {
            deleteCard(evt, cardData._id);
        });
    }

    //Добавление и снятие лайка\\
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCountElement = cardElement.querySelector('.card__like-count');

    likeCountElement.textContent = cardData.likes.length;

    if (cardData.likes.some(like => like._id === userId)) {
        likeButton.classList.add('card__like-button_is-active');
    }

    likeButton.addEventListener('click', () => {
        likeCard(likeButton, cardData, likeCountElement);
    });

    imageElement.addEventListener('click', () => {
        handleImageClick(cardData);
    });

    return cardElement;
}