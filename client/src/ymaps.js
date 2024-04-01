import * as ymaps from 'ymaps3';

// Инициализация Яндекс карты
// coordinates - список объектов координат
export default async function initMap(coordinates) {
  await ymaps.ready;

  const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker} = ymaps;
  const {YMapDefaultMarker} = await ymaps.import('@yandex/ymaps3-markers@0.0.1');

  const map = new YMap(
      document.getElementById('app'),
      {
          location: {
              center: [37.588144, 55.733842],
              zoom: 10
          }
      }
  );

  map.addChild(new YMapDefaultSchemeLayer());
  map.addChild(new YMapDefaultFeaturesLayer());

  coordinates.forEach(elem => {
    const coor = {
      coordinates: [elem.lon, elem.lat],
      title: 'Coin.',
      color: '#116acc'
    }

    const marker = new YMapDefaultMarker(coor)
    map.addChild(marker)
  });
}
