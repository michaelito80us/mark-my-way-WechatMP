// pages/trip/show/show.js
Page({
  /**
   * Page initial data
   */
  data: {
    tripStarted: false,
    listView: true,
    scale: 14,
    markers: [],
    
  },

  goBack(){
    wx.navigateTo({
      url: '/pages/trips/create/create',
    })
  },

  changeView() {
    this.setData({ listView: !this.data.listView })
  },

  markertap(e) {
    console.log(e)
    const stopId = e.detail.markerId
    const { stops } = this.data.trip
    const selectedId = stops.findIndex(s=>s.id==stopId)
    const selectedStop = stops[selectedId]
    this.setData({
      current: selectedId, 
      selectedStop 
    })
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
        content: 'End your trip?',
        confirmText: 'Confirm',
        cancelText: 'Back',
        success(res) {
          if (res.confirm) {
            that.changeTripStatus()
            wx.redirectTo({
              url: '/pages/trips/create/create',
            })
          }
        }
      })
    } else {

      that.changeTripStatus()
      that.setData({
        listView: false
      })

    }
  },

  changeTripStatus() {
    const that = this
    const { trip } = this.data
    
    const tripData = { active: !trip.active }
    trip.active = !trip.active
    // wx.showLoading()
    wx.request({
      url: `${getApp().getHost()}trips/${trip.id}`,
      method: 'PUT',
      data: { trip: tripData },
      success(res) {
        that.setData({
          ['trip']: trip
        })
        // console.log(res)
        // trip.active = res.data.trip.active
        // that.setData({ trip })
        // wx.hideLoading()

      }
    })
  },

  go() {
    const that = this
    that.startTrip()
    wx.navigateTo({
      url: '/pages/trip-stop/show',
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getTrip()
  },

  getCurrentLocation() {
    console.log('getcurrentLocation')
    var that = this
    wx.getLocation({
      type: 'gcj02', 
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        that.loadMap();
      }
    })
  },

  loadMap() {
    console.log('skksksk', this.data)
    const stops = this.data.trip.stops
    console.log(this.data.trip)
    const markers = stops.map(stop=>{
      let category = stop.category.toLowerCase().split(' ').join('');
      return { 
        id: stop.id, 
        latitude: stop.lat - 0.001663048, longitude: stop.lon + 0.004557321, 
        iconPath: `/images/${category}.png`,
        width: 30,
        height: 48,
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
    this.includePoints();
  },

  includePoints(){
    let that = this
    var mapCtx = wx.createMapContext("map");
    let includePointsData = []
    const curLocation = {
      latitude: this.data.latitude,
      longitude: this.data.longitude
    }
    includePointsData.push(curLocation)
    
    let {stops} = that.data.trip
    for (let i = 0; i < stops.length; i++) {
      includePointsData.push({
        latitude: stops[i].lat,
        longitude: stops[i].lon
      })
    }
    console.log('include points data',includePointsData)
    mapCtx.includePoints({
      padding: [ 100, 80, 100, 80],
      points: includePointsData
    })
  },

  getTrip: function() {
    console.log('gettrip')
    const that = this
    wx.request({
      url: `${getApp().getHost()}trips/${that.options.id}`,
      success(res) {
        console.log('trip res', res)
        that.setData({ trip: res.data.trip })
        that.getCurrentLocation();
      },
      complete(err) {
        return err
      }
    })
  }
})