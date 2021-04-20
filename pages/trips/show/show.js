// pages/trip/show/show.js
Page({
  /**
   * Page initial data
   */
  data: {
    tripStarted: false,
    listView: true,
    scale: 14,
    markers: []
  },

  changeView() {
    this.setData({ listView: !this.data.listView })
  },

  markertap(e) {
    const stopId = e.detail.markerId
    const { stops } = this.data.trip
    const selectedId = stops.findIndex(s=>s.id==stopId)
    const selectedStop = stops[selectedId]
    this.setData({ selectedStop })
  },

  showRoute() {
    const { selectedStop } = this.data
    wx.openLocation({
      latitude: selectedStop.lat,
      longitude: selectedStop.lon,
      name: selectedStop.name, 
      address: selectedStop.address
    })
  },

  startTrip() {
    const that = this
    const { trip } = this.data
    if (trip.active) {
      wx.showModal({
        content: 'Stop your trip?',
        confirmText: 'Confirm',
        cancelText: 'Back',
        success(res) {
          if (res.confirm) {
            that.changeTripStatus()
          }
        }
      })
    } else {
      that.changeTripStatus()
    }
  },

  changeTripStatus() {
    const that = this
    const { trip } = this.data
    const tripData = { active: !trip.active }
    wx.showLoading()
    wx.request({
      url: `${getApp().getHost()}trips/${trip.id}`,
      method: 'PUT',
      data: { trip: tripData },
      success(res) {
        trip.active = res.data.trip.active
        that.setData({ trip })
        wx.hideLoading()
      }
    })
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
    this.getTrip()
    this.getCurrentLocation()
  },

  getCurrentLocation() {
    var that = this
    wx.getLocation({
      type: 'gcj02', 
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    })
  },

  loadMap() {
    const { stops } = this.data.trip
    const markers = stops.map(stop=>{
      return { 
        id: stop.id, 
        latitude: stop.lat - 0.001663048, longitude: stop.lon + 0.004557321, 
        iconPath: '/images/pin.png',
        width: 40,
        height: 40,
        callout: {
          content: stop.name,
          fontSize: 16,
          padding: 16,
          textAlign: 'center',
          display: 'BYCLICK'
        }
      }
    })
    this.setData({ markers })
    console.log(markers)
  },

  getTrip() {
    const that = this
    wx.request({
      url: `${getApp().getHost()}trips/${that.options.id}`,
      success(res) {
        that.setData({ trip: res.data.trip })
        that.loadMap()
      }
    })
  }
})