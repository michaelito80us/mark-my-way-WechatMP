var QQMapWX = require('../../../libs/qqmap-wx-jssdk');
var qqmapsdk;

Page({
  data: {
    selectedLocation: {},
    hours: '2 hours',
    minutes: '30 mins',
    hours: ['0 hours','1 hour','2 hours','3 hours','4 hours','5 hours','6 hours','7 hours','8 hours','9 hours','10 hours'],
    minutes: ['0 mins','15 mins','30 mins','45 mins'],
    tags: [{name: 'Park', selected: false }, {name: 'Architecture', selected: false }, {name: 'Shopping', selected: false },{name: 'Historical Site', selected: false },{name: 'Entertainment', selected: false },{name: 'BS', selected: false},{name: 'Theatre', selected: false },{name: 'Art Galleries', selected: false }, {name: 'Museum', selected: false }],
    showPopUp: false,
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
    const { latitude } = this.data
    const { longitude } = this.data
    const { duration } = this.data
    const url = getApp().getHost()+'trips'
    const trip = { 
      duration: duration, 
      start_lat: latitude, 
      start_lon: longitude, 
      user_id: getApp().globalData.userId 
    }
    const categories = this.data.tagsArray || []

    console.log(trip, categories)
    wx.request({
      url, method: 'POST', data: { trip, categories},
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
    console.log('GET LOCATION')
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
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
      
      
        // wx.createMapContext('map').moveToLocation({
        //   latitude, longitude
        // })
        // that.setData({ selectedLocation })        
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
    const that = this;
    wx.createMapContext('map').moveToLocation();
    this.getLocation();
  },

  tagSelected(e) {
    const tagIndex = e.currentTarget.dataset.index
    const tags = this.data.tags
    tags[tagIndex].selected = !tags[tagIndex].selected
    this.setData({tags})

    let tagsArray =[]
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].selected){
        tagsArray.push(tags[i].name)
      }
    }
    this.setData({tagsArray})
  },

  tagPopUp() {
    const showPopUp = this.data.showPopUp;
    this.setData({showPopUp:!showPopUp})
  }

})
