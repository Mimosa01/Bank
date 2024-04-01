import { el, setChildren } from 'redom';

function skeletonHeader() {
  return el(
    'div.skeleton__header.skeleton__light.shadow',
    el(
      'div.container.skeleton__header-container',
      el('div.skeleton__logo.skeleton__dark.skeleton__radius'),
      el(
        'div.skeleton__nav',
        el('div.skeleton__nav-item.skeleton__dark.skeleton__radius.shadow'),
        el('div.skeleton__nav-item.skeleton__dark.skeleton__radius.shadow'),
        el('div.skeleton__nav-item.skeleton__dark.skeleton__radius.shadow'),
        el('div.skeleton__nav-item.skeleton__dark.skeleton__radius.shadow'),
      ),
      el('div.skeleton__burger.skeleton__dark.shadow'),
    )
  )
}

function skeletonCard() {
  return el(
    'div.skeleton__card.skeleton__light.shadow',
    el('div.skeleton__card-number.skeleton__dark.skeleton__radius'),
    el('div.skeleton__card-balance.skeleton__dark.skeleton__radius'),
    el(
      'div.skeleton__card-wrapper',
      el('div.skeleton__card-text.skeleton__dark.skeleton__radius'),
      el('div.skeleton__card-btn.skeleton__dark.skeleton__radius')
    )
  )
}

function skeletonInfoSection() {
  return el(
    'div.container.skeleton__info.skeleton__info-second',
    el(
      'div.skeleton__info-wrapper',
      el('div.skeleton__info-header.skeleton__radius.skeleton__dark'),
      el('div.skeleton__info-number.skeleton__radius.skeleton__dark'),
    ),
    el(
      'div.skeleton__info-wrapper',
      el('div.skeleton__info-btn.skeleton__radius.skeleton__dark'),
      el(
        'div.skeleton__balance-wrapper',
        el('div.skeleton__balance-text.skeleton__radius.skeleton__dark'),
        el('div.skeleton__balance-text.skeleton__radius.skeleton__dark'),
      ),
    )
  )
}

export function skeletonCurrency(root) {
  const loader = el(
    'div.skeleton',
    skeletonHeader(),
    el(
      'div.container.skeleton__info',
      el('div.skeleton__info-header.skeleton__radius.skeleton__dark')
    ),
    el(
      'div.container.skeleton__main',
      el(
        'div.skeleton__main-wrapper',
        el('div.skeleton__user-currency.skeleton__card-radius.skeleton__light'),
        el('div.skeleton__form-currency.skeleton__card-radius.skeleton__light'),
      ),
      el('div.skeleton__all-currency.skeleton__card-radius.skeleton__light')
    )
  )

  setChildren(root, loader);
}

export function skeletonDynamic(root) {
  const loader = el(
    'div.skeleton',
    skeletonHeader(),
    skeletonInfoSection(),
    el(
      'div.container.skeleton__main',
      el('div.skeleton__all-width.shadow.skeleton__card-radius.skeleton__light'),
      el('div.skeleton__all-width.shadow.skeleton__card-radius.skeleton__light'),
      el('div.skeleton__all-width.skeleton__card-radius.skeleton__light'),
    )
  )

  setChildren(root, loader);
}

export function skeletonViewBalance(root) {
  const loader = el(
    'div.skeleton',
    skeletonHeader(),
    skeletonInfoSection(),
    el(
      'div.container.skeleton__main',
      el('div.skeleton__form.skeleton__card-radius.skeleton__light'),
      el('div.skeleton__chart.skeleton__card-radius.skeleton__light.shadow'),
      el('div.skeleton__all-width.skeleton__card-radius.skeleton__light'),
    )
  )

  setChildren(root, loader);
}

export function skeletonAccounts(root) {
  const loader = el(
    'div.skeleton',
    skeletonHeader(),
    el(
      'div.container.skeleton__info',
      el('div.skeleton__info-header.skeleton__radius.skeleton__dark'),
      el('div.skeleton__dropdown.skeleton__radius.skeleton__dark'),
      el('div.skeleton__info-btn.skeleton__radius.skeleton__dark'),
    ),
    el(
      'div.container.skeleton__card-list',
      skeletonCard(),
      skeletonCard(),
      skeletonCard(),
      skeletonCard(),
      skeletonCard(),
      skeletonCard(),
      skeletonCard(),
      skeletonCard(),
      skeletonCard(),
    )
  );

  setChildren(root, loader);
}

export function skeletonMap(root) {
  const loader = el(
    'div.skeleton',
    skeletonHeader(),
    el(
      'div.container.skeleton__info',
      el('div.skeleton__info-header.skeleton__dark.skeleton__radius')
    ),
    el('div.container', el('div.skeleton__map.skeleton__dark'))
  )

  setChildren(root, loader);
}
