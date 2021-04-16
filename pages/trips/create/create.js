var QQMapWX = require('../../../libs/qqmap-wx-jssdk');
var qqmapsdk;

Page({
  data: {
    selectedLocation: {},
    hours: [0,1,2,3,4,5,6,7,8,9,10],
    minutes: [0,15,30,45]
  },

  changePicker(e) {
    const [hoursIndex, minutesIndex] = e.detail.value
    const hours = this.data.hours[hoursIndex]
    const minutes = this.data.minutes[minutesIndex]
    const duration = hours * 60 + minutes
    this.setData({ duration })
  },

  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },

  goToTripStopList() {
    const { latitude, longitude } = this.data.selectedLocation
    const { duration } = this.data
    const url = getApp().getHost()+'trips'
    const trip = { 
      duration: duration, 
      start_lat: latitude, 
      start_lon: longitude, 
      user_id: getApp().globalData.userId 
    }
    wx.request({
      url, method: 'POST', data: { trip },
      success(res){
        console.log("am I gonna walk?", res)
        if(res.statusCode === 200) {
          wx.navigateTo({
            url: `/pages/trips/show/show?id=${res.data.trip_id}`,
          })
        }
      }
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
        const { latitude, longitude } = res
        const selectedLocation = { latitude, longitude }

        qqmapsdk.reverseGeocoder({
          location: { latitude, longitude },
          success(res) {
            that.setData({ addressDetails: res.result.address })
          }
        })

        wx.createMapContext('map').moveToLocation({
          latitude, longitude
        })
        that.setData({ selectedLocation })        
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

})