/* Defulan artwork from the Illustrator export, aligned to its retained GPS waypoints. */
window.GoWildGPXMap({
  prefix: 'df',
  sectors: [
    ['終極邊境','Final Frontier'],
    ['邊境（左）','Frontier Left'],
    ['邊境（右）','Frontier Right'],
    ['崇高之地','Loftier'],
    ['金三角','Racketeer'],
    ['青竹東','Orienteer']
  ],
  translate: {
    '山上松亭露營區':'Songting Campground',
    '德芙蘭生態步道':'Defulan Ecological Trail',
    '人工之字坡':'Switchback',
    '松鶴公車站':'Songhe Bus Stop',
    '德芙蘭步道停車場':'Defulan Trailhead Parking',
    '台 8 線 · 中部橫貫公路':'Hwy 8 · Central Cross-Island Hwy',
    '松鶴橋':'Songhe Bridge',
    '大甲溪':'Dajia River'
  },
  samples: {
    "origin": {
      "latitude": 24.177574,
      "longitude": 120.976627,
      "x": 1503.5584495266485,
      "y": 320.6633285553846
    },
    "metersPerDegree": {
      "latitude": 110760.79069963617,
      "longitude": 101611.66810791292
    },
    "svgUnitsPerMeter": 3.6735145863209997,
    "bounds": [
      0.0,
      0.0,
      1762.0,
      1483.85
    ],
    "waypoints": [
      {
        "name": "德芙蘭步道停車場",
        "x": 1503.56,
        "y": 320.66,
        "latitude": 24.177574,
        "longitude": 120.976627
      },
      {
        "name": "金三角",
        "x": 608.83,
        "y": 615.25,
        "latitude": 24.17685,
        "longitude": 120.97423
      },
      {
        "name": "崇高之地",
        "x": 791.73,
        "y": 334.5,
        "latitude": 24.17754,
        "longitude": 120.97472
      },
      {
        "name": "終極邊境",
        "x": 911.18,
        "y": 419.94,
        "latitude": 24.17733,
        "longitude": 120.97504
      },
      {
        "name": "邊境（左）",
        "x": 970.9,
        "y": 399.6,
        "latitude": 24.17738,
        "longitude": 120.9752
      },
      {
        "name": "邊境（右）",
        "x": 1097.81,
        "y": 314.15,
        "latitude": 24.17759,
        "longitude": 120.97554
      }
    ]
  },
  css: `
main.df-detail [data-df-sector-map] {
  --accent:var(--gw-crag-accent,#a9d9b6);
  --muted:var(--gw-crag-muted,#a2aaa6);
  --map:#1c2123;
  --map-ink:#d2d6d7;
  --map-outline:#d2d5d6;
  --map-selection:rgba(var(--gw-crag-accent-rgb,169,217,182),.27);
  --gw-map-control-bg:rgba(var(--gw-crag-nav-rgb,27,29,31),.74);
  --gw-map-control-hover-bg:rgba(var(--gw-crag-nav-rgb,27,29,31),.86);
  --map-control-border:rgba(var(--gw-crag-neutral-rgb,255,255,255),.2);
  --map-location:#4cb6e0;
  --map-location-outline:#fff;
  width:100%; margin:0 auto 30px;
}
html[data-gw-theme="light"] main.df-detail [data-df-sector-map] {
  --map:var(--gw-crag-map-forest,#ccd2c8);
  --map-ink:var(--gw-crag-text,#262626);
  --map-outline:var(--gw-crag-map-outline,#56614f);
  --map-selection:rgba(var(--gw-crag-accent-rgb,41,103,68),.16);
  --map-location:var(--gw-crag-blue,#28617c);
  --map-location-outline:var(--gw-crag-bg,#f6f7f3);
}
main.df-detail [data-df-sector-map] .map-frame {
  position:relative; height:clamp(440px,65svh,650px);
  border:1px solid rgba(var(--gw-crag-neutral-rgb,255,255,255),.14);
  border-radius:16px; overflow:hidden; background:var(--map);
}
@media(max-width:520px) {
  main.df-detail [data-df-sector-map] .map-frame {height:auto; aspect-ratio:1.04/1}
}
main.df-detail [data-df-sector-map] .viewport {width:100%; height:100%; overflow:hidden; touch-action:none; cursor:grab}
main.df-detail [data-df-sector-map] .viewport.is-dragging {cursor:grabbing}
main.df-detail [data-df-sector-map] .viewport:focus-visible {outline:1px solid var(--accent); outline-offset:-3px}
main.df-detail [data-df-sector-map] .viewport>svg {display:block; width:100%; height:100%; overflow:hidden; user-select:none}
main.df-detail [data-df-sector-map] .viewport :is(text,tspan) {font-family:"Avenir Next","PingFang TC","Noto Sans TC",Arial,sans-serif; font-weight:500}
main.df-detail [data-df-sector-map] .viewport #text text {fill:var(--map-ink); font-size:22px}
main.df-detail [data-df-sector-map] .viewport #text .sector-label text {font-size:30px}
main.df-detail [data-df-sector-map] .viewport [data-sector] {cursor:pointer; outline:none}
main.df-detail [data-df-sector-map] .viewport [data-sector]:focus-visible {filter:drop-shadow(0 0 7px var(--accent))}
main.df-detail [data-df-sector-map] .viewport :is(.sector-shape,.sector-ring) {
  fill:transparent!important; stroke:var(--map-outline)!important; stroke-width:3.4px!important; stroke-linejoin:round; pointer-events:all;
}
main.df-detail [data-df-sector-map] .viewport .sector-shape.is-active {fill:var(--map-selection)!important; stroke:var(--accent)!important; stroke-width:4.4px!important}
main.df-detail [data-df-sector-map] .viewport .sector-ring.is-active {fill:var(--accent)!important; stroke:var(--accent)!important}
main.df-detail [data-df-sector-map] .viewport .sector-label.is-active :is(text,tspan) {fill:var(--accent)!important}
main.df-detail [data-df-sector-map] .viewport .sector-label rect {fill:transparent; stroke:none}
main.df-detail [data-df-sector-map] .viewport .sector-number {fill:var(--map-ink); font-size:22px; pointer-events:none}
main.df-detail [data-df-sector-map] .viewport .sector-number.is-active {fill:var(--gw-crag-inverse,#111714)}
main.df-detail [data-df-sector-map] .viewport #gps-live-layer {pointer-events:none}
main.df-detail [data-df-sector-map] .viewport #gps-area {fill:var(--map-location); fill-opacity:.15; stroke:var(--map-location); stroke-opacity:.7; stroke-width:1; vector-effect:non-scaling-stroke}
main.df-detail [data-df-sector-map] .viewport #gps-dot {fill:var(--map-location); stroke:var(--map-location-outline); stroke-width:2.5; vector-effect:non-scaling-stroke}
main.df-detail [data-df-sector-map] .viewport .direction-beam {fill:url(#gps-heading-gradient); stroke:none}
main.df-detail [data-df-sector-map] .viewport .direction-tip {fill:var(--map-location); stroke:var(--map-location-outline); stroke-width:1; stroke-linejoin:round}
html[data-gw-theme="light"] main.df-detail [data-df-sector-map] .viewport #gps-heading-gradient stop {stop-color:var(--map-location)}
html[data-gw-theme="light"] #df-gps-map-art #terrain > rect {fill:var(--map)}
html[data-gw-theme="light"] #df-gps-map-art #terrain > .cls-21 {fill:var(--gw-crag-map-forest-deep,#bac4b5)}
html[data-gw-theme="light"] #df-gps-map-art #terrain > .cls-23 {fill:var(--gw-crag-map-forest,#ccd2c8)}
html[data-gw-theme="light"] #df-gps-map-art #terrain > .cls-3 {fill:#c2cbbc}
html[data-gw-theme="light"] #df-gps-map-art #terrain > path.cls-15 {fill:var(--gw-crag-map-open,#e0e5dc)}
html[data-gw-theme="light"] #df-gps-map-art #river .cls-4 {fill:var(--gw-crag-map-water,#fafbf8)}
html[data-gw-theme="light"] #df-gps-map-art #river .cls-22 {fill:var(--gw-crag-map-shore,#edf0e8)}
html[data-gw-theme="light"] #df-gps-map-art #house .cls-16 {fill:var(--gw-crag-map-building,#adb9aa)}
html[data-gw-theme="light"] #df-gps-map-art #house .cls-2 {fill:#b1bcb1}
html[data-gw-theme="light"] #df-gps-map-art #road path {stroke:var(--gw-crag-map-road,#929c91)}
html[data-gw-theme="light"] #df-gps-map-art #songhe-bridge-deck {stroke:#a5afa5}
html[data-gw-theme="light"] #df-gps-map-art #track .cls-12 {stroke:var(--gw-crag-map-trail,#697564)}
html[data-gw-theme="light"] #df-gps-map-art #icon :is(.cls-5,.cls-24) {fill:var(--gw-crag-map-landmark,#69765f)}
html[data-gw-theme="light"] #df-gps-map-art #icon .cls-15 {fill:var(--gw-crag-map-open,#e0e5dc)}
main.df-detail [data-df-sector-map] button {font:inherit; color:var(--gw-crag-text,#e2e5e3); cursor:pointer}
main.df-detail [data-df-sector-map] button:focus-visible {outline:2px solid var(--accent); outline-offset:3px}
main.df-detail [data-df-sector-map] button:disabled {opacity:.4; cursor:default}
main.df-detail [data-df-sector-map] [hidden] {display:none!important}
main.df-detail [data-df-sector-map] :is(.compass,.zoom-buttons,.icon-button,.map-views button) {
  border:1px solid var(--map-control-border); background:var(--gw-map-control-bg);
  border-radius:13px; color:var(--gw-crag-text,#e2e5e3);
}
main.df-detail [data-df-sector-map] .compass {
  position:absolute; left:14px; top:14px; display:flex; align-items:center;
  flex-direction:column; width:43px; padding:9px 6px 5px; pointer-events:none; line-height:1.4; font-size:13px;
}
main.df-detail [data-df-sector-map] .compass svg {width:22px; height:27px; fill:none; stroke:currentColor; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round}
main.df-detail [data-df-sector-map] .map-tools {position:absolute; top:14px; right:14px; display:grid; gap:10px}
main.df-detail [data-df-sector-map] .zoom-buttons {display:grid; overflow:hidden}
main.df-detail [data-df-sector-map] .zoom-buttons button {width:43px; height:44px; border:0; border-radius:0; background:transparent; font-size:25px; font-weight:300; padding:0}
main.df-detail [data-df-sector-map] .zoom-buttons button+button {border-top:1px solid var(--map-control-border)}
main.df-detail [data-df-sector-map] .icon-button {width:45px; height:45px; display:grid; place-items:center; padding:10px}
main.df-detail [data-df-sector-map] .icon-button svg {width:23px; height:23px; fill:none; stroke:currentColor; stroke-width:1.6; stroke-linecap:round}
main.df-detail [data-df-sector-map] .map-views {position:absolute; bottom:14px; left:14px; display:flex; gap:7px}
main.df-detail [data-df-sector-map] .map-views button {font-size:12px; padding:6px 13px; border-radius:99px; line-height:1.45}
@media(hover:hover) and (pointer:fine) {
  main.df-detail [data-df-sector-map] :is(.zoom-buttons button,.icon-button,.map-views button):enabled:hover {background:var(--gw-map-control-hover-bg)}
}
main.df-detail [data-df-sector-map] .map-tools :is(.icon-button[aria-pressed="true"],button:enabled:active) {
  background:linear-gradient(var(--map-selection),var(--map-selection)),rgba(var(--gw-crag-nav-rgb,27,29,31),.9);
}
main.df-detail [data-df-sector-map] .map-tools .icon-button[aria-pressed="true"] {color:var(--accent); border-color:var(--accent)}
main.df-detail [data-df-sector-map] .location-status {display:flex; align-items:baseline; gap:9px; font-size:12px; color:var(--muted)}
main.df-detail [data-df-sector-map] .location-status p {margin:0}
main.df-detail [data-df-sector-map] .status-dot {width:6px; height:6px; border-radius:50%; background:#8b9390}
main.df-detail [data-df-sector-map] .location-status[data-mode=gps] .status-dot {background:var(--accent)}
main.df-detail [data-df-sector-map] .location-detail {color:var(--muted)}
`,
  markup: `
    <div class="map-frame df-gpx-frame">
      <div class="viewport df-gpx-viewport" tabindex="0" aria-label="可拖曳與雙指縮放的德芙蘭地圖"><svg id="df-gps-map-art" role="img" aria-label="德芙蘭岩場地圖" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1762 1483.85">
  <defs>
    <style>
      #df-gps-map-art .cls-1 {
        fill: #c3decf;
        stroke: #20292a;
        stroke-width: 5px;
      }

      #df-gps-map-art .cls-2 {
        fill: #565f62;
      }

      #df-gps-map-art .cls-3 {
        fill: #22282a;
      }

      #df-gps-map-art .cls-4 {
        fill: #0b0d0e;
      }

      #df-gps-map-art .cls-5 {
        fill: #788286;
      }

      #df-gps-map-art .cls-6 {
        stroke: #596469;
      }

      #df-gps-map-art .cls-6, #df-gps-map-art .cls-7 {
        stroke-width: 18px;
      }

      #df-gps-map-art .cls-6, #df-gps-map-art .cls-7, #df-gps-map-art .cls-8, #df-gps-map-art .cls-9, #df-gps-map-art .cls-10, #df-gps-map-art .cls-11, #df-gps-map-art .cls-12, #df-gps-map-art .cls-13, #df-gps-map-art .cls-14 {
        fill: none;
      }

      #df-gps-map-art .cls-6, #df-gps-map-art .cls-7, #df-gps-map-art .cls-9, #df-gps-map-art .cls-10, #df-gps-map-art .cls-11, #df-gps-map-art .cls-12, #df-gps-map-art .cls-13 {
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      #df-gps-map-art .cls-7, #df-gps-map-art .cls-9 {
        stroke: #576166;
      }

      #df-gps-map-art .cls-8 {
        stroke-width: 2px;
      }

      #df-gps-map-art .cls-8, #df-gps-map-art .cls-14 {
        stroke: #d2d5d6;
        stroke-miterlimit: 2;
      }

      #df-gps-map-art .cls-9 {
        stroke-width: 19px;
      }

      #df-gps-map-art .cls-10 {
        stroke-width: 33px;
      }

      #df-gps-map-art .cls-10, #df-gps-map-art .cls-11, #df-gps-map-art .cls-13 {
        stroke: #788286;
      }

      #df-gps-map-art .cls-11 {
        stroke-width: 20px;
      }

      #df-gps-map-art .cls-12 {
        stroke: #9baaad;
        stroke-dasharray: 10 10;
        stroke-width: 4px;
      }

      #df-gps-map-art .cls-13 {
        stroke-width: 30px;
      }

      #df-gps-map-art .cls-15 {
        fill: #1c2123;
      }

      #df-gps-map-art .cls-16 {
        fill: #343a3d;
      }

      #df-gps-map-art .cls-17 {
        fill: #f3f5f5;
      }

      #df-gps-map-art .cls-17, #df-gps-map-art .cls-18, #df-gps-map-art .cls-19, #df-gps-map-art .cls-20 {
        font-family: PingFangTC-Regular-B5pc-H, 'PingFang TC';
        isolation: isolate;
      }

      #df-gps-map-art .cls-17, #df-gps-map-art .cls-19 {
        font-size: 35px;
      }

      #df-gps-map-art .cls-18 {
        fill: #fff;
        font-size: 30px;
      }

      #df-gps-map-art .cls-14 {
        stroke-width: 3.4px;
      }

      #df-gps-map-art .cls-19, #df-gps-map-art .cls-20 {
        fill: #d2d6d7;
      }

      #df-gps-map-art .cls-21 {
        fill: #242a2c;
      }

      #df-gps-map-art .cls-22 {
        fill: #181b1c;
      }

      #df-gps-map-art .cls-23 {
        fill: #202628;
      }

      #df-gps-map-art .cls-20 {
        font-size: 12px;
      }

      #df-gps-map-art .cls-24 {
        fill: #7e898c;
      }
    </style>
  </defs>
  <g id="bg">
    <g id="terrain">
      <rect class="cls-15" width="1762" height="1483.85"/>
      <path class="cls-21" d="M0,0h1103.76l-153.76,132.85-54,28-35,50-44,19-48,54-63,34-46,43-60,26-53,34-52,19-30,39-96,39-61,1-63,42-63,22-51,53-60,10L0,692.85V0Z"/>
      <path class="cls-23" d="M1762,0v298.85l-130,116-63,16-50-27-65,32-84,62-35,94-73,59-57,27-27,68-88,34-102,37-60,10-93,57-72,15-57,40-49-7,27-52,63-46,69-53,72-21,56-65,113-33,59-75,63-34,48-84,45-82,68-61,69-57,98-32,67-84L1684,0h78Z"/>
      <path class="cls-3" d="M0,767.85l78-44,113,9,70-50,63-29,92,11,77-41,74,14,64,47,89,16-25,62-76,14-68,72-76,51-78-12-85,49-91,6-72,69-72,9L0,1061.85v-294Z"/>
      <path class="cls-15" d="M1762,873.85l-172,123-105,121-105,82-70.75,48-91.79,93-195.27,143h739.81v-610Z"/>
    </g>
  </g>
  <g id="river">
    <g id="river-2" data-name="river">
      <path class="cls-22" d="M420,1483.85c91-70,128-107,193-176,56-63,146-138,229-185,124-70,227-129,326-192,75-50,142-107,216-187,81-88,133-140,213-208,58-49,120-96,165-150v466c-102,84-180,151-235,204-71,66-146,110-216,174-85,75-165,140-259,205l-72,49H420Z"/>
      <path class="cls-4" d="M473,1483.85c79-67,114-119,182-178s121-116,207-166c61-36,150-84,218-135,74-56,171-115,243-184,49-45,96-100,156-158,72-70,124-114,190-170,39-33,72-62,93-86v362c-79,80-173,151-251,234-66,71-149,134-224,190-88,68-131,117-215,172-74,47-112,89-172,119h-427Z"/>
      <path class="cls-22" d="M735,1336.85c27-42,92-82,126-107l63-30,33-29-14,45-23,27-42,40-67,37-47,21-29-4Z"/>
      <path class="cls-22" d="M1051,1253.85c29-58,63-88,120-127l83-56,57-56,79-52,58-37,48-38,51-56,45-25-35,51-35,27-25,40-73,63-45,45-84,73-66,43-61,53-59,38-58,14Z"/>
      <path class="cls-22" d="M1342,883.85c34-45,87-91,133-135l58-49,42-25-16,39-38,40-57,39-58,48-35,31-29,12Z"/>
      <path class="cls-22" d="M1588,733.85c39-55,102-116,174-163v81l-65,27-66,45-43,10Z"/>
    </g>
  </g>
  <g id="track">
    <path class="cls-12" d="M262.12,782.1l50.17,15.51,107.71-9.12,15.43-22.8,30.57,5.17,74.32-48.04c59.09-29.78,89.65-46.11,156.89-77.02,106.92-49.14,159.32-63.11,220.02-98.9,30.06-24.6,71.81-46.15,139.37-80.24,27.03-11.59,44.37-44.17,82.1-69.66,33.45-22.6,111.11-73.47,166.73-98.85,27.99-12.77,18.19,46.07,36.36,36.36,22.59-12.07,16.6-35.75,51.9-18.46,5.9,11.97,9.35,17.62,9.35,17.62"/>
    <path class="cls-12" d="M1419.37,200.9c-5.94,20.6-37.35,38.31-37.35,38.31,0,0-33.61,8.13-46.55,26.1-12.93,17.98-19.34,21.41-11.88,38.68"/>
    <path class="cls-12" d="M973.27,412.39s11.35,55.75,30.46,77.25"/>
    <path class="cls-12" d="M606.7,613.23s35.54,43.42,43.99,54.39"/>
    <polyline class="cls-12" points="888.93 426 861.63 430.4 848.53 418.4 857.23 403.6 859.93 392.7 841.43 388.9 826.13 388.9 826.13 381.2 845.23 371.9 847.93 356.6 832.63 346.2 804.73 341.3"/>
    <polyline class="cls-12" points="1071.28 466.65 1114.01 569.96 1150.22 636.84 1199.04 692.85"/>
  </g>
  <g id="house">
    <g id="buildings">
      <path class="cls-16" d="M228.31,1005.85l176.45-72.99,24.95,38.15-175.77,79.34-25.63-44.5Z"/>
      <path class="cls-16" d="M377.45,1027.81l50.52-28.5,38.03,57.04-47.8,30.27-40.75-58.82Z"/>
      <path class="cls-16" d="M185.41,1104.52l114.67-54.17,28.93,43.67-109.16,64.67-34.44-54.17Z"/>
      <path class="cls-16" d="M178.86,1252.85l131.66-71.67,40.77,55.17-128.63,90.33-43.8-73.83Z"/>
      <path class="cls-16" d="M24.18,1173l55.21-30.22,24.02,50.41-52.81,32.88-26.41-53.07Z"/>
      <path class="cls-16" d="M45.68,1240.99l50.21-31.38,17.2,34.29,28.42,21.76-50.51,49.96-45.32-74.63Z"/>
      <path class="cls-16" d="M162.93,1206.35l38-26,30,46-37,27-31-47Z"/>
      <path class="cls-16" d="M620,977.28l50.79-2.13,2.49,67.82-50.52-2.01-2.76-63.68Z"/>
      <path class="cls-16" d="M848,733.85l33-4,5,35-34,6-4-37Z"/>
      <path class="cls-16" d="M1317,1240.85l22-10,22,34-22,14-22-38Z"/>
      <path class="cls-16" d="M1352,1334.85l40-27,38,47-40,30-38-50Z"/>
      <path class="cls-16" d="M1651,968.85l47-32,31,41-51,34-27-43Z"/>
      <path class="cls-16" d="M1589,1290.85l26-18,27,34-26,17-27-33Z"/>
      <path class="cls-16" d="M1683,1239.85l49-30,30,49-50,27-29-46Z"/>
    </g>
    <polygon class="cls-16" points="107.26 1206.35 138.93 1189.9 153.73 1216.85 120.83 1234.73 109.38 1222.8 107.26 1206.35"/>
    <polygon class="cls-16" points="124.53 1238.02 158.67 1219.51 165.25 1238.02 175.53 1251.59 151.67 1267.22 124.53 1243.36 124.53 1238.02"/>
    <polygon class="cls-16" points="357.24 1413.87 393.73 1389.92 426.04 1441.62 386.13 1465.19 357.24 1413.87"/>
    <polygon class="cls-16" points="351.16 1427.56 366.74 1452.26 299.46 1500.16 284.26 1468.99 351.16 1427.56"/>
    <polygon class="cls-16" points="281.22 1427.56 295.66 1456.44 357.24 1419.95 351.92 1412.73 382.33 1392.58 369.4 1369.4 281.22 1427.56"/>
    <polygon class="cls-16" points="279.14 1431.91 292.18 1456.44 280.25 1467.05 289.32 1486.45 264.03 1486.45 245.11 1454.81 279.14 1431.91"/>
    <polygon class="cls-16" points="325.5 1486.45 373.85 1452.13 384.39 1468.26 342.83 1494.16 325.5 1486.45"/>
    <polygon class="cls-16" points="676.32 990.65 676.32 1050.21 701.85 1103.54 831.19 1016.74 912.32 978.17 941.25 967.96 941.25 945.35 910.05 931.65 838.57 934.85 739.86 986.11 676.32 990.65"/>
    <path class="cls-2" d="M1635.08,198.64l-213.96,153.86c-1.97,1.42-4.71,1.02-6.2-.9l-11.05-14.24c-1.57-2.02-1.14-4.94.94-6.43l213.05-152.81c1.86-1.34,4.43-1.06,5.97.64l11.96,13.2c1.81,1.99,1.48,5.12-.71,6.69Z"/>
  </g>
  <g id="road">
    <path id="songhe-bridge" class="cls-13" d="M626,1177.35c50,63,93,115,136,171l119,156"/>
    <path id="songhe-bridge-deck" class="cls-6" d="M626,1177.35c50,63,93,115,136,171l119,156"/>
    <path id="south-bank-local-road" class="cls-7" d="M1386,1498.85l109.58-65.52-77.58-138.48M1495.58,1433.34l161.42-98.48,115-68"/>
    <path id="west-local-road" class="cls-9" d="M141.98,1490.85c-25-65-71.48-136.09-64.48-208.09"/>
    <path id="trailhead-access-road" class="cls-11" d="M666,1150.85c-14-51-33-97-58-120-26-24-66-13-88-10-31,5-54-13-54-31,1-21,25-24,50-32,54-16,86.6-21.21,121.6-26.21,37-6,73.1,1.35,106.1-8.65,51-15,91.16-60.05,150.16-92.05,57-33,85.14-24.8,125.14-45.8,52-28,133.04-70.29,180.04-92.29,40-20,45.24-53.62,64.24-79.62,24-33,41.14-73.6,70.14-123.6,26.03-44.4,60.12-82.8,97.12-114.8,32-29,181.95-138.2,206.41-158.53l44.99-34.4"/>
    <path id="provincial-highway-8" class="cls-10" d="M95.89,1518.14c111.39-59.9,229.5-143.99,318.5-199.99,96-62,172.61-117.3,251.61-167.3,102-65,195-133,270-160,96-35,166-62,236-102,61-35,120-88,172-143,58-61,111-119,158-163,73-69,139-121,196-174,28-27,50-53,74-81"/>
  </g>
  <g id="text">
    <text class="cls-20" transform="translate(1015.82 594.65)" x="0" y="0" text-anchor="start">山上松亭露營區</text>
    <text class="cls-20" transform="translate(751.73 652.35)" x="0" y="0" text-anchor="start">德芙蘭生態步道</text>
    <text class="cls-20" transform="translate(778.18 406.85)" x="60" y="0" text-anchor="end">人工之字坡</text>
    <text class="cls-20" transform="translate(653.66 1060.51)" x="0" y="0" text-anchor="start">松鶴公車站</text>
    <text class="cls-20" transform="translate(716.58 1192.09)" x="0" y="0" text-anchor="start">松鶴公車站</text>
    <g id="label-parking">
      <text class="cls-20" transform="translate(1459.5 263.71)" x="48" y="0" text-anchor="middle">德芙蘭步道停車場</text>
    </g>
    <text class="cls-19" transform="translate(1103.76 822.65)" x="0" y="0" text-anchor="start">台 8 線 · 中部橫貫公路</text>
    <text class="cls-19" transform="translate(178.86 1346.35)" x="0" y="0" text-anchor="start">台 8 線 · 中部橫貫公路</text>
    <text class="cls-17" transform="translate(808.78 1358.97)" x="0" y="0" text-anchor="start">松鶴橋</text>
    <text class="cls-17" transform="translate(1117.5 1100.4)" x="0" y="0" text-anchor="start">大甲溪</text>
    <g id="label-loftier">
      <text class="cls-18" transform="translate(701.79 207.05)" x="60" y="0" text-anchor="middle">崇高之地</text>
    </g>
    <g id="label-frontier-right">
      <text class="cls-18" transform="translate(1097.81 222.6)" x="0" y="0" text-anchor="start">邊境（右）</text>
    </g>
    <g id="label-frontier-right-2" data-name="label-frontier-right">
      <text class="cls-18" transform="translate(1449.38 125.45)" x="0" y="0" text-anchor="start">青竹東</text>
    </g>
    <g id="label-frontier-left">
      <text class="cls-18" transform="translate(1061.26 440.33)" x="0" y="0" text-anchor="start">邊境（左）</text>
    </g>
    <g id="label-final-frontier">
      <text class="cls-18" transform="translate(747.85 480.65)" x="120" y="0" text-anchor="end">終極邊境</text>
    </g>
    <g id="gps-labels">
      <g id="label-racketeer">
        <text class="cls-18" transform="translate(743.7 554.03)" x="0" y="0" text-anchor="start">金三角</text>
      </g>
    </g>
  </g>
  <g id="crag">
    <g id="visible-rock">
      <path id="loftier-visible-rock-band" data-outline="loftier" class="cls-14" d="M666.23,373.93l41-22,34-35,49-31,36-30,40-19,40-34,11,19-34,33-33,21-41,36-35,14-32,35-35,20-36,37-5-44Z"/>
    </g>
    <circle data-ring="loftier" class="cls-8" cx="761.79" cy="252.6" r="29.94"/>
    <circle data-ring="final-frontier" class="cls-8" cx="912.23" cy="466.65" r="29.94"/>
    <circle data-ring="racketeer" class="cls-8" cx="702.12" cy="543.28" r="29.94"/>
    <circle data-ring="frontier-left" class="cls-8" cx="1019.74" cy="428.1" r="29.94"/>
    <circle data-ring="frontier-right" class="cls-8" cx="1054.65" cy="214.71" r="29.94"/>
    <circle data-ring="orienteer" class="cls-8" cx="1406.22" cy="117.56" r="29.94"/>
    <polygon data-outline="final-frontier" class="cls-14" points="874.63 381.35 872.85 406.94 881 417.93 936.48 409.85 927.42 350.56 874.63 381.35"/>
    <polygon data-outline="frontier-left" class="cls-14" points="933.94 347.5 942.43 406.85 1021 374.19 1007 314.15 933.94 347.5"/>
    <polygon data-outline="frontier-right" class="cls-14" points="1014.39 310.43 1028.07 369.19 1138.69 286.17 1134.36 250.42 1117.5 244.71 1097.81 251.24 1014.39 310.43"/>
    <polygon data-outline="racketeer" class="cls-14" points="466 562.28 530.49 564.58 620 537.43 646.64 526.69 666.23 571.43 608.83 597.76 545.71 613.23 466 607.08 444.28 583.78 466 562.28"/>
    <polygon data-outline="orienteer" class="cls-14" points="1314.73 164.84 1309.65 187.17 1323.74 204.11 1354.97 203.12 1372.32 207.07 1412.12 190.74 1483.01 187.15 1474.18 161.08 1394.96 156.75 1357.58 158.78 1314.73 164.84"/>
  </g>
  <g id="icon">
    <g>
      <rect class="cls-5" x="975.45" y="573.22" width="34" height="34" rx="7" ry="7"/>
      <path class="cls-15" d="M1002.45,600.37h-20c-.4,0-.78-.21-.98-.56-.21-.34-.22-.77-.03-1.13l10-19c.2-.38.59-.61,1.02-.61s.82.24,1.02.61l10,19c.19.36.17.79-.03,1.13-.21.35-.58.56-.98.56ZM997.17,598.07h3.38l-8.09-15.38-8.09,15.38h3.38l3.68-7.36c.19-.39.59-.64,1.03-.64s.83.25,1.03.64l3.68,7.36ZM990.31,598.07h4.28l-2.14-4.28-2.14,4.28Z"/>
    </g>
    <g>
      <path class="cls-24" d="M1516.1,214.71h-19.4c-2.5,0-4.5,2-4.5,4.5v19.4c0,2.5,2,4.5,4.5,4.5h19.4c2.5,0,4.5-2,4.5-4.5v-19.4c0-2.5-2-4.5-4.5-4.5ZM1512,229.71c-1.3,1.2-3.3,1.8-5.5,1.8s-1,0-1.3,0v6.1h-3.8v-16.8c1.2-.2,2.9-.3,5.2-.3s4.1.4,5.2,1.4c1.1.9,1.8,2.3,1.8,3.9s-.6,3.1-1.6,4h0v-.1Z"/>
      <path class="cls-24" d="M1509.8,225.71c0,1.7-1.3,2.8-3.3,2.8s-1,0-1.3,0v-5c.3,0,.8-.2,1.6-.2,1.9,0,3,.9,3,2.5h0v-.1Z"/>
    </g>
    <g>
      <path class="cls-24" d="M672.04,1070.09h23.06c2.14.13,3.56,1.65,3.74,3.78v22.74c-.09,2.09-1.65,3.65-3.74,3.78h-22.74c-2.18-.13-3.65-1.56-3.87-3.74v-22.92c.18-1.96,1.56-3.43,3.56-3.65h0ZM678.59,1095.6c.09-.45-.04-1.07,0-1.51h10.19v1.51c0,.27.58.85.85.89.45.13.85.09,1.25-.18.76-.53.49-1.42.53-2.23,1.07,0,2.09-.58,2.31-1.65v-15.67c-.18-1.47-1.34-2.63-2.76-2.85h-14.42c-1.47.13-2.63,1.34-2.89,2.72v15.53c.09,1.2,1.16,1.96,2.36,1.91-.09,1.16,0,2.67,1.56,2.49.45,0,.98-.53,1.02-.98h0Z"/>
      <path class="cls-24" d="M677.16,1078.28h12.95c1.07,0,1.91.89,2.05,1.96.13,1.11.13,3.61,0,4.76-.04.58-.36,1.02-.98,1.02h-14.91c-.62,0-.98-.36-1.02-.98-.13-.98-.13-4.01,0-4.94s.98-1.74,1.91-1.82h0Z"/>
      <path class="cls-24" d="M689,1090.88c-1.56-1.56,1.07-3.96,2.45-2.09,1.2,1.6-1.07,3.47-2.45,2.09Z"/>
      <path class="cls-24" d="M678.27,1090.92c-.85.76-2.27.4-2.63-.67-.49-1.47,1.07-2.72,2.4-1.87.85.53.93,1.87.18,2.54h.04Z"/>
      <rect class="cls-24" x="679.79" y="1075.34" width="7.79" height="1.02"/>
    </g>
    <g>
      <path class="cls-24" d="M680.64,1170.85h23.06c2.14.13,3.56,1.65,3.74,3.78v22.74c-.09,2.09-1.65,3.65-3.74,3.78h-22.74c-2.18-.13-3.65-1.56-3.87-3.74v-22.92c.18-1.96,1.56-3.43,3.56-3.65h0ZM687.19,1196.36c.09-.45-.04-1.07,0-1.51h10.19v1.51c0,.27.58.85.85.89.45.13.85.09,1.25-.18.76-.53.49-1.42.53-2.23,1.07,0,2.09-.58,2.31-1.65v-15.67c-.18-1.47-1.34-2.63-2.76-2.85h-14.42c-1.47.13-2.63,1.34-2.89,2.72v15.53c.09,1.2,1.16,1.96,2.36,1.91-.09,1.16,0,2.67,1.56,2.49.45,0,.98-.53,1.02-.98h0Z"/>
      <path class="cls-24" d="M685.76,1179.04h12.95c1.07,0,1.91.89,2.05,1.96.13,1.11.13,3.61,0,4.76-.04.58-.36,1.02-.98,1.02h-14.91c-.62,0-.98-.36-1.02-.98-.13-.98-.13-4.01,0-4.94s.98-1.74,1.91-1.82h0Z"/>
      <path class="cls-24" d="M697.6,1191.64c-1.56-1.56,1.07-3.96,2.45-2.09,1.2,1.6-1.07,3.47-2.45,2.09Z"/>
      <path class="cls-24" d="M686.88,1191.69c-.85.76-2.27.4-2.63-.67-.49-1.47,1.07-2.72,2.4-1.87.85.53.93,1.87.18,2.54h.04Z"/>
      <rect class="cls-24" x="688.39" y="1176.11" width="7.79" height="1.02"/>
    </g>
    <path class="cls-5" d="M1389.99,321.64c-.49-1.54-1.7-2.43-3.32-2.6h-21.57c-1.7.24-3,1.62-3.24,3.32,0,7.54-.24,15.17.16,22.63.49,1.3,1.7,2.35,3.08,2.43h21.65c1.87-.16,3.24-1.54,3.41-3.41-.16-7.46.24-15-.16-22.38ZM1382.04,323.59c2.43-.16,2.51,3.65,0,3.65s-2.51-3.57,0-3.65ZM1369.79,323.59c2.27,0,2.51,3.16.49,3.65-2.68.57-3-3.57-.49-3.65ZM1373.85,335.59c-.16.89-1.46.73-1.46-.24v-5.03l-.32.16v11.92c-.32.97-1.95.65-1.95-.24v-7.38h-.32v7.22c0,.41-.57.97-.97.97s-1.05-.49-1.05-.89v-11.84l-.16-.16-.16.16v5.35c0,.57-1.14.73-1.38,0,.16-1.87-.24-4.14,0-5.84.32-2.43,3.24-2.43,5.11-2.27,1.62.16,2.68,1.05,2.84,2.76,0,.97.16,4.46,0,5.27h-.16v.08ZM1376.28,343.13c0,.24-.57.24-.57,0v-19.71c0-.24.57-.16.57,0v19.71ZM1385.77,335.1c-.73-1.46-1.05-3.32-1.7-4.7,0-.16,0-.32-.32-.24l2.35,7.22h-1.7l-.89,5.35c-.24.73-1.14.32-1.14,0v-5.11l-.16-.16-.16.16v5.11c0,.57-.89.73-1.14,0l-.89-5.19h-1.7l2.27-7.14-.24-.16-1.87,5.03-.73.16-.41-.57c.49-1.54,1.05-3.08,1.62-4.62.41-1.05.57-2.27,1.95-2.51.97-.16,3.08-.24,3.73.73l2.35,6.49c-.16.57-.73.73-1.14.32v-.16h-.08Z"/>
    <g>
      <path class="cls-24" d="M1396.33,356.1v22.9c0,1.52-1.16,2.75-2.59,2.75h-23.23c-1.43,0-2.59-1.23-2.59-2.75v-22.9c0-1.52,1.16-2.75,2.59-2.75h23.23c1.43,0,2.59,1.23,2.59,2.75ZM1376.88,356.79c-.4.08-1.24,1.27-1.47,1.63-1.78,2.89-1.44,7.1,1.11,9.46.53.5,1.35.07,1.19-.62-.05-.23-.66-.82-.86-1.09-1.74-2.39-1.57-5.45.23-7.76.19-.24.59-.55.64-.84.08-.5-.34-.88-.84-.78ZM1387.03,356.79c-.49.08-.69.65-.43,1.04.21.31.62.67.87,1.03,1.41,2.06,1.47,4.8.15,6.92-.3.48-.67.79-.97,1.2-.54.75.39,1.46.99.94.35-.3.84-.96,1.09-1.36,1.7-2.68,1.58-6.14-.31-8.7-.3-.41-.84-1.16-1.4-1.08ZM1378.93,358.67c-.28.02-.55.31-.74.52-1.62,1.83-1.6,5.12.26,6.78.7.62,1.58-.17,1.02-.92-.2-.27-.43-.46-.61-.77-.69-1.19-.64-2.72.11-3.87.29-.45.81-.69.65-1.29-.07-.27-.41-.47-.69-.45ZM1385.17,358.67c-.43.05-.66.43-.59.84.04.24.52.68.69.93.85,1.33.75,3-.19,4.26-.13.17-.34.3-.43.5-.34.73.48,1.35,1.11.78,1.85-1.65,1.87-4.89.3-6.73-.21-.25-.54-.61-.89-.57ZM1383.04,364.59c1.34-.53,1.85-2.14,1.11-3.37-.86-1.43-2.93-1.51-3.94-.19-.94,1.23-.42,2.98.98,3.59l-5.2,13c.03.58.71.89,1.17.48.16-.14.18-.41.34-.55l4.61-3.95,4.65,3.95c.16.15.17.41.34.55.47.42,1.16.08,1.17-.53l-5.21-12.98Z"/>
      <polygon class="cls-24" points="1382.15 366.01 1383.86 370.27 1382.12 371.75 1380.35 370.27 1382.05 366.07 1382.15 366.01"/>
      <path class="cls-24" d="M1378.53,374.84l1.33-3.22c.37.38.85.67,1.18,1.07l-2.51,2.14Z"/>
      <polygon class="cls-24" points="1385.69 374.84 1383.18 372.69 1384.36 371.62 1385.69 374.84"/>
    </g>
  </g>
  <g id="point">
    <g id="gps-points">
      <circle id="gps-parking" class="cls-1" cx="1503.56" cy="320.66" r="13"/>
      <circle id="gps-racketeer" class="cls-1" cx="608.83" cy="615.25" r="13"/>
      <circle id="gps-loftier" class="cls-1" cx="791.73" cy="334.5" r="13"/>
      <circle id="gps-final-frontier" class="cls-1" cx="911.18" cy="419.94" r="13"/>
      <circle id="gps-frontier-left" class="cls-1" cx="970.9" cy="399.6" r="13"/>
      <circle id="gps-frontier-right" class="cls-1" cx="1097.81" cy="314.15" r="13"/>
    </g>
  </g>
</svg></div>
      <div class="compass" aria-label="北方朝上"><svg viewBox="0 0 24 28" aria-hidden="true"><path d="M12 24V3M4 11l8-8 8 8"/></svg><span data-zh="北" data-en="N">北</span></div>
      <div class="map-tools">
        <div class="zoom-buttons"><button id="df-gps-zoom-in" aria-label="放大地圖">＋</button><button id="df-gps-zoom-out" aria-label="縮小地圖">−</button></div>
        <button class="icon-button" id="df-gps-gps" aria-label="使用裝置定位" aria-pressed="false" title="使用裝置定位"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/></svg></button>
        <button class="icon-button" id="df-gps-heading-toggle" aria-label="啟用手機方向" aria-pressed="false" title="啟用手機方向"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></svg></button>
      </div>
      <div class="map-views"><button id="df-gps-overview" data-zh="岩區" data-en="Crags">岩區</button><button id="df-gps-full" data-zh="全圖" data-en="Overview">全圖</button><button id="df-gps-recenter" hidden data-zh="回到位置" data-en="My location">回到位置</button></div>
    </div>
    <div class="location-status"><span class="status-dot" aria-hidden="true"></span><p id="df-gps-status" role="status">點選地圖右上角定位按鈕，查看目前位置。</p></div>
    <p class="location-detail" id="df-gps-position-detail"></p>
    <p class="location-detail" id="df-gps-heading-status" aria-live="off"></p>
<input id="df-gps-follow" type="checkbox" checked hidden>`,
  overviewBounds: {x:330, y:62, width:1390, height:600},
  overviewPadding: 30,
  sectorView: {width:560, height:520},
  numberOffset: 8,
  hitPadding: 10,
  getArtwork(svg) {
    const crag = svg.querySelector('#crag');
    const keys = ['final-frontier','frontier-left','frontier-right','loftier','racketeer','orienteer'];
    const sources = keys.map(key => [crag.querySelector('[data-outline="'+key+'"]')]);
    const orderedRings = keys.map(key => crag.querySelector('[data-ring="'+key+'"]'));
    return {crag, sources, orderedRings};
  }
});
