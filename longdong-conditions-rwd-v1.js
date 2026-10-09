(() => {
  const style = document.createElement('style');
  style.setAttribute('data-ld-conditions-rwd', 'v1');
  style.textContent = `
/* Keep the hierarchy stable while the conditions grid changes columns. */
main.ld-detail .ld-condition-panel .ld-condition-grid { align-items: stretch !important; }
main.ld-detail .ld-condition-panel .ld-condition-grid > article {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto minmax(34px, 1fr) auto !important;
  align-items: start;
  gap: 6px;
  min-height: 104px !important;
  padding: 12px;
}
main.ld-detail .ld-condition-panel .ld-condition-grid > article > small {
  grid-row: 1;
  align-self: start;
  margin: 0 !important;
}
main.ld-detail .ld-condition-panel .ld-condition-grid > article > strong {
  grid-row: 2;
  align-self: center;
  margin: 0 !important;
}
main.ld-detail .ld-condition-panel .ld-condition-grid > article > span {
  grid-row: 3;
  align-self: end;
  margin: 0 !important;
}
main.ld-detail .ld-condition-panel .ld-condition-wind {
  grid-template-rows: auto minmax(36px, 1fr) auto auto !important;
  min-height: 126px !important;
}
main.ld-detail .ld-condition-panel .ld-condition-wind-main {
  grid-row: 2;
  align-self: center;
}
main.ld-detail .ld-condition-panel .ld-condition-wind-detail {
  grid-row: 3 !important;
  align-self: start !important;
  color: var(--gw-ink-detail, rgba(245,245,245,.62)) !important;
  font-size: var(--gw-type-detail, 12px) !important;
  font-weight: 400 !important;
  line-height: 1.6 !important;
}
main.ld-detail .ld-condition-panel .ld-condition-wind-note { grid-row: 4 !important; }
main.ld-detail .ld-condition-panel .ld-condition-tide {
  grid-template-rows: auto auto minmax(34px, 1fr) auto auto !important;
  min-height: 154px !important;
}
main.ld-detail .ld-condition-panel .ld-condition-tide-last {
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  margin: 0 !important;
}
main.ld-detail .ld-condition-panel .ld-condition-tide-last :is(i,b),
main.ld-detail .ld-condition-panel .ld-condition-tide-last [data-tide-last-time] {
  color: var(--gw-ink-detail, rgba(245,245,245,.62)) !important;
  font-size: var(--gw-type-detail, 12px) !important;
  font-weight: 400 !important;
  font-style: normal;
  line-height: 1.6 !important;
}
main.ld-detail .ld-condition-panel .ld-condition-tide [data-tide-state] {
  grid-row: 3;
  align-self: center;
  margin: 0 !important;
}
main.ld-detail .ld-condition-panel .ld-condition-tide-times {
  grid-row: 4;
  align-self: end;
  margin: 0 !important;
  padding-top: 8px;
}
main.ld-detail .ld-condition-panel .ld-condition-tide [data-tide-date] {
  grid-row: 5;
  align-self: end;
  margin: 0 !important;
}
main.ld-detail,
main.ld-detail .ld-detail__section:last-child,
main.ld-detail .ld-detail__safety { margin-bottom: 0 !important; padding-bottom: 0 !important; }
@media (max-width: 980px) {
  main.ld-detail .ld-condition-panel .ld-condition-grid > article { min-height: 110px !important; }
  main.ld-detail .ld-condition-panel .ld-condition-wind { min-height: 132px !important; }
  main.ld-detail .ld-condition-panel .ld-condition-tide { min-height: 158px !important; }
}
@media (max-width: 520px) {
  main.ld-detail .ld-condition-panel .ld-condition-grid > article {
    grid-template-rows: auto minmax(32px, 1fr) auto !important;
    min-height: 106px !important;
    padding: 11px;
  }
  main.ld-detail .ld-condition-panel .ld-condition-wind {
    grid-template-rows: auto minmax(34px, 1fr) auto auto !important;
    min-height: 128px !important;
  }
  main.ld-detail .ld-condition-panel .ld-condition-tide {
    grid-template-rows: auto auto minmax(32px, 1fr) auto auto !important;
    min-height: 150px !important;
  }
  main.ld-detail .ld-condition-panel .ld-condition-wind-detail,
  main.ld-detail .ld-condition-panel .ld-condition-tide-last :is(i,b),
  main.ld-detail .ld-condition-panel .ld-condition-tide-last [data-tide-last-time] {
    font-size: var(--gw-type-detail, 10px) !important;
  }
}
`;
  document.head.appendChild(style);
})();
