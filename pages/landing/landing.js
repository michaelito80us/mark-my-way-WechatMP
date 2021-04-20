// pages/landing/landing.js
Page({

  /**
   * Page initial data
   */
  data: {
    hasLatestTrip: false,
  },

  goToNextPage() {

    console.log('globaldata',getApp().globalData)
    const user_id = getApp().globalData.userId
    wx.request({
      url: `${getApp().getHost()}users/${user_id}/last_trip`,
      method: 'GET',
      success(res) {
        console.log('res from last trip',res)
        let activeTrip = res.data.trip.active
        if (activeTrip){
          wx.navigateTo({
            url: `/pages/trips/show/show?id=${res.data.trip.id}`,
          })
        }else{
          wx.navigateTo({
            url: '/pages/trips/create/create',
          })
        }
        
      }

    })


    // if (1 === 2){
    //   wx.navigateTo({
    //     url: '/pages/trips/...',
    //   })
    // }else{
    //   wx.navigateTo({
    //     url: '/pages/trips/create/create',
    //   })
    // }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
    // 
    // Fetch the last trip from the backend by user_id wx.request
    // Check the active attr of that trip
    // if active === true 
       //-> this.setData({hasLastestTrip: true})
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