import { el, mount, setChildren } from 'redom';

import header from "./components/header";
import { addErrorDOM, validation, autorization } from '../utils';

// Функция отрисовки контейнера с формой авторизации
function loginCard() {
  const $container = el('div.login.card-model'),
        $form = el('form.form', {action: 'post'}),
        $header = el('h2.form__header', 'Вход в аккаунт'),
        $loginContainer = el('div.form__input-container.form__input-login-container',
          el('label.form__label', {for: 'login'}, 'Логин')),
        $passwordContainer = el('div.form__input-container.form__input-password-container',
          el('label.form__label', {for: 'password'}, 'Пароль')),
        $loginInput = el('input.form__input', {type: 'text', name: 'login', placeholder: 'Логин'}),
        $passwordInput = el('input.form__input', {type: 'text', name: 'password', placeholder: 'Пароль'}),
        $button = el('button.btn-reset.btn-primary.form__btn', 'Войти');

  mount($loginContainer, $loginInput);
  mount($passwordContainer, $passwordInput);
  setChildren($form, [$header, $loginContainer, $passwordContainer, $button]);
  setChildren($container, $form);

  [$loginInput, $passwordInput].forEach((input) => {
    input.addEventListener('focus', () => {
      input.value = '';
    });

    input.addEventListener('blur', () => {
      input.value = input.value.trim();
    });
  });

  $button.addEventListener('click', async (event) => {
    event.preventDefault();

    [$loginInput, $passwordInput].forEach(input => {
      if (input.classList.contains('form__input--error')) {
        input.classList.remove('form__input--error');
      }
    });

    [$loginContainer, $passwordContainer].forEach(container => {
      if (container.querySelector('.form__error-container')) {
        container.removeChild(container.querySelector('.form__error-container'));
      }
    })

    const valid = validation([$loginInput, $passwordInput], 'auth');

    if (valid) {
      const responce = await autorization($loginInput.value, $passwordInput.value);

      if (responce) {
        if (responce.includes('password')) {
          addErrorDOM($passwordContainer, $passwordInput, responce);
        } else {
          addErrorDOM($loginContainer, $loginInput, responce);
        }
      }
    }
  });

  return $container;
}

// Главная функция компонента autorizationPage
// root - корневой контейнер
export default function autorizationPage(root) {
  const $container = el('div.container', loginCard());

  setChildren(root, [header(false), $container]);
}
