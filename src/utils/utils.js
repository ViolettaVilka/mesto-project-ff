// Функция для проверки ответа от сервера
export function checkResponse(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}


// Универсальная функция запроса с проверкой ответа
export function request(endpoint, options = {}) {
    const baseUrl = 'https://nomoreparties.co/v1/wff-cohort-25';
    return fetch(`${baseUrl}${endpoint}`, options).then(checkResponse);
}

// Универсальная функция управления текстом кнопки
export function renderLoading(isLoading, button, buttonText='Сохранить', loadingText='Сохранение...') {
    if (isLoading) {
      button.textContent = loadingText
    } else {
      button.textContent = buttonText
    }
  }

// Универсальную функция, которая принимает функцию запроса, объект события и текст во время загрузки
export function handleSubmit(request, evt, loadingText = "Сохранение...") {
     evt.preventDefault();

     const submitButton = evt.submitter;
     const initialText = submitButton.textContent;

     renderLoading(true, submitButton, initialText, loadingText);
     request()
       .then(() => {
         evt.target.reset();
       })
       .catch((err) => {
         console.error(`Ошибка: ${err}`);
       })
       .finally(() => {
         renderLoading(false, submitButton, initialText);
       });
   }