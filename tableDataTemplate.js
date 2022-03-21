const generator = [
  '{{repeat(200)}}',
  {
    id: '{{objectId()}}',
    lostInterest: '{{integer(0, 99)}}',
    position: '{{integer(0, 100)}}',
    positionDynamics: '{{integer(-4, 5)}}',
    photo: 'photo.jpg',
    sku: '{{integer(1000, 9999999)}}',
    sparklines: [
      '{{repeat(30)}}', '{{integer(80, 300)}}'
    ],
    product: '{{lorem(3, "words")}}',
    brand: function() {
      var items = ['Gudci', 'H&N', 'Zapa', 'Push&Beer', 'Supreame']
      return items[Math.floor(Math.random()*items.length)]
    },
    seller: function() {
      var items = ['Geekmosis', 'Dognost', 'Xumonk', 'Apextri', 'Waterbaby', 'Neurocell']
      return items[Math.floor(Math.random()*items.length)]
    },
    group: 'Патчи',
    remains: '{{integer(0, 1000)}}',
    reviews: '{{integer(0, 1200)}}',
    rating: '{{floating(0, 100, 2)}}',
    price: '{{floating(500, 40000, 2)}}',
  }
]
