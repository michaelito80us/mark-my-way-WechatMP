// components/trip-swiper/trip-swiper.js
Component({
  /**
   * Component properties
   */
  properties: {
    stops: Array,
    current: Number
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    goToStopDetail(e) {
      console.log(e)
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/stops/show/show?id=${id}`,
      })
    },
    showRoute(e) {
      const {stop} = e.currentTarget.dataset
      wx.openLocation({
        latitude: stop.lat,
        longitude: stop.lon,
        name: stop.name, 
        address: stop.address
      })
    },
  },

 
})
