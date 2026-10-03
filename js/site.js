// Tampa Bay Pink Floyd Concert Locations
var concertLocations = [
  {
    name: "Fort Homer Hesterly Armory",
    address: "522 North Howard Avenue, Tampa, FL 33606",
    wgs84: { lat: 27.948964, lng: -82.483905 },
    date: "04/14/1972",
    tour: "Dark Side of the Moon Tour (1972)",
    concertHighlights:
      'The band performed early, work-in-progress versions of tracks from The Dark Side of the Moon (some under working titles like "The Travel Sequence" for On the Run and "The Mortality Sequence" for The Great Gig in the Sky).',
  },
  {
    name: "Tampa Stadium",
    address: "4201 North Dale Mabry Highway, Tampa, FL 33607",
    wgs84: { lat: 27.977097, lng: -82.502586 },
    date: "06/29/1973",
    tour: "Dark Side of the Moon Tour (1973)",
    concertHighlights:
      "The concert included a sequential performance of the entire The Dark Side of the Moon album, complete with immersive quadraphonic sound and a model airplane crashing into the stage.",
  },
  {
    name: "Tampa Stadium",
    address: "4201 North Dale Mabry Highway, Tampa, FL 33607",
    wgs84: { lat: 27.977097, lng: -82.502586 },
    date: "04/24/1977",
    tour: "In the Flesh Tour (1977)",
    concertHighlights:
      "Pink Floyd played both their Animals and Wish You Were Here albums in their entirety, highlighted by a giant inflatable pig and other farm animals roaming the sky above the crowd against a famously cosmic pink sunset.",
  },
  {
    name: "Tampa Stadium",
    address: "4201 North Dale Mabry Highway, Tampa, FL 33607",
    wgs84: { lat: 27.977097, lng: -82.502586 },
    date: "10/30/1987",
    tour: "A Momentary Lapse of Reason (1987)",
    concertHighlights:
      'Ten years after their previous visit, Pink Floyd delivered an epic, laser-filled set of new material and classic hits, peaking with an unforgettable moment when their legendary inflatable flying pig dramatically exploded over the roaring crowd during "One of These Days".',
  },
  {
    name: "Tampa Stadium",
    address: "4201 North Dale Mabry Highway, Tampa, FL 33607",
    wgs84: { lat: 27.977097, lng: -82.502586 },
    date: "05/06/1994",
    tour: "The Division Bell (1994)",
    concertHighlights:
      'Pink Floyd delivered a sensory masterpiece of immense quadraphonic sound and pulsing lasers, culminating in David Gilmour\'s transcendent, show-stopping guitar solo during "Comfortably Numb".',
  },
];

// Map and marker functions.
function addLocationMarkers(map) {
  var locationGroups = Object.create(null);
  concertLocations.forEach(function (location) {
    var key = location.wgs84.lat + "," + location.wgs84.lng;
    if (!locationGroups[key]) locationGroups[key] = [];
    locationGroups[key].push(location);
  });

  var infoWindow = new google.maps.InfoWindow();
  var expansionZoom = 15;
  var pointSpacingMeters = 100 * 0.9144;
  var groupedMarkers = [];

  map.addListener("click", function () {
    infoWindow.close();
  });

  function showLocationInfo(location, marker) {
    var content = document.createElement("div");
    var title = document.createElement("h3");
    var address = document.createElement("p");
    var date = document.createElement("p");
    var tour = document.createElement("p");
    var concertHighlights = document.createElement("p");

    content.className = "location-info-content";
    title.className = "location-info-title";
    address.className = "location-info-address";
    date.className = "location-info-date";
    tour.className = "location-info-tour";
    concertHighlights.className = "location-info-highlights";

    title.textContent = location.name;
    address.textContent = location.address;
    date.textContent = location.date;
    tour.textContent = location.tour;
    concertHighlights.textContent = location.concertHighlights;

    content.append(title, address, date, tour, concertHighlights);

    infoWindow.setContent(content);
    infoWindow.open({ map: map, anchor: marker });
  }

  Object.keys(locationGroups).forEach(function (key) {
    var group = locationGroups[key];
    var groupMarker = new google.maps.marker.AdvancedMarkerElement({
      position: group[0].wgs84,
      map: map,
      title:
        group.length > 1
          ? group.length + " concerts at " + group[0].name
          : group[0].name,
      content:
        group.length > 1
          ? new google.maps.marker.PinElement({
              glyphText: String(group.length),
            })
          : undefined,
      gmpClickable: true,
    });

    if (group.length === 1) {
      groupMarker.addEventListener("gmp-click", function () {
        showLocationInfo(group[0], groupMarker);
      });
    } else {
      groupMarker.addEventListener("gmp-click", function () {
        infoWindow.close();
        map.setOptions({
          center: group[0].wgs84,
          zoom: expansionZoom,
        });
      });
      groupedMarkers.push({
        group: group,
        groupMarker: groupMarker,
        expandedMarkers: [],
        expanded: false,
      });
    }
  });

  function expandGroup(groupState) {
    var group = groupState.group;
    var radiusMeters =
      pointSpacingMeters / (2 * Math.sin(Math.PI / group.length));
    groupState.groupMarker.map = null;

    group.forEach(function (location, index) {
      var angle = (2 * Math.PI * index) / group.length;
      var latitudeOffset = (radiusMeters / 111320) * Math.sin(angle);
      var longitudeOffset =
        (radiusMeters /
          (111320 * Math.cos((location.wgs84.lat * Math.PI) / 180))) *
        Math.cos(angle);
      var marker = new google.maps.marker.AdvancedMarkerElement({
        position: {
          lat: location.wgs84.lat + latitudeOffset,
          lng: location.wgs84.lng + longitudeOffset,
        },
        map: map,
        title: location.name + " (" + location.date.slice(0, 4) + ")",
        gmpClickable: true,
      });

      marker.addEventListener("gmp-click", function () {
        showLocationInfo(location, marker);
      });
      groupState.expandedMarkers.push(marker);
    });
    groupState.expanded = true;
  }

  function collapseGroup(groupState) {
    groupState.expandedMarkers.forEach(function (marker) {
      marker.map = null;
    });
    groupState.expandedMarkers = [];
    groupState.groupMarker.map = map;
    groupState.expanded = false;
    infoWindow.close();
  }

  function updateGroupsForZoom() {
    var shouldExpand = map.getZoom() >= expansionZoom;
    groupedMarkers.forEach(function (groupState) {
      if (shouldExpand && !groupState.expanded) {
        expandGroup(groupState);
      } else if (!shouldExpand && groupState.expanded) {
        collapseGroup(groupState);
      }
    });
  }

  map.addListener("zoom_changed", updateGroupsForZoom);
  updateGroupsForZoom();
}

function fitLocationBounds(map) {
  var bounds = new google.maps.LatLngBounds();
  concertLocations.forEach(function (location) {
    bounds.extend(location.wgs84);
  });
  map.fitBounds(bounds, 48);
}

// Load the concert info section.
function loadConcertInfo(concertInfo) {
  if (!concertInfo) return;

  var paragraph = document.createElement("p");
  paragraph.textContent = `Pink Floyd performed ${concertLocations.length} concerts in the Tampa Bay area.`;

  var concertList = document.createElement("ul");
  concertLocations.forEach(function (location) {
    var listItem = document.createElement("li");
    listItem.textContent = `${location.tour} at ${location.name} on ${location.date}.`;
    concertList.append(listItem);
  });

  concertInfo.replaceChildren(paragraph, concertList);
}

// Load the Google Map with concert locations.
function loadGoogleMap() {
  var mapElement = document.querySelector(".locations-map #map");
  if (mapElement) {
    var map = new google.maps.Map(mapElement, {
      center: { lat: 27.95, lng: -82.48 },
      zoom: 13,
      mapId: "concert-map",
    });

    addLocationMarkers(map);
    fitLocationBounds(map);
  }
}

// Load the locations map and info when the page is loaded.
function locationsLoad() {
  var concertInfo = document.querySelector("#concert-info");
  if (!concertInfo) return; // Not in the locations page.

  loadConcertInfo(concertInfo);
  loadGoogleMap();
}

// Main page load event listener.
window.addEventListener("load", locationsLoad);
