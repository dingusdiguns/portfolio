const THREE = require( "three" )

let Projects = {

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
    description: `The <a href = "https://wildone.com">Wild One</a> website is the product of 2 years of brand-building. Through months of iteration, we (a team of 2) designed the site modularly to house a varying amount of products. We were able to layer in functionality to allow users to parametrically customize products using a custom built 3d visulizer. This effort innevitably resulted in the founder of Wild One receiving a <a href = "https://www.forbes.com/30-under-30/2020/retail-ecommerce/#5ca8157f2fcd">Forbes 30 Under 30 Award</a> for ecommerce.`,
    images: [
      // {
      //   grid: true,
      //   images: [
      //     "/images/wild-one/wild-one-1-higher.png",
      //     "/images/wild-one/wild-one-4-higher.png",
      //     "/images/wild-one/wild-one-2-higher.png",
      //     "/images/wild-one/wild-one-3-higher.png"
      //   ]
      // },
      {
        fullscreen: true,
        src: "/images/wild-one/wild-one-1-higher.png"
      },
      {
        fullscreen: true,
        src: "/images/wild-one/wild-one-5-higher.png"
      },
      {
        fullscreen: true,
        src: "/images/wild-one/wild-one-6-higher.png"
      },
      {
        fullscreen: true,
        src: "/images/wild-one/wild-one-4-higher.png"
      },
      {
        fullscreen: true,
        src: "/images/wild-one/wild-one-2-higher.png"
      },
      {
        fullscreen: true,
        src: "/images/wild-one/wild-one-3-higher.png"
      },
    ],
    roles: [
      "UI Designer",
      "Fullstack Dev"
    ],
    technologies: [
      "Blender",
      "ReactJs",
      "NodeJS",
      "ThreeJS",
      "Shopify",
      "Storefront API",
    ]
  },

  "Scribby": {
    title: "Scribby",
    cover: "/images/scribby.png",
    shortDescription: "generative painting for all",
    textColor: "rgb( 180, 69, 60 )",
    description: 'A painting engine for the web. Allows users to upload a photograph and paint it. Using WebGL and HTML Canvas, it creates a series of simulations that mirror analogue painting techniques including watercolor and acrylic. In order to achieve a convincing paint effect, I had to write a custom WebGL engine as well as about a dozen shaders in GLSL.',
    handle: "scribby",
    linkText: "View Project",
    backgroundColor_rgb: "rgb(180, 69, 120)",
    backgroundColor: new THREE.Color( "rgb(27, 27, 95)" ),
    backgroundColor: new THREE.Color( "rgb(180, 180, 185)" ),
    images: [



      {
        fullscreen: true,
        src: {
          src: "/images/scribby/scribby-hero-video.m4v",
          video: true
        }
      },
      {
        fullscreen: true,
        src: "/images/scribby/scribby-home-hero---somethings.png"
      },
      {
        fullscreen: true,
        src: "/images/scribby/scribby-screen-9.png"
      },
      {
        fullscreen: true,
        src: "/images/scribby/scribby-home-hero---other-thing.png"
      },
      {
        fullscreen: true,
        src: {
          video: true,
          src: "/images/scribby/scribby-pdp-video.m4v"
        }
      }
    ],
    roles: [
      "Founder",
      "UI Designer",
      "Fullstack Dev"
    ],
    technologies: [
      "Blender",
      "ReactJS",
      "WebGL",
      "AWS",
      "Shopify",
      "NodeJS",
    ]
  },


  "Courant": {
    title: "Courant",
    cover: "/images/courant-6.png",
    firstImage: "/images/courant/first-image--catch-3.jpg",
    textColor: "rgb( 50, 50, 120 )",
    shortDescription: "Wireless <strike>Well there is ONE wire, but it doesn't connect to your phone</strike> charging perfected",
    description: `Courant's website has gone through several iterations. It was originally built to serve as a promotional website for a single product, but as the Company's project offering changed, so did the website to fit into a more traditional mould. In it's current state, it is built to offer the client a full range of customizability; this includes: being able to create custom promotions for monogrammed products, on-the-fly discounts for custom product bundles, and a custom built tiered-discount model for the cart. Our efforts were validated in 2019 when both of the cofounders of the company received a <a href = "https://www.forbes.com/30-under-30/2021/consumer-technology/?profile=courant">Forbes 30 Under 30 Award</a> for consumer technology.`,
    handle: "courant",
    linkText: "View Project",
    backgroundColor_rgb: "rgb(180, 180, 180)",
    backgroundColor: new THREE.Color( "rgb(180, 180, 185)" ),
    backgroundColor: new THREE.Color( "rgb(150, 150, 150)" ),
    images: [
      {src:"/images/courant/courant-1-higher.png", fullscreen: true},
      {src:"/images/courant/courant-2-higher.png", fullscreen: true},
      {src:"/images/courant/courant-3-higher.png", fullscreen: true},

    ],
    roles: [
      "Fullstack Dev",
      "UI Designer"
    ],
    technologies: [
      "ReactJS",
      "WebGL",
      "Ruby",
      "Liquid",
      "Storefront API"
    ]

  },




}

Projects["WP"] = {
  title: "W&P Design",
  cover: "/images/wp.jpg",
  handle: "wp",
  firstImage: "/images/wp/wp-cover.jpg",
  textColor: "rgb( 255, 210, 100 )",
  linkText: "View Project",
  shortDescription: "<strike>Wine</strike> Williams & <strike>Puzzles</strike> Prum",
  backgroundColor_rgb: "rgb(80, 0, 0)",
  description: `Courant's website has gone through several iterations. It was originally built to serve as a promotional website for a single product, but as the Company's project offering changed, so did the website to fit into a more traditional mould. In it's current state, it is built to offer the client a full range of customizability; this includes: being able to create custom promotions for monogrammed products, on-the-fly discounts for custom product bundles, and a custom built tiered-discount model for the cart. Our efforts were validated in 2019 when both of the cofounders of the company received a <a href = "https://www.forbes.com/30-under-30/2021/consumer-technology/?profile=courant">Forbes 30 Under 30 Award</a> for consumer technology.`,
  backgroundColor: new THREE.Color( "rgb(255, 180, 80)" ),
  images: [
    {
      fullscreen: true,
      src: "/images/wp/wp-desktop-1.png"
    },
    {
      fullscreen: true,
      src: "/images/wp/wp-desktop-subsurface-2.png"
    },
    {
      fullscreen: true,
      src: "/images/wp/wp-desktop-3.png"
    },
  ],
  roles: [
    "Frontend Dev",
    "UI Designer"
  ],
  technologies: [
    "JQuery",
    "HTML/CSS",
    "Shopify Liquid"
  ],
}

export default Projects
