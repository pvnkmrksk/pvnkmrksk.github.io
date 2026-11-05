// Image catalogue: drop images into content/images/<slot>/, then run npm run build.
// The lexically first filename is the lead (use 01-, 02-, etc.); the rest form its gallery.
// These descriptions match the current site. UPDATE caption AND alt when replacing an image.
// caption explains its context; alt describes the visible image for someone who cannot see it.
// Every additional image needs its own `files` entry, e.g.:
// files: { '02-another-view.jpg': { caption: 'Context for this view.', alt: 'What is visible.',
//   credit: 'Photographer · licence', href: 'https://original-or-project.example/' } }
// position is optional CSS object-position, e.g. '50% 35%'. No image is cropped by the preparer.
// Optional credit/href can be set per slot or file. Default credit: Pavan · CC BY-SA 4.0.
export const mediaSlots = {
  intro: {
    caption: 'The ant walks on a ball while I change the woodland around it.',
    alt: 'A tethered ant stands on a black-and-white ball inside screens showing a virtual woodland.',
  },
  research: {
    caption: 'A locust walks on a tracked ball while virtual neighbors move around it. I use scenes like this to study how insects move together.',
    alt: 'A tethered locust walks on a patterned ball inside LED panels showing a moving group of virtual locusts.',
    credit: 'Pavan · CC BY-SA 4.0',
    href: 'https://ssrn.com/abstract=7398343',
  },
  phd: {
    caption: 'In MultiMoVR, I combined virtual scenery, wind and odour to ask how flies find a target. Here, the landscape moves around a tethered fly.',
    alt: 'A tethered fly beats its wings between airflow tubes as an apple-tree landscape moves across the surrounding screens.',
    href: 'https://doi.org/10.1073/pnas.1912124117',
  },
  matrex: {
    caption: 'Taking notes beside MATREX, with the experiment running under a field canopy.',
    alt: 'Pavan taking notes beside a portable MATREX virtual-reality rig under a field canopy.',
    href: 'https://github.com/pvnkmrksk/matrexVR',
  },
  industry: {
    caption: 'Essensari’s wood-finish prototype operating. The app paired the device with an odour-identification task.',
    alt: 'Wood-finish Essensari device with four front openings, with visible plumes rising above it.',
    credit: 'Essensari / Timestamp India · Company website and brochure',
    href: 'https://pvnkmrksk.wixsite.com/essensari',
  },
  teaching: {
    "caption": "Inside a simulated marching herd. A recorded example from Classroom Agents.",
    "alt": "A first-person view among orange, low-poly foxes moving through a grassy field.",
    "credit": "Pavan / Classroom Agents",
    "href": "https://pvnkmrksk.github.io/classroom-agents/"
  },
  press: {
    caption: 'An ant on a tracked ball, surrounded by a virtual woodland.',
    alt: 'A tethered ant stands on a black-and-white ball inside screens showing a virtual woodland.',
  },
  contact: {
    caption: 'I took the insect VR setup to KULA for Umwelt, an evening of art, science and music in Konstanz in 2023.',
    alt: 'An insect VR rig and tracking monitor overlook a purple-lit room with visitors below.',
  },
  'events-2016': {
    caption: 'At NCBS Open Day in 2016, the virtual landscape was projected so visitors could follow the experiment.',
    alt: 'Visitors gather around two monitors while a large projection shows a virtual sky and grassy landscape.',
  },
  'events-2018': {
    caption: 'At NCBS Moth Day in 2018, visitors could try an odour-sampling setup alongside the insect demonstrations.',
    alt: 'A visitor leans toward clear tubes connected to small bottles at an outdoor odour station.',
  },
  'events-2019': {
    caption: 'The exhibition catalogue for FOOD: Bigger than the Plate, at the V&A in 2019. Non Flower for a Hoverfly is credited to Thomas Pausz and Shannon Olsson.',
    alt: 'An open exhibition catalogue shows Non Flower for a Hoverfly, with photographs of flower-like models and an insect in a virtual scene.',
    credit: 'Photo: Pavan · CC BY-SA 4.0. Work pictured: Thomas Pausz and Shannon Olsson; NICE Lab and Srishti collaboration.',
  },
  'events-2023': {
    caption: 'I took the insect VR setup to KULA for Umwelt, an evening of art, science and music in Konstanz in 2023.',
    alt: 'An insect VR rig and tracking monitor overlook a purple-lit room with visitors below.',
  },
  'events-2025': {
    caption: 'I took the rig to Munich’s Long Night of Museums in 2025. Visitors could turn the ball and watch the virtual scene respond.',
    alt: 'Visitors watch a laptop showing a virtual world beside an LED-panel rig; a panel behind it describes locust swarms.',
  },
  'civic-relief': {
    caption: 'Map of volunteers · Chintan Sheth and Pavan',
    alt: 'A 2020 map of Relief Riders volunteers across Bengaluru wards.',
    credit: 'Chintan Sheth and Pavan',
    href: 'https://citizenmatters.in/bengaluru-relief-riders-cyclists-home-delivery-essentials-medicines-to-senior-citizens/',
  },
  'civic-magga': {
    caption: 'BMTC spider-map detail around BEL Circle and Gokula',
    alt: 'Labeled BMTC route junction at BEL Circle, with the route bundle continuing to Gokula.',
    credit: 'Pavan, built on LOOM',
    href: 'https://github.com/pvnkmrksk/magga',
  },
  'civic-rala': {
    caption: 'Looking for Kannada words related to “curiosity”.',
    alt: 'Rala showing the English query curiosity and matching Kannada words.',
    credit: 'Pavan / Rala; dictionary sources Alar and Padakanaja',
    href: 'https://rala.kutuhula.in/',
  },
  'tool-rekkefly': {
    caption: 'Rekkefly follows a tethered Bogong moth’s wings as it flies.',
    alt: 'A close tracking view of a tethered Bogong moth with coloured wing sectors and measurements.',
    credit: 'Pavan / Rekkefly',
    href: 'https://pvnkmrksk.github.io/rekkefly/',
  },
  'tool-hejjetrac': {
    caption: 'Testing ball tracking on a supplied FicTrac recording.',
    alt: 'A close view of a patterned treadmill ball with cyan tracking points and motion outlines.',
    credit: 'Pavan / HejjéTrac; video uses supplied FicTrac sample',
    href: 'https://pvnkmrksk.github.io/hejjetrak/',
  },
  'tool-matrex': {
    caption: 'Choosing an experiment and virtual world in MATREX.',
    alt: 'The MATREX desktop interface for choosing walking or flying experiments and a virtual environment.',
    credit: 'MATREX VR / Pavan',
    href: 'https://pvnkmrksk.github.io/matrexVR/',
  },
  'tool-rala': {
    caption: 'Looking for Kannada words related to “curiosity”.',
    alt: 'Rala showing the English query curiosity and matching Kannada words.',
    credit: 'Pavan / Rala; dictionary sources Alar and Padakanaja',
    href: 'https://rala.kutuhula.in/',
  },
  'tool-chukke': {
    caption: 'Colour-tag combinations',
    alt: 'A four-quadrant Chukké identification tag cycling through colour combinations.',
    credit: 'Chukké / Pavan',
    href: 'https://chukke.kutuhula.in/',
  },
  'tool-kadaru': {
    caption: 'Original, block and column scrambling',
    alt: 'An original image and its block-scrambled and column-scrambled outputs.',
    credit: 'Kadaru / Pavan',
    href: 'https://pvnkmrksk.github.io/Kadaru/',
  },
  'tool-sensor': {
    caption: 'My flexure CAD design',
    alt: 'Four variants of my configurable force-sensor flexure in the CAD design.',
    credit: 'Pavan · Flexure CAD',
    href: 'https://cad.onshape.com/documents/3e860df39a3a0136b6650a0b/w/78ad68392459b8d68de64f2d/e/6d504a39dfdeb2eaddb9b7d0',
  },
  'tool-dwandwa': {
    caption: 'A sculpture with two readings',
    alt: 'A generated dual-word sculpture viewed from an oblique angle.',
    credit: 'Pavan / Dwandwa · live tool capture',
    href: 'https://dwandwa.kutuhula.in/',
  },
  'tool-aruco': {
    caption: 'Generated marker patterns',
    alt: 'A close-up of generated ArUco markers; the full sheet is available in the enlarged view.',
    credit: 'Pavan / ArUco Marker Generator',
    href: 'https://pvnkmrksk.github.io/aruco-laser-cutter-generator/',
  },
  "civic-yeshtothu": {
    "caption": "Comparing the wait, the ride and the time of day for a journey across Bengaluru.",
    "alt": "Yeshtothu shows a Hebbala Bridge to Tin Factory journey, with waiting and riding time, a daily variation chart and the route on a Bengaluru map.",
    "credit": "Pavan / Yeshtothu · Transit data: BengaWalk and Vonter · Map: © CARTO, © OpenStreetMap contributors",
    "href": "https://pvnkmrksk.github.io/yeshtothu/"
  },
  "tool-classroom-agents": {
    "caption": "Inside a simulated marching herd. A recorded example from Classroom Agents.",
    "alt": "A first-person view among orange, low-poly foxes moving through a grassy field.",
    "credit": "Pavan / Classroom Agents",
    "href": "https://pvnkmrksk.github.io/classroom-agents/"
  },
};
