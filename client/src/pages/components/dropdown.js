import { el, setChildren, mount } from 'redom';

import Check from '../../asset/images/check.svg';

// Функция создания dropdown
// fields - список полей, которые будут добавлены в вчыпадающий список
// id - идентификатор DOM контейнера dropdown, он же является обозначением где применяется dropdown
// btnDropdown - принимает DOM элемент в качестве кнопки для dropdown
// handlerDrop - функция, которую нужно вызвать, при выборе какого-то элемента в dropdown (применяется только для сортировки)
// handlerRender - дополнительная функция, которую может принимать handlerDrop (применятся только для сортировки)
export default function dropdown(fields, id, btnDropdown=null, handlerDrop=null, handlerRender=null) {
  const $dropdownContainer = el('div.dropdown.dropbtn__arrow'),
        $dropdownContent = el('div.dropdown-content', {id: id}),
        $btnDropdown = btnDropdown ? btnDropdown : el('button');

  $btnDropdown.classList.add('dropbtn', 'outline-effect');

  if (id === 'filter') {
    $btnDropdown.textContent = 'Сортировка';
  } else {
    $btnDropdown.setAttribute('data-value', fields[0]);
    if (!('placeholder' in $btnDropdown.attributes)) {
      $btnDropdown.textContent = fields[0];
    }
  }

  fields.forEach(field => {
    const $item = el('a.dropdown__item', {href: '#'});
    if (typeof field === 'object') {
      $item.textContent = field.text;
      $item.setAttribute('data-filter', field.attr);
    } else {
      $item.textContent = field;
    }

    $item.addEventListener('click', () => {
      $dropdownContainer.classList.toggle('dropbtn__arrow--up');

      if ($dropdownContent.classList.contains('show')) {
        $dropdownContent.classList.remove('show');
      }

      document.querySelectorAll('.dropdown__item').forEach(element => {
        if (element.querySelector('img')) {
          element.removeChild(element.querySelector('img'));
        }
      });

      const $check = el('img', {src: Check});
      mount($item, $check);

      if (id === 'filter') {
        $btnDropdown.textContent = field.text;
        $btnDropdown.dataset.value = field.attr;
        handlerDrop($item.dataset.filter, handlerRender);
      } else {
        if ('placeholder' in $btnDropdown.attributes) {
          $btnDropdown.value = field
        } else {
          $btnDropdown.textContent = field;
        }

        $btnDropdown.dataset.value = field;
      }
    });
    mount($dropdownContent, $item);
  });

  $btnDropdown.addEventListener('click', () => {
    $dropdownContainer.classList.toggle('dropbtn__arrow--up');
    $dropdownContent.classList.toggle("show");
  });

  document.addEventListener('click', (event) => {
    event.preventDefault();

    if (!event.target.closest('.dropdown')) {

      if ($dropdownContainer.classList.contains('dropbtn__arrow--up')) {
        $dropdownContainer.classList.remove('dropbtn__arrow--up');
      }

      if ($dropdownContent.classList.contains('show')) {
        $dropdownContent.classList.remove('show');
      }
    }
  });

  setChildren($dropdownContainer, [$btnDropdown, $dropdownContent]);

  return $dropdownContainer;
}
