const THREE = require( "three" )

module.exports = {

  "Wild One": {
    title: "WILD ONE",
    cover: "/images/wild-one.png",
    textColor: "rgb( 240, 140, 100 )",
    textColor: "rgb(240 200 170)",
    handle: "wild-one",
    linkText: "View Project",
    shortDescription: "a <strike>School</strike> Website for <strike>Ants</strike> Dogs",
    backgroundColor_rgb: "rgb(180, 170, 165)",
    backgroundColor: new THREE.Color( "rgb(180, 170, 165)" ),
    description: "The Wild One website is the product of 2 years of brand-building. Through months of iteration, we (a team of 2) designed the site modularly to house a varying amount of products. We also were able to layer in functionality to allow users to parametrically customize certain products including the ability to customize and view the dog bowl using three.js. This effort innevitably resulted in the founder of Wild One receiving a Forbes 30-under-30 award for ecommerce.",
    images: [
      "/images/wild-one/hero-render.png",
      "/images/wild-one/pdp-hero-render.png",
      "/images/wild-one/pdp-hero-render--mobile.png",
      "/images/wild-one/hero-render.png",
    ],
    roles: [
      "UI Designer",
      "Fullstack Dev"
    ],
    technologies: [
      "ReactJs",
      "NodeJS",
      "ThreeJS",
      "Shopify",
      "Shopify Storefront API"
    ]
  },

  "Courant": {
    title: "Courant",
    cover: "/images/courant-6.png",
    textColor: "rgb( 50, 50, 120 )",
    shortDescription: "Wireless <strike>Well there is ONE wire, but it doesn't connect to your phone</strike> charging perfected",
    handle: "courant",
    linkText: "View Project",
    backgroundColor_rgb: "rgb(180, 180, 180)",
    backgroundColor: new THREE.Color( "rgb(180, 180, 185)" ),
    backgroundColor: new THREE.Color( "rgb(150, 150, 150)" ),
    images: [],
    roles: [
      "Fullstack Dev",
      "UI Designer"
    ],
    technologies: [
      "react",
    ]

  },

  "Scribby": {
    title: "Scribby",
    cover: "/images/scribby.png",
    shortDescription: "generative painting for all",
    textColor: "rgb( 180, 69, 60 )",
    handle: "scribby",
    linkText: "View Project",
    backgroundColor_rgb: "rgb(180, 69, 120)",
    backgroundColor: new THREE.Color( "rgb(27, 27, 95)" ),
    backgroundColor: new THREE.Color( "rgb(180, 180, 185)" ),
    images: [],
    roles: [
      "Fullstack Dev",
      "UI Designer"
    ],
    technologies: [
      "react",
    ]
  },

  "WP": {
    title: "W&P",
    cover: "/images/wp.jpg",
    handle: "wp",
    textColor: "rgb( 255, 210, 100 )",
    linkText: "View Project",
    shortDescription: "<strike>Wine</strike> Williams & <strike>Puzzles</strike> Prum",
    backgroundColor_rgb: "rgb(80, 0, 0)",
    backgroundColor: new THREE.Color( "rgb(255, 180, 80)" ),
    images: [],
    roles: [
      "Fullstack Dev",
      "UI Designer"
    ],
    technologies: [
      "react",
    ],
  },
  "Lamps": {
    title: "Courant",
    cover: "/images/wild-one.png",
    textColor: "rgb( 200, 240, 160 )",
    linkText: "View Project",
    backgroundColor_rgb: "rgb(255, 0, 0)",
    backgroundColor: new THREE.Color( "rgb(255, 0, 0)" ),
    images: [],
    roles: [
      "Fullstack Dev",
      "UI Designer"
    ],
    technologies: [
      "react",
    ]
  }
}
