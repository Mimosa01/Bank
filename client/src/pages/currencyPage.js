import { el, setChildren, mount, text } from 'redom';

import header from './components/header';
import { addErrorDOM, exchangeCurrency, streamCurrencies, validation } from '../utils';
import dropdown from './components/dropdown';

const $containerEC = el(
    'article.currency.card-model',
    el('h3.card-header', 'Изменение курсов валют в реальном времени'),
    el('ul.list-reset.list-currency')
  );

// Функция отрисовки DOM контейнера со список валют пользователя
// data - список объектов валют и их суммы
function userCurrency(data) {
  const $container = el('article.user-currency.card-model.card-model--white'),
        $header = el('h3.card-header', 'Ваши валюты'),
        $listCurrency = el('ul.list-reset.list-currency');

  data.forEach(element => {
    const $item = el(
      'li.list-currency__item',
      element.code,
      el('span.list-currency__value', Number(element.amount).toFixed(2))
    );

    mount($listCurrency, $item);
  });

  setChildren($container, [$header, $listCurrency]);

  return $container;
}

// Функция отрисовки формы для обмена валют
// data - список наименований валют
function formTranslateCurrency(data, dataForUserCurrency) {
  const $container = el('div.translate.card-model.card-model--white'),
        $header = el('h3.card-header', 'Обмен валют'),
        $fromDropdown = dropdown(data, 'sender', null),
        $toDropdown = dropdown(data, 'recipient', null),
        $inputAmount = el('input.translate__input', {type: 'number', name: 'amount', placeholder: 'Сумма'}),
        $button = el('button.btn-reset.btn-primary.btn-primary--normal', 'Обменять'),
        $fromContainer = el('label.translate__label.translate__label--mb', el('span.translate__span', 'Из'), $fromDropdown),
        $toContainer = el('label.translate__label.translate__label--mb', el('span.translate__span', 'в'), $toDropdown),
        $amountContainer = el('label.translate__label.translate__label--wrap', el('span.translate__span.translate__span--no-wrapper', 'Сумма'), $inputAmount),
        $translateWrapper = el('div.translate__wrapper', $fromContainer, $toContainer),
        $form = el(
          'form.translate__form', {action: 'post'},
          el(
            'div.translate__dropdown-container',
            $translateWrapper,
            $amountContainer,
          ),
          $button
        );

  setChildren($container, [$header, $form])

  $inputAmount.addEventListener('focus', () => {
    $inputAmount.value = '';
  });

  $inputAmount.addEventListener('blur', () => {
    $inputAmount.value = $inputAmount.value.trim();
  });

  $button.addEventListener('click', async (event) => {
    event.preventDefault();

    if ($inputAmount.classList.contains('form__input--error')) {
      $inputAmount.classList.remove('form__input--error');
    }

    [$translateWrapper, $amountContainer].forEach(container => {
      if (container.querySelector('.form__error-container')) {
        container.removeChild(container.querySelector('.form__error-container'));
      }
    })

    if ($fromDropdown.querySelector('button').dataset.value === $toDropdown.querySelector('button').dataset.value) {
      addErrorDOM($translateWrapper, null, 'Переводить одну и ту же валюту нельзя');
    } else {
      const valid = validation([$inputAmount], 'translate');

      if (valid) {
        const responce = await exchangeCurrency(
          $fromDropdown.querySelector('button').dataset.value,
          $toDropdown.querySelector('button').dataset.value,
          $inputAmount.value
        );

        if (responce) {
          addErrorDOM($amountContainer, $inputAmount, responce);
        } else {
          location.reload();
        }
      }
    }
  });

  return $container;
}

// Функция рендера изменения курса валют
// data - объект от Websocket
function renderExchangeCourse(data) {
  const $item = el('li.list-currency__item', `${data.from}/${data.to}`),
        $span = el('span.list-currency__value', data.rate);

  if (data.change === 1) {
    $item.classList.add('list-currency__item--buy');
    $span.classList.add('list-currency__value--icon-buy');
  } else if (data.change === -1) {
    $item.classList.add('list-currency__item--low');
    $span.classList.add('list-currency__value--icon-low');
  }

  const heightContainer = $containerEC.offsetHeight;
  const heightList = $containerEC.querySelector('ul').offsetHeight;
  let offset = 200;

  if (window.innerWidth < 1023) {
    offset = 150;
  }

  if (heightList + offset > heightContainer) {
    $containerEC.querySelector('ul').lastChild.remove();
  }

  mount($item, $span);
  mount($containerEC.querySelector('ul'), $item, $containerEC.querySelector('ul').firstChild);
}

// Главная функция компонента currencyPage
// root - корневой контейнер
// data - список объектов валют текущего счета {валюта: сумма}
// allCurrencies - список всех известных валют
export default function currencyPage(root, data, allCurrencies) {
  const $container = el('div.container'),
        $header = el('section.info-section', el('h2.page-header', 'История баланса')),
        $mainSection = el('section.main.main--all-gap'),
        $userContainer = el('div.user-container');

  setChildren($userContainer, [
    userCurrency(Object.values(data)),
    formTranslateCurrency(allCurrencies, Object.values(data))]);
  setChildren($mainSection, [$userContainer, $containerEC]);
  setChildren($container, [$header, $mainSection]);
  setChildren(root, [header(true), $container]);

  streamCurrencies(renderExchangeCourse);
}

