import { el, setChildren } from "redom";
import { PATH, navigate } from "../../utils";
import { removeItem } from "../../localStorage";

import Logo from '../../asset/images/logo.svg';

// Функция отрисовки шапки приложения
// isLogin - (true/false) - если true, значит пользователь залогинился, значит можно показать меню
export default function header(isLogin) {
  const $header = el('header.header'),
        $logo = el('a.header__logo.logo', {href: '#'}, el('img.logo__img', {src: Logo, alt: 'Coin.'})), // Надо вставить ссылку на список счетов
        $container = el('div.container.header__container'),
        $btnBanks = el('a.btn-reset.btn-outline.outline-effect', {href: PATH.banks}, 'Банкоматы'),
        $btnAccounts = el('a.btn-reset.btn-outline.outline-effect', {href: PATH.accounts}, 'Счета'),
        $btnCurrency = el('a.btn-reset.btn-outline.outline-effect', {href: PATH.currencies}, 'Валюты'),
        $btnExit = el('a.btn-reset.btn-outline.outline-effect', {href: PATH.exit}, 'Выйти'),
        $burgerButton = el( 'button.header__burger-btn', {id: 'burger'}, el('span'), el('span'), el('span')),
        $btnBanksBurger = el('a.menu__link', {href: PATH.banks}, 'Банкоматы'),
        $btnAccountsBurger = el('a.menu__link', {href: PATH.accounts}, 'Счета'),
        $btnCurrencyBurger = el('a.menu__link', {href: PATH.currencies}, 'Валюты'),
        $btnExitBurger = el('a.menu__link', {href: PATH.exit}, 'Выход'),
        $menu = el('nav.nav', el('ul.list-reset.nav__list', el('li.nav__item', $btnBanks), el('li.nav__item', $btnAccounts),
                el('li.nav__item', $btnCurrency), el('li.nav__item', $btnExit))),
        $burgerContainer = el(
          'nav.menu.list-reset',
          {id: 'menu'},
          el('li.menu__item', $btnBanksBurger),
          el('li.menu__item', $btnAccountsBurger),
          el('li.menu__item', $btnCurrencyBurger),
          el('li.menu__item', $btnExitBurger)
        );

  setChildren($container, isLogin ? [$logo, $burgerButton, $menu, $burgerContainer] : $logo);
  setChildren($header, $container);

  [$btnAccounts, $btnAccountsBurger, $btnBanks, $btnBanksBurger, $btnCurrency, $btnCurrencyBurger]
  .forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      if (window.location.pathname.slice(1) !== event.target.getAttribute('href').slice(0, -1)) {
        navigate(event.target.getAttribute('href'));
      }
    });
  });

  [$btnExit, $btnExitBurger].forEach((btn) => {
    btn.addEventListener('click', () => {
      removeItem('token');
      navigate('/');
    });
  });

  $burgerButton.addEventListener('click', () => {
    $header.classList.toggle('open');
  });

  $burgerButton.addEventListener('click', (event) => {
    event._isClickWithInMenu = true;
  });

  $burgerContainer.addEventListener('click', (event) => {
    event._isClickWithInMenu = true;
  });

  document.body.addEventListener('click', event => {
    if (event._isClickWithInMenu) return;
    $header.classList.remove("open")
  });

  return $header;
}
