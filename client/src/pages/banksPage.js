import { el, setChildren } from "redom";
import header from './components/header';
import initMap from "../ymaps";

// Главная функция компонета banksPage
// root - корневой элемент
// data - список объектов координат
export default async function banksPage(root, data) {
  const $container = el('div.container');
  const $header = el('section.info-section', el('h2.page-header', 'Карта банкоматов'));
  const $map = el('div.map', {id: 'app'});

  setChildren($container, [$header, $map])
  setChildren(root, [header(true), $container]);
  initMap(data)
}
