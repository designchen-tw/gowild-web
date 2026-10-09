(() => {
  const style = document.createElement('style');
  style.setAttribute('data-ld-conditions-equal-height', 'v1');
  style.textContent = `
    /* Match every card to the tallest card in its current grid row. */
    main.ld-detail .ld-condition-panel .ld-condition-grid {
      align-items: stretch !important;
    }
    main.ld-detail .ld-condition-panel .ld-condition-grid > article {
      align-self: stretch !important;
      height: 100% !important;
    }
  `;
  document.head.appendChild(style);
})();
