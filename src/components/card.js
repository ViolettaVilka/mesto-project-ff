export function createCard(cardData, deleteCard, likeCard, handleImageClick, userId, cohortId, token) {
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
            deleteCard(evt, cardData._id, cohortId, token);
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
        likeCard(likeButton, cardData, cohortId, token, likeCountElement);
    });

    imageElement.addEventListener('click', () => {
        handleImageClick(cardData);
    });

    return cardElement;
}



//Удаление карточки\\
export function deleteCard(evt, cardId, cohortId, token) {
    const cardElement = evt.target.closest('.card');

    fetch(`https://nomoreparties.co/v1/${cohortId}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
            authorization: token
        }
    })
    .then(res => {
        if (res.ok) {
            cardElement.remove();
        } else {
            console.error('Не удалось удалить карточку');
        }
    })
}


//Лайк\\
export function likeCard(likeButton, cardData, cohortId, token, likeCountElement) {
    const cardId = cardData._id;
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const method = isLiked ? 'DELETE' : 'PUT';

    fetch(`https://nomoreparties.co/v1/${cohortId}/cards/likes/${cardId}`, {
        method: method,
        headers: {
            authorization: token
        }
    })
    .then(res => res.json())
    .then(updatedCard => {
        likeButton.classList.toggle('card__like-button_is-active');
        likeCountElement.textContent = updatedCard.likes.length;
    })
    .catch(err => {
        console.error('Ошибка при нажатии на лайк:', err);
    });
}