/** Branch data with OpenStreetMap embeds. */
const map = (lat, lng) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.008}%2C${lng + 0.01}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`;
const directions = (lat, lng) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;

export const BRANCHES = [
  {
    id: 'maadi', name: 'Maadi — Flagship', address: '24 Corniche El Nil, Maadi, Cairo',
    phone: '+20 100 123 4567', lat: 29.9603, lng: 31.2569, hours: '10:00 – 23:00',
    map: map(29.9603, 31.2569), directions: directions(29.9603, 31.2569)
  },
  {
    id: 'zamalek', name: 'Zamalek', address: '12 Shagaret El Dorr, Zamalek, Cairo',
    phone: '+20 100 234 5678', lat: 30.0605, lng: 31.2197, hours: '10:00 – 00:30',
    map: map(30.0605, 31.2197), directions: directions(30.0605, 31.2197)
  },
  {
    id: 'heliopolis', name: 'Heliopolis', address: '9 Baghdad St, Heliopolis, Cairo',
    phone: '+20 100 345 6789', lat: 30.0866, lng: 31.3237, hours: '10:00 – 23:00',
    map: map(30.0866, 31.3237), directions: directions(30.0866, 31.3237)
  },
  {
    id: 'newcairo', name: 'New Cairo — Point 90', address: 'Point 90 Mall, New Cairo',
    phone: '+20 100 456 7890', lat: 30.0198, lng: 31.4913, hours: '11:00 – 00:30',
    map: map(30.0198, 31.4913), directions: directions(30.0198, 31.4913)
  }
];

export const branchById = (id) => BRANCHES.find((b) => b.id === id) || null;
export default BRANCHES;
