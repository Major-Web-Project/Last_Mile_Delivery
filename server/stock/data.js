const coordinates = [
  {
    geometry: {
      type: "Point",
      coordinates: [73.21668395742037, 22.25700591168219],
    },
    address: "3, Desai Colony, Tarsali, Vadodara, Gujarat 390009",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.22562220838351, 22.248142453217334],
    },
    address: "Adarsh Nagar, Tarsali, Vadodara, Gujarat 390009",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.20194447796348, 22.260439181776405],
    },
    address: "7652+XX8, Tarsali, Vadodara, Gujarat 390009",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.19869806249785, 22.26167630895328],
    },
    address: "1755, GIDC Industrial Area, Manjalpur, Vadodara, Gujarat 390009",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.21405559048209, 22.258611479463713],
    },
    address: "7657+9HP, Sharad Nagar, Tarsali, Vadodara, Gujarat 390009",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.2207363048923, 22.26063810760741],
    },
    address: "Vijay Nagar, Tarsali, Vadodara, Gujarat 390009",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.21020433657411, 22.250478870306512],
    },
    address:
      "D32, Motinagar-3, Ayodhya Twp, Makarpura, Vadodara, Gujarat 390014",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.17882017844302, 22.308828243504916],
    },
    address:
      "855H+FFH, Alkapuri Rd, near Agarwal Guest, Dilaram Comound, Jetalpur, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.17940362904065, 22.31262014682947],
    },
    address: "Arunoday Society, Alkapuri, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.18166226428671, 22.30937325208975],
    },
    address: "460, Sarod, Sayajiganj, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.18392290332416, 22.308611406339324],
    },
    address: "Pawan Park Society, Sarod, Sayajiganj, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.18247153563041, 22.312495182159747],
    },
    address:
      "GSRTC ST Depot, Maharaja Sayajirao University, Pratapgunj, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.17785212864305, 22.31116691410572],
    },
    address: "Alkapuri, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.17679091355515, 22.307875064909823],
    },
    address:
      "102, Shree Niketan Society Road, Sampatrao Colony, Jetalpur, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.1742783307735, 22.31194655123265],
    },
    address: "27, Aradhana Society, Alkapuri, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.17764924928801, 22.31223530461931],
    },
    address: "H Block, E-12 Block, Alkapuri, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.17460605896241, 22.31048833750733],
    },
    address: "98/3, BPC Rd, Jetalpur, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.17961561842147, 22.308799100588665],
    },
    address:
      "Navlakha Coumpound, B/h Railway Station, Nr Bansal Hotel, Akota, Vadodara, Gujarat",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.18135265310956, 22.31786408356929],
    },
    address: "Aurobindo Ghosh Rd, Pratapgunj, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.18376626452225, 22.315395087947294],
    },
    address:
      "43 New, Vikram Baug Colony, Maharaja Sayajirao University, Pratapgunj, Vadodara, Gujarat 390002",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.18315378149572, 22.31530867600918],
    },
    address:
      "Dak bhavan, G/f, opp. pavanveer complex, Vikram Baug Colony, Maharaja Sayajirao University, Pratapgunj, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.18559924281323, 22.31754583779496],
    },
    address: "859P+364, Pratapgunj, Vadodara, Gujarat 390007",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.17524797923102, 22.315922406937243],
    },
    address: "Kunj Society, Alkapuri, Vadodara, Gujarat 390023",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.18168034357399, 22.32266980162337],
    },
    address: "Officers Railway Colony, Pratapgunj, Vadodara, Gujarat 390002",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.17870206075537, 22.32382308986264],
    },
    address:
      "85FH+GFQ, Shastri Brg, Sardar Nagar, Alkapuri, Vadodara, Gujarat 390002",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.19051837226864, 22.322849535921303],
    },
    address:
      "18, near Jayesh Colony, Deepak Nagar, Jayesh Colony, Fatehgunj, Vadodara, Gujarat 390002",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.1894884040192, 22.326998040167666],
    },
    address:
      "Sai Vihar, Tyabji Rd, opp. The Emperor Building, Fatehgunj, Vadodara, Gujarat 390002",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.19262122411128, 22.32808973131019],
    },
    address: "B 301, Lourdes Apt, EME Rd, Fatehgunj, Vadodara, Gujarat 390002",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.19017504951884, 22.32582694380868],
    },
    address: "A-1, Fatehgunj, Vadodara, Gujarat 390002",
  },
  {
    geometry: {
      type: "Point",
      coordinates: [73.18686926785664, 22.32480583222319],
    },
    address: "85FP+QH6, Fatehgunj, Vadodara, Gujarat 390002",
  },
];

export default coordinates;
