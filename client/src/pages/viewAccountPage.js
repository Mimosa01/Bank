import { el, mount, setChildren } from "redom";

import header from "./components/header";
import historyComponent from "./components/historyTable";
import { infoSection } from "./components/infoSectionComponent";
import dynamicBalanceComponent from "./components/chartComponent";
import { existsHistoryPayments, trunsferFunds, addErrorDOM, PATH, validation } from "../utils";
import dropdown from "./components/dropdown";

import SenderIcon from '../asset/images/sender.svg';

// Функция отрисовки формы перевода между счетами
// currentAccount - номер счета
function formTransaction(currentAccount) {
  const $container = el('arcticle.transaction.card-model'),
        $form = el('form.transaction__form.form', {action: 'post'}),
        $header = el('h3.form__header-transaction', 'Новый перевод'),
        $senderContainer = el('div.form__input-container.transaction__input-container.form__input-login-container',
          el('label.form__label.transaction__label', {for: 'sender'}, 'Номер счета получателя')),
        $amountContainer = el('div.form__input-container.transaction__input-container.form__input-password-container',
          el('label.form__label.transaction__label', {for: 'amount'}, 'Сумма перевода')),
        $senderInput = el('input.form__input', {type: 'text', name: 'sender', placeholder: 'Номер счета'}),
        $amountInput = el('input.form__input', {type: 'text', name: 'amount', placeholder: 'Сумма'}),
        $button = el('button.btn-reset.btn-primary.form__btn.transaction__btn.btn-flex', el('img', {src: SenderIcon}), 'Отправить');

  if (existsHistoryPayments()) {
    mount($senderContainer, dropdown(existsHistoryPayments(), 'transaction', $senderInput));
  } else {
    mount($senderContainer, $senderInput);
  }

  mount($amountContainer, $amountInput);
  setChildren($form, [$header, $senderContainer, $amountContainer, $button]);
  setChildren($container, $form);

  [$senderInput, $amountInput].forEach((input) => {
    input.addEventListener('focus', () => {
      input.value = '';
    });

    input.addEventListener('blur', () => {
      input.value = input.value.trim();
    });
  });

  $button.addEventListener('click', async (event) => {
    event.preventDefault();

    [$senderInput, $amountInput].forEach(input => {
      if (input.classList.contains('form__input--error')) {
        input.classList.remove('form__input--error');
      }
    });

    document.querySelectorAll('.form__error-container').forEach(element => {
      element.remove()
    });

    const valid = validation([$senderInput, $amountInput], 'transaction');

    if (valid) {
      const responce = await trunsferFunds(currentAccount, $senderInput.value.trim(), $amountInput.value.trim());

      if (responce) {
        addErrorDOM($amountContainer, $amountInput, responce);
      }
    }
  });

  return $container;
}

// Главная функция компонента viewAccountPage
// root - корневой контейнер
// data - объект счета пользователя
export default function viewAccountPage(root, data) {
  const $container = el('div.container');
  const $mainSection = el('section.main.main--all-gap');
  const $chart = dynamicBalanceComponent(6, data, 'simple');

  setChildren($mainSection, [formTransaction(data.account), $chart, historyComponent(data.transactions.slice(-10), data.account)]);
  setChildren($container, [infoSection(data.account, data.balance, PATH.accounts), $mainSection]);
  setChildren(root, [header(true), $container]);
}
