// Tampa Bay Pink Floyd Concert Locations
var concertLocations = [
  {
    name: "Fort Homer Hesterly Armory",
    address: "522 North Howard Avenue, Tampa, FL 33606",
    wgs84: { lat: 27.948964, lng: -82.483905 },
    date: "1972-04-14",
    tour: "Dark Side of the Moon Tour (1972)",
    concertHighlights:
      'The band performed early, work-in-progress versions of tracks from The Dark Side of the Moon (some under working titles like "The Travel Sequence" for On the Run and "The Mortality Sequence" for The Great Gig in the Sky).',
  },
  {
    name: "Tampa Stadium",
    address: "4201 North Dale Mabry Highway, Tampa, FL 33607",
    wgs84: { lat: 27.977097, lng: -82.502586 },
    date: "1973-06-29",
    tour: "Dark Side of the Moon Tour (1973)",
    concertHighlights:
      "The concert included a sequential performance of the entire The Dark Side of the Moon album, complete with immersive quadraphonic sound and a model airplane crashing into the stage.",
  },
  {
    name: "Tampa Stadium",
    address: "4201 North Dale Mabry Highway, Tampa, FL 33607",
    wgs84: { lat: 27.977097, lng: -82.502586 },
    date: "1977-04-24",
    tour: "In the Flesh Tour (1977)",
    concertHighlights:
      "Pink Floyd played both their Animals and Wish You Were Here albums in their entirety, highlighted by a giant inflatable pig and other farm animals roaming the sky above the crowd against a famously cosmic pink sunset.",
  },
  {
    name: "Tampa Stadium",
    address: "4201 North Dale Mabry Highway, Tampa, FL 33607",
    wgs84: { lat: 27.977097, lng: -82.502586 },
    date: "1987-10-30",
    tour: "A Momentary Lapse of Reason (1987)",
    concertHighlights:
      'Ten years after their previous visit, Pink Floyd delivered an epic, laser-filled set of new material and classic hits, peaking with an unforgettable moment when their legendary inflatable flying pig dramatically exploded over the roaring crowd during "One of These Days".',
  },
  {
    name: "Tampa Stadium",
    address: "4201 North Dale Mabry Highway, Tampa, FL 33607",
    wgs84: { lat: 27.977097, lng: -82.502586 },
    date: "1994-05-06",
    tour: "The Division Bell (1994)",
    concertHighlights:
      'Pink Floyd delivered a sensory masterpiece of immense quadraphonic sound and pulsing lasers, culminating in David Gilmour\'s transcendent, show-stopping guitar solo during "Comfortably Numb".',
  },
];

// Load the locations info into the last paragraph of the locations-info section.
function loadLocationsInfo(locationsInfoPs) {
  var locationsInfoLastP = locationsInfoPs[locationsInfoPs.length - 1];
  if (locationsInfoLastP) {
    locationsInfoLastP.textContent = `Pink Floyd performed ${concertLocations.length} concerts in the Tampa Bay area.`;
  }
}

// Load the locations map and info when the page is loaded.
function locationsLoad() {
  var locationsInfoPs = document.querySelectorAll(".locations-info p");
  if (locationsInfoPs.length === 0) return; // Not in the locations page.

  loadLocationsInfo(locationsInfoPs);
}

// Main page load event listener.
window.addEventListener("load", locationsLoad);
