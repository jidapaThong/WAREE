import L from 'leaflet';
import greenIcon from '../icons/cctvIcon1.png';
import redIcon from '../icons/cctvIcon2.png';
// import greenStatusIcon from "./icons/greenStatus.png";
// import redStatusIcon from "./icons/redStatus.png";
// import yellowStatusIcon from "./icons/yellowStatus.png";
// import blueIcon from "./blue_pin.png";

// import waterIcon from "../icons/water.png";

const activeIcon = L.icon({
    iconUrl: greenIcon,
    iconSize: [40, 40],
});

// const inactiveIcon = L.icon({
//     iconUrl: redIcon,
//     iconSize: [26, 39],
// });

const selectedIcon = L.icon({
    iconUrl: redIcon,
    iconSize: [50, 50],
})

// const waIcon = L.icon({
//     iconUrl: waterIcon,
//     iconSize: [26, 39],
// });

// const greenStatusIcon = {
//     iconUrl: greenStatus,
//     iconSize: [50, 50]
//     //iconAnchor: [25, 50], // You can adjust the anchor point if needed
// };

// const redStatusIcon = {
//     iconUrl: redStatus,
//     iconSize: [50, 50]
// };

// const yellowStatusIcon  = {
//     iconUrl: yellowStatus,
//     iconSize: [50, 50]
// };

// export {activeIcon, inactiveIcon, selectedIcon}
export {activeIcon, selectedIcon}