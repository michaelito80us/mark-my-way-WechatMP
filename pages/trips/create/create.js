var QQMapWX = require('../../../libs/qqmap-wx-jssdk');
var qqmapsdk;

Page({
  data: {
    selectedLocation: {},
    hours: '2 hours',
    minutes: '30 mins',
    hours: ['0 hour','1 hour','2 hours','3 hours','4 hours','5 hours','6 hours','7 hours','8 hours','9 hours','10 hours'],
    minutes: ['0 min','15 mins','30 mins','45 mins','60 mins']
  },

  changePicker(e) {
    const [hoursIndex, minutesIndex] = e.detail.value
    const hours = this.data.hours[hoursIndex]
    const hourInt = parseInt(hours.split(' ')[0])
    console.log('hour',hourInt)
    const minutes = this.data.minutes[minutesIndex]
    const minInt = parseInt(minutes.split(' ')[0])
    console.log('min',minInt)
    const duration = hourInt * 60 + minInt
    this.setData({ 
      hour: this.data.hours[hoursIndex],
      min: this.data.minutes[minutesIndex],
      duration 
    })
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
        else if (res.statusCode === 500) {
          wx.showModal({
            title: 'No trips available',
            content: 'Your location is out of service scope now',
            showCancel: false,
            // cancelText: 'Cancel',
            confirmText: 'Re-plan',
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
    if (e.causedBy == 'drag' && e.type == 'end' ) {
      this.reverseGeocoder();
    }
  },

  reverseGeocoder() {
    console.log('reverse geo')
    const that = this
    this.mapCtx = wx.createMapContext('map')
    this.mapCtx.getCenterLocation({
      type: 'gcj02',
      success(res) {
        const { latitude, longitude } = res
        console.log('latitude', latitude)
        console.log('longitude', longitude)
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
      type: 'gcj02',
      success: function (res) {
        const { latitude, longitude } = res
        console.log('this location here',res)
        // const selectedLocation = { latitude, longitude }
        that.setData({
          latitude: latitude,
          longitude: longitude
        })

        qqmapsdk.reverseGeocoder({
          location: { latitude, longitude },
          success(res) {
            that.setData({ addressDetails: res.result.address })
          }
        })

    //     wx.createMapContext('map').moveToLocation({
    //       latitude, longitude
    //     })
    //     that.setData({ selectedLocation })        
    //   }
    // })
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
    const that = this;
    wx.createMapContext('map').moveToLocation();
    this.getLocation();
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

  }
    })}})
