const normalCallout = {
  id: 1,
  latitude: 23.098994,
  longitude: 113.322520,
  iconPath: '/images/pin.png',
  width: 40,
  height: 40
}

const customCallout1 = {
  id: 2,
  latitude: 23.097994,
  longitude: 113.323520,
  iconPath: '/images/pin.png',
  width: 40,
  height: 40
}

const customCallout3 = {
  id: 3,
  latitude: 23.095994,
  longitude: 113.325520,
  iconPath: '/images/pin.png',
  width: 40,
  height: 40
}

const allMarkers = [normalCallout, customCallout1, customCallout3]

// pages/trip/show/show.js
Page({
  /**
   * Page initial data
   */
  data: {
    latitude: 23.096994,
    longitude: 113.324520,
    scale: 14,
    markers: allMarkers
  },

  go() {
    wx.navigateTo({
      url: '/pages/trip-stop/show',
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this
    //获取当前的地理位置、速度
    // wx.getLocation({
    //   type: 'wgs84', 
    //   success: function (res) {
    //     that.setData({
    //       latitude: res.latitude,
    //       longitude: res.longitude,
 
    //     })
    //   }
    // })


  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})