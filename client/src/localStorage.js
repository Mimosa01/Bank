// возвращаем входящие данные в виде строки
function dataToJson(data) {
  return JSON.stringify(data);
}

// возвращаем входящую строку в виде данных
function jsonToData(data) {
  return JSON.parse(data);
}

// возвращаем данные из localStorage
export function getItemData(key) {
  return localStorage.getItem(key);
}

// записываем данные в localStorage
export function setItemData(key, data) {
  localStorage.setItem(key, dataToJson(data));
}

// удаляем данные из localStorage
export function removeItem(key) {
  localStorage.removeItem(key);
}

// дополняем данные в localStorage по ключу
export function addStorage(key, item) {
  let data = getItemData(key) ? jsonToData(getItemData(key)) : [];

  data.push(item);
  setItemData(key, data);
}

// получить данные в види json
export function getData(key) {
  let data = getItemData(key) ? jsonToData(getItemData(key)) : [];
  return data;
}
