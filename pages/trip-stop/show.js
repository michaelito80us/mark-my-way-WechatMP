// pages/trip-stop/show.js
const app = getApp()
const url = getApp().getHost() + app.globalData.api
Page({

  /**
   * Page initial data
   */
  data: {
    images: ['https://ak-d.tripcdn.com/images/0105q120008h6vyufDF5C_C_760_506.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/201907_Westgate_Mall_Shanghai.jpg/3584px-Mapcarta.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Shanghai_Natural_History_Museum_%28New%29_01.JPG/2785px-Mapcarta.jpg'],
    latitude: "",
    longitude: "",
    scale: 14,
    markers: [],
    controls: [{
      id: 1,
      iconPath: '/images/locaiton.png',
      position: {
        left: 15,
        top: 260 - 50,
        width: 40,
        height: 40
      },
      clickable: true
    }],
    distanceArr: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this
    let page = this

    //获取当前的地理位置、速度
    wx.getLocation({
      type: 'wgs84', 
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    }),

    
    wx.request({
      url: `${url}trips/stops`,
      method: 'GET',
      success(res){
        console.log(res)
        const stops = res.data.stops;
        page.setData({
          stops: stops
        });
        }
      }
    )

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

  },
})