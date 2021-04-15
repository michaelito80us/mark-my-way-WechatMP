var QQMapWX = require('../../../libs/qqmap-wx-jssdk');
var qqmapsdk;

Page({
  /**
   * Page initial data
   */
  data: {
    selectedLocation: {}
  },


  goToTripStopList() {
    wx.navigateTo({
      url: '/pages/trips/show/show',
    })
  },

  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'XIGBZ-ZCP6F-NINJP-JYWMZ-5EBR5-NYBBD'
    });
    this.getLocation()
  },

  regionChange(e) {
    const { causedBy, type } = e.detail
    if (causedBy == 'drag' && type == 'end' ) {
      this.reverseGeocode()
    }
  },

  reverseGeocode() {
    const that = this
    this.mapCtx = wx.createMapContext('map')
    this.mapCtx.getCenterLocation({
      type: 'gcj02',
      success(res) {
        const { latitude, longitude } = res
        const selectedLocation = { latitude, longitude }
        qqmapsdk.reverseGeocoder({
          location: { latitude, longitude },
          success(res) {
            that.setData({ addressDetails: res.result.address })
          }
        })
        that.setData({ selectedLocation })
      }
    })
  },

  getLocation(){
    const that = this
    wx.getLocation({
      success: function (res) {
        console.log(res)
        const { latitude, longitude } = res
        const map = { latitude, longitude }

        qqmapsdk.reverseGeocoder({
          location: { latitude, longitude },
          success(res) {
            that.setData({ addressDetails: res.result.address })
          }
        })

        wx.createMapContext('map').moveToLocation({
          latitude, longitude
        })
        
        that.setData({ map })
      }
    })
  },

  getMapCenter() {
    var mapCtx = wx.createMapContext("map")
    console.log(mapCtx)
    mapCtx.getCenterLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.getLocal(latitude, longitude)
      }
    }) 
  },

  bindcontroltap(e) {
    var that = this;
    if (e.controlId == 1) {
      that.setData({
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        scale: 14,
      })
    }
    
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function(e) {
  //  this.mapCtx = wx.createMapContext('map')
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

  },

  goToTripStopList() {
    wx.redirectTo({
      url: '/pages/trips/show/show',
    })
  }
})