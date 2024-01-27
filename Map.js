// 推荐国家的经纬度
var countries = {
    "France": { lat: 47.52545, lng: 1.05894 },
    "Philippines": { lat: 12.59588, lng: 122.00750 },
    "Tailand":{lat:16.42992 ,lng:101.01890},
    "Portugal":{lat:39.63034 ,lng:-8.61881},
    "Indonesia":{lat: -4.32047 ,lng:119.86984},
    // 其他国家...
};


// Toggle the visibility of the shopping cart
function toggleCart() {
    // Functionality to show/hide shopping cart will be implemented here
    window.location.href = 'cart.html';
}

// 监听页面加载完成事件
document.addEventListener('DOMContentLoaded', function() {

    // 初始化地图
    var map = new BMapGL.Map("map");
    var point = new BMapGL.Point(116.404, 39.915);
    map.centerAndZoom(point, 0);
    map.enableScrollWheelZoom(true);
    map.setMapStyleV2({     
        styleId: 'dcdc8fa758470618dd8919a321f1aa22'
      });

    /*
    //渲染推荐地点
    for(var country in countries){
        if(countries.hasOwnProperty(country)){
            var countryinfo=countries[country];
            var lat=countryinfo.lat;
            var lng=countryinfo.lng;

            var point = new BMapGL.Point(lng,lat);
            var marker = new BMapGL.Marker(point);

            // 为地图标注添加自定义属性，存储关联的国家标识符
            marker.customData = { country: country };

            // 将标注添加到地图
            map.addOverlay(marker);
            // 使用自执行函数创建闭包，确保每个事件处理函数有自己的 infoWindow
            (function (country) {
                var infoWindow = new BMapGL.InfoWindow(country, {
                    width: 100,     // 信息窗口宽度
                    height: 100,    // 信息窗口高度
                    title: country  // 信息窗口标题
                });

                // 绑定点击事件，点击标注时弹出信息窗口
                marker.addEventListener("click", function () {
                    this.openInfoWindow(infoWindow);
                });
            })(country);

            // 将标注添加到地图
            map.addOverlay(marker);
        }
    }
    */
    var clickpoint;
    var userpoint;

    /* 完成用户自动选点并获取坐标操作 */
    // 添加点击事件监听器
    function onMapClick(e)
    {
        var address;
        // 获取经纬度信息
        var lng = e.latlng.lng;
        var lat = e.latlng.lat;

        // 创建地理编码实例      
        var myGeo = new BMapGL.Geocoder();      
        // 根据坐标得到地址描述    
        myGeo.getLocation(new BMapGL.Point(lng, lat), function(result){      
            if (result){      
                address=result.address;     
                // 创建标注
                clickpoint = new BMapGL.Point(lng, lat);
                var marker = new BMapGL.Marker(clickpoint);

                // 将标注添加到地图中
                map.addOverlay(marker);

                // 调用函数并使用 then 获取返回值
                calculateDistance().then(distance => {
                    var content = `
                        <div>
                            <strong>Address:</strong> ${address}<br>
                            <strong>Distance:</strong> ${distance}
                        </div>
                    `;
                    var infoWindow = new BMapGL.InfoWindow(content, {
                        width: 200,     // 信息窗口宽度
                        height: 100,    // 信息窗口高度
                        title: "Location Info" // 信息窗口标题
                    });
                    
                     // 添加标记的mouseover事件监听器
                    marker.addEventListener("mouseover", function () {
                        this.openInfoWindow(infoWindow);
                    });

                    // 添加标记的mouseout事件监听器，可选
                    marker.addEventListener("mouseout", function () {
                        this.closeInfoWindow();
                    });

                }); 
            }      
        });
    }

    map.addEventListener('click', onMapClick);

    /* 获取用户坐标位置 */
    var geolocation = new BMapGL.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                userpoint=r.point;
                var myIcon = new BMapGL.Icon("photos/icon.png", new BMapGL.Size(20, 20));
                var marker = new BMapGL.Marker(r.point, {icon: myIcon});   
                map.addOverlay(marker); 
                map.panTo(r.point);
                var content = "you are here";
                var label = new BMapGL.Label(content, {       // 创建文本标注
                    position: r.point,                          // 设置标注的地理位置
                })  
                label.setStyle({
                    color: '#005',      // 文字颜色
                    fontSize: '16px',   // 文字大小
                    borderWidth: 0 ,   // 去除边框样式
                    background: 'transparent', // 设置背景为透明
                });
                map.addOverlay(label);   // 将标注添加到地图中
            }
            else {
                alert('failed' + this.getStatus());
            }        
        });
    
    // 计算距离的函数
    function calculateDistance() {
        if (userpoint && clickpoint){
            return new Promise((resolve, reject) => {
                // 模拟异步操作，比如使用 setTimeout
                setTimeout(() => {
                    var distance = map.getDistance(clickpoint, userpoint).toFixed(2);// 这里是计算距离的逻辑
                    resolve(distance); // 使用 resolve 返回计算的距离
                }, 0);
            });
        }
    }

});

