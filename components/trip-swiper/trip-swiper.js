// components/trip-swiper/trip-swiper.js
Component({
  /**
   * Component properties
   */
  properties: {
    stops: Array
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
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/stops/show/show?id=${id}`,
      })
    },
  }
})
