
const showInputError = (formElement, inputElement, errorMessage, config) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
};

const hideInputError = (formElement, inputElement, config) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = '';
};

const toggleSubmitButtonState = (inputList, submitButton, config) => {
    const isValid = inputList.every((inputElement) => inputElement.validity.valid);

    if (isValid) {
        submitButton.classList.remove(config.inactiveButtonClass);
        submitButton.removeAttribute('disabled');
    } else {
        submitButton.classList.add(config.inactiveButtonClass);
        submitButton.setAttribute('disabled', 'true');
    }
};

const checkInputValidity = (formElement, inputElement, config) => {
    const regex = /^[A-Za-zА-Яа-яЁё\s-]+$/;

    // Проверяем, является ли текущий input полем ссылки
    if (inputElement.name === "link") {
        // Для поля ссылки не применяем регулярное выражение
        inputElement.setCustomValidity(""); // Убираем сообщение об ошибке, если оно есть
    } else if (inputElement.value && !regex.test(inputElement.value)) {
        // Применяем регулярное выражение только к остальным полям
        inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
        inputElement.setCustomValidity(""); // Убираем сообщение об ошибке
    }

    // Отображаем ошибки валидации
    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
        hideInputError(formElement, inputElement, config);
    }
};

const setEventListeners = (formElement, config) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const submitButton = formElement.querySelector(config.submitButtonSelector);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(formElement, inputElement, config);
            toggleSubmitButtonState(inputList, submitButton, config);
        });
    });

    toggleSubmitButtonState(inputList, submitButton, config);
};

// Включение валидации для всех форм на странице
export const enableValidation = (config) => {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    formList.forEach((formElement) => {
        formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
        });
        setEventListeners(formElement, config);
    });
};

// Функция для очистки ошибок валидации и сброса состояния кнопки
export const clearValidation = (formElement, config) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const submitButton = formElement.querySelector(config.submitButtonSelector);

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, config);
        inputElement.classList.remove(config.inputErrorClass);
    });

    submitButton.classList.add(config.inactiveButtonClass);
    submitButton.setAttribute('disabled', 'true');
};