import mapboxgl from "mapbox-gl";
import { html } from "common-tags";
import { format } from "date-fns";

function formatAddress(address) {
  return `
    <a href="https://maps.google.com/maps?q=${encodeURIComponent(
      address
    )}" target="_blank">
      <address style="white-space: pre-line">${address}</address>
    </a>
  `;
}

function formatPopupText({ name, url, date, address, imageUrl }) {
  const header = url ? `<a href="${url}">${name}</a>` : name;
  return html`
    <div style="display: flex;">
      ${imageUrl &&
      `<img src="${imageUrl}" alt="Event image" style="max-width: 30%;object-fit: cover;margin-right: 1rem;">`}
      <div>
        <h1>${header}</h1>
        ${date && `<span>${format(new Date(date), "P")}</span>`}
        ${formatAddress(address)}
      </div>
    </div>
  `;
}

export function renderMap(opts = {}) {
  const {
    height = "600px",
    width = "800px",
    mapbox: {
      accessToken = null,
      mapStyle = "mapbox://styles/mapbox/light-v10",
    } = {},
    data,
  } = opts;

  const mapNode = document.createElement("div");
  mapNode.style.height = height;
  mapNode.style.width = width;
  document.currentScript.insertAdjacentElement("afterend", mapNode);

  const map = new mapboxgl.Map({
    accessToken,
    container: mapNode,
    style: mapStyle,
    center: [-98, 39],
    zoom: 3.2,
  });

  function createEvent(event) {
    const { lngLat } = event;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      anchor: "bottom-left",
    })
      .setHTML(formatPopupText(event))
      .setMaxWidth("50%");

    const marker = new mapboxgl.Marker()
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map);

    popup.on("open", () => {
      map.flyTo({
        center: lngLat,
        zoom: 10,
        padding: { right: 400 },
      });
    });
  }

  data.forEach(createEvent);
}
