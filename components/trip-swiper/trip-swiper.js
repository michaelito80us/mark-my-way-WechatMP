// components/trip-swiper/trip-swiper.js
const QQMapWX = require("../../libs/qqmap-wx-jssdk")
var qqmapsdk;

Component({
  /**
   * Component prope rties
   */
  properties: {
    stops: Array,
    current: Number,
    markers: Array,
    latitude: Number,
    longitude: Number
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
      console.log(e)
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/stops/show/show?id=${id}`,
      })
    },
    showRoute(e) {
      qqmapsdk = new QQMapWX({
        key: 'XIGBZ-ZCP6F-NINJP-JYWMZ-5EBR5-NYBBD'
      });
      const {stop} = e.currentTarget.dataset
      const id = e.currentTarget.dataset.id

      // wx.openLocation({
      //   latitude: stop.lat,
      //   longitude: stop.lon,
      //   name: stop.name, 
      //   address: stop.address
      // })

      var that = this;
      const currentLocation = {
        latitude: that.properties.latitude,
        longitude: that.properties.longitude
      }
      const selectedLocation = {
        latitude: stop.lat - 0.001663048,
        longitude: stop.lon + 0.004557321
      }
      console.log('skskdljfjaslkkl', currentLocation, selectedLocation)
      
      //调用距离计算接口
      qqmapsdk.direction({
        mode: 'walking',
        //from参数不填默认当前地址
        from: currentLocation,
        to: selectedLocation, 
        success: function (res) {
          console.log(res);
          var ret = res;
          var coors = ret.result.routes[0].polyline, pl = [];
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({ latitude: coors[i], longitude: coors[i + 1] })
          }
          console.log(pl)
          //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
          // that.setData({
          //   latitude:pl[0].latitude,
          //   longitude:pl[0].longitude,
          //   polyline: [{
          //     points: pl,
          //     color: '#FF0000DD',
          //     width: 4
          //   }]
          // })
          const markers = that.properties.markers;
          const markerIndex = markers.findIndex( s => s.id === stop.id)
          
          console.log('stop id', stop.id);
          console.log('marker id', markers[markerIndex].id);
          
          that.triggerEvent('setPolyline', pl, stop.id);
          // that.setData({
          //   latitude:pl[0].latitude,
          //   longitude:pl[0].longitude,
          //   polyline: [{
          //     points: pl,
          //     color: '#FF0000DD',
          //     width: 4
          //   }]
          // })
        },
        fail: function (error) {
          console.error(error);
        },
        complete: function (res) {
          console.log(res);
        }
      });
    }
  },
})
