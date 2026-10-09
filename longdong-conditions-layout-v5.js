(() => {
  const style = document.createElement('style');
  style.setAttribute('data-ld-conditions-layout', 'v5');
  style.textContent = `
    /* Every card in a grid row has the same height and the same main-value position. */
    main.ld-detail .ld-condition-panel .ld-condition-grid {
      align-items: stretch !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-grid > article {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) !important;
      grid-template-rows: 20px 20px minmax(32px, auto) minmax(0, 1fr) auto !important;
      align-self: stretch !important;
      align-items: start !important;
      height: auto !important;
      min-height: 0 !important;
      gap: 4px !important;
      padding: 12px !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-grid > article > small {
      grid-row: 1 !important;
      align-self: start !important;
      margin: 0 !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-grid > article > strong {
      grid-row: 3 !important;
      align-self: start !important;
      margin: 0 !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-grid > article > span {
      grid-row: 5 !important;
      align-self: end !important;
      margin: 0 !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-wind-main {
      grid-row: 3 !important;
      align-self: start !important;
      margin: 0 !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-grid > article.ld-condition-wind > .ld-condition-wind-detail {
      grid-row: 4 !important;
      align-self: start !important;
      margin: 0 !important;
      color: var(--gw-ink-detail, rgba(245,245,245,.62)) !important;
      font-size: var(--gw-type-detail, 12px) !important;
      font-weight: 400 !important;
      line-height: 1.6 !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-wind-note {
      grid-row: 5 !important;
      align-self: end !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-tide-last {
      grid-row: 2 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
      gap: 5px !important;
      margin: 0 !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-tide-last :is(i, b) {
      color: var(--gw-ink-detail, rgba(245,245,245,.62)) !important;
      font-size: var(--gw-type-detail, 12px) !important;
      font-weight: 400 !important;
      font-style: normal !important;
      line-height: 1.6 !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-tide [data-tide-state] {
      grid-row: 3 !important;
      align-self: start !important;
      margin: 0 !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-tide-times {
      grid-row: 4 !important;
      align-self: stretch !important;
      align-content: start !important;
      margin: 0 !important;
      padding-top: 6px !important;
      border-top: 1px solid rgba(245,245,245,.1) !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-tide [data-tide-date] {
      grid-row: 5 !important;
      align-self: end !important;
      margin: 0 !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-feels-current {
      grid-row: 5 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
      gap: 5px !important;
      margin: 0 !important;
      align-self: end !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-feels-current :is(i, b) {
      color: var(--gw-ink-detail, rgba(245,245,245,.62)) !important;
      font-size: var(--gw-type-detail, 12px) !important;
      font-weight: 400 !important;
      font-style: normal !important;
      line-height: 1.6 !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-feels-times {
      grid-row: 4 !important;
      align-self: stretch !important;
      align-content: start !important;
      margin: 0 !important;
      padding-top: 6px !important;
      border-top: 1px solid rgba(245,245,245,.1) !important;
    }
    main.ld-detail .ld-condition-panel :is(.ld-condition-tide-times, .ld-condition-feels-times) i {
      color: var(--gw-ink-detail, rgba(245,245,245,.62)) !important;
      font-size: var(--gw-type-detail, 12px) !important;
      font-weight: 400 !important;
      font-style: normal !important;
      line-height: 1.6 !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-tide-clock {
      display: inline-flex !important;
      align-items: baseline !important;
      gap: 2px !important;
      white-space: nowrap !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-tide-clock time {
      color: inherit !important;
      font: inherit !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-tide-clock .ld-condition-tide-offset {
      color: var(--gw-ink-detail, rgba(245,245,245,.62)) !important;
      font-size: var(--gw-type-detail, 12px) !important;
      font-weight: 400 !important;
      line-height: 1.6 !important;
      letter-spacing: 0 !important;
    }
    main.ld-detail,
    main.ld-detail .ld-detail__section:last-child,
    main.ld-detail .ld-detail__safety {
      margin-bottom: 0 !important;
      padding-bottom: 0 !important;
    }
    @media (max-width: 520px) {
      main.ld-detail .ld-condition-panel .ld-condition-grid > article {
        grid-template-rows: 20px 20px minmax(30px, auto) minmax(0, 1fr) auto !important;
        padding: 11px !important;
      }
      main.ld-detail .ld-condition-panel .ld-condition-wind-detail,
      main.ld-detail .ld-condition-panel .ld-condition-tide-last :is(i, b),
      main.ld-detail .ld-condition-panel .ld-condition-feels-current :is(i, b) {
        font-size: var(--gw-type-detail, 10px) !important;
      }
      main.ld-detail .ld-condition-panel :is(.ld-condition-tide-times, .ld-condition-feels-times) i,
      main.ld-detail .ld-condition-panel .ld-condition-tide-clock .ld-condition-tide-offset {
        font-size: var(--gw-type-detail, 10px) !important;
      }
    }
  `;
  document.head.appendChild(style);
})();
