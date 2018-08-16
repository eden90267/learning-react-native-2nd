# 平台 API

在做行動裝置應用程式時，你會自然地想要利用目標平台的 API。React Native
讓存取手機的相機膠卷、地點和儲存體變得容易，React Native
上透過引入模組來使用這些平台 API，這些模組提供我們一個易於使用的非同步 JavaScript 介面，來操作那些平台功能。

預設上，React Native 並不會支援目標平台上所有功能；部分平台上的 API
需要你實作自己的模組或是使用 React Native
社群寫好的模組才能使用，這部分將在第七章說明。
[官方文件](https://facebook.github.io/react-native/) 是查看哪些 API
已被支援的最佳途徑。

本章要談的是一些已支援的平台 API。我們會使用之前寫好的天氣 APP，加上：

- 自動偵測使用者所在位置的功能
- 記憶功能
  - 曾搜尋過哪些地點
- 相機膠卷來挑選照片換背景

## 使用 Geolocation

對行動裝置應用而言，知道使用者目前所在地很重要，可做出相對應的服務。

React Native 內建支援地理資訊，以不指定平台的 “自動補完函式庫” (polyfill)
型式提供。它回傳的資料符合 MDN Geolocation API 網頁規格
([https://developer.mozilla.org/en-US/docs/Web/API/Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation))。由於資料符合該規格，所以你不需要處理具平台差異的
API，例如 Location Service，你所寫出所有關於地理位置的程式碼都能完整地被移植的到其他平台。

## 讀取使用者位置

使用 Geolocation API 得到使用者的位置易如反掌，只要呼叫 navigator.geolocation 即可：

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log(position);
  },
  (error) => {alert(error.message)},
  {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
)
```

由於符合 Geolocation 規格，所以我們不用匯入位置 API 的模組，直接就可以使用。

getCurrentPosition 函式有三個參數：

- 成功情況的回呼函式 (必要參數)
- 錯誤情況的回呼函式
- 一組 geoOptions

當成功回呼函式被呼叫時，一個含有座標的 position
物件及一個時間戳記會被傳入該回呼函式：

```
Object {
  "coords": Object {
    "accuracy": 5,
    "altitude": 0,
    "altitudeAccuracy": -1,
    "heading": -1,
    "latitude": 37.785834,
    "longitude": -122.406417,
    "speed": -1,
  },
  "timestamp": 1534342827486.465,
}
```

geoOptions 是個物件，可以任意指定該物件中的 timeout、enableHighAccuracy 及
maximumAge。在程式動作可能不正常時，timeout 是最需要關注的項目。

請注意，你得先加入適當的權限到 Info.plist 檔 (iOS 用) 或是
AndroidManifest.xml (Android 用) 中，才能正常使用地理資訊，我們後面會說明如何加入權限。

### 權限處理

地理位置資料是私密性資訊，所以預設上你的應用程式無法存取。應用程式必須能處理權限允許打開或拒絕授予權限的情況。

多數行動裝置平台都限定位置權限，一個使用者可選擇在 iOS 完全關閉 Location
Service，或是為不同的應用程式指定給予權限。要注意位置權限可能在任何時間點被撤銷，應用程式應該一直有能力處理失敗的地理位置函式呼叫。

為了要存取地點資料，首先要宣告你的應用程式想使用地點資料。

在 iOS 上，你需在 Info.plist 檔中加入
NSLocationWhenInUseUsageDescription，在你建立 React Native 時，這個鍵應該已預設被引入了。

在 Android 上，你必須將以下內容加到 AndroidManifest.xml 檔中：

```
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

在你在應用程式首次企圖取得使用者位置時，使用者會看到一個要求權限的提示。

一旦使用者選定了選項，對應的回呼函式就會被呼叫。作出的選擇會保存，下一次就不會再問。

如果使用者拒絕授權，你可以無聲的接受被拒絕，但大多數的會跳出警示對話框，請求重新給予授權。

### 用模擬器測試 Geolocation

iOS 模擬器可讓你假設在不同地方。預設值是在加州蘋果公司附近，你可藉由

```
Debug -> Location -> Custom Location...
```

設定任何其他座標。

Android 上也可以選擇 GPS 座標，你甚至可以匯入資料，並且控制地點改變的速度。

在測試程序中加入不同地點的測試是個好練習。當然，若要嚴謹的測試，就應該把應用程式實際放在行動裝置上才行。

### 監看使用者的位置

你可設定家看使用者的位置，並在位置改變時收到變更通知。這可以用來隨時間追蹤使用者，或確認應用程式接收的是最新的位置資訊：

```javascript
this.watchID = navigator.geolocation.watchPosition(position => {
  this.setState({position: position});
});
```

也可在你的元件不再使用時，取消監看狀態：

```javascript
componentWillUnmount() {
  navigator.geolocation.clearWatch(this.watchID);
}
```

### 使用限制

由於地理資訊要符合 MDN 規格，所以很多進階的位置功能沒有支援。舉例來說，iOS 提供
Geofencing API，這種 API 在使用者進入或離開一個設定的地理區域 (geofence)
時，通知你的應用程式。React Native 就不支援這種 API。

如果你想要使用 MDN 規格未支援的位置功能，就要自己實作。

## 升級天氣應用程式

- 支援 Geolocation API

```javascript
// components/LocationButton/index.js

import React from "react";
import Button from "../Button";

const style = {backgroundColor: '#DDDDDD'};

class LocationButton extends Component {

  _onPress = () => {
    navigator.geolocation.getCurrentPosition(
      initialPosition => {
        this.props.onGetCoords(
          initialPosition.coords.latitude,
          initialPosition.coords.longitude
        );
      },
      error => {
        alert(error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  };

  render() {
    return (
      <Button label="Use Current Location" style={style} onPress={this._onPress}/>
    )
  }

}

export default LocationButton;
```

將 weather_project.js 檔升級，讓它可接受兩種不同的 query 方式 (經緯度及郵遞區號)：

```javascript
// modules/open_wether_map.js

const WEATHER_API_KEY = "bbeb34ebf60ad50f7893e7440a1e2b0b";
const API_STEM = "http://api.openweathermap.org/data/2.5/weather?";

function zipUrl(zip) {
  return `${API_STEM}q=${zip}&units=imperial&APPID=${WEATHER_API_KEY}`;
}

function latLonUrl(lat, lon) {
  return `${API_STEM}lat=${lat}&lon=${lon}&units=imperial&APPID=${WEATHER_API_KEY}`;
}

function fetchForecast(url) {
  return fetch(url)
    .then(response => response.json())
    .then(responseJSON => {
      return {
        main: responseJSON.weather[0].main,
        description: responseJSON.weather[0].description,
        temp: responseJSON.main.temp
      };
    })
    .catch(error => {
      console.error(error);
    });
}

function fetchZipForecast(zip) {
  return fetchForecast(zipUrl(zip));
}

function fetchLatLonForecast(lat, lon) {
  return fetchForecast(latLonUrl(lat, lon));
}

export default {
  fetchZipForecast,
  fetchLatLonForecast
};
```

然後把 <LocationButton> 加入主要 view，並設定 fetchLatLonForecast 作為回呼函式：

```javascript
<LocationButton onGetCoords={this._getForecastForCoords}/>
```

將應用程式給使用者前，還有一堆工作沒做：

- 更多錯誤訊息
- 更多 UI 提示

## 取用使用者的影像和照相機

> 需要使用完整的 Native 程式碼專案  
> react-native-cli 建立 or create-react-native-app 建立 + 升級 (ejected) 的專案。

能存取手機本地影像和照相機對許多行動裝置應用程式也是很重要的功能，這一節，我們會操作使用者的影像資料及照相機。

以 [weather-app](https://github.com/eden90267/weather-app) 繼續使用，以使用者膠卷影像改變背景。

## 操作 CameraRoll 模組

React Native 提供一個操作相機膠卷的介面，相機膠卷裡有使用者手機照相機所拍下的照片。

基本存取相機膠卷不是太難，首先要匯入 CameraRoll 模組：

```javascript
import {CameraRoll} from 'react-native';
```

然後利用這個模組取得使用者照片的資訊：

```javascript
CameraRoll.getPhotos(
  {first: 1},
  (data) => {
    console.log(data);
  },
  (error) => {
    console.warn(error);
  }
)
```

呼叫 getPhotos 搭配傳入適當的 query，它就會回傳一些相機膠捲相關的資訊。

到 weather-app ，以一個新的 `<PhotoBackdrop>` 元件換掉最上層的 `<Image>`
元件。現在 `<PhotoBackdrop>` 的功能僅有顯示使用者相機膠卷裡的一張照片。

```javascript
import React, {Component} from 'react';
import {ImageBackground, CameraRoll} from 'react-native';

import styles from './style';

class PhotoBackdrop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      photoSource: null
    };
  }

  componentDidMount() {
    CameraRoll.getPhotos({first: 1}).then(data => {
      this.setState({photoSource: {uri: data.edges[3].node.image.uri}});
    }, error => {
      console.warn(error);
    })
  }

  render() {
    return (
      <ImageBackground style={styles.backdrop}
                       source={this.state.photoSource}
                       imageStyle={{resizeMode: 'cover'}}>
        {this.props.children}
      </ImageBackground>
    );
  }
}

export default PhotoBackdrop;
```

CameraRoll.getPhotos 有三個傳入參數：

- 帶數個參數的物件
- 成功回呼函式
- 錯誤回呼函式

### 用 GetPhotoParams 取得影像

getPhotoParams 物件可以接受多種設定，可以查看 [React Native 原始碼](https://github.com/facebook/react-native/blob/master/Libraries/CameraRoll/CameraRoll.js#L46) 看看有哪些設定適合我們使用：

- first

  數值；指定從膠卷最新的照片中取得的張數

- after

  字串；符合 page_info {end_cursor} 的指標，由前一次 getPhotos 回傳

- groupTypes

  字串；指定分組方式進行過濾，值可以是 Album、All、Event 等；原始碼裡有所有支援的分組方式

- groupName

  字串；指定群組名稱進行過濾，例如 Recent Photos 或相簿名稱

- assetType

  可以是 All、Photos 或 Videos；用資產類別進行過濾

- mimeTypes

  字串陣列；基於 mimetype (像是 image/jpeg ) 的過濾器

### render 一張相機膠卷影像

從相機膠卷收到一張影像後，要如何把它 render 出來呢？先看一下成功的回呼函式：

```javascript
(data) => {
  this.setState({
    photoSource: {uri: data.edges[3].node.image.uri}
  });
}
```

每個 data.edges 裡的物件都有一個 node，node 代表一張相片，從 node
也可以得到實際資產的 URI。

### 上傳一張影像到 Server

React Native 的 XHR 模組內建之影像上傳功能基本使用方法如下：

```javascript
let formdata = new FormData();
// ...
formdata.append('image', {...this.state.randomPhoto, name: 'image.jpg'});
// ...
xhr.send(formdata);
```

XHR 是 XMLHeadRequest 的縮寫，React Native 將 XHR API 實作在 iOS 網路 API
之上。和地理資訊類似，React Native 的 XHR 實作也符合 MDN 規範。

使用 XHR 做網路 request 比 Fetch API 難一些，但基本的方法看起來像：

```javascript
let xhr = new XMLHttpRequest();
xhr.open('POST', 'http://posttestserver.com/post.php');
let formdata = new FormData();
formdata.append('image', {...this.state.photo, name: 'image.jpg'});
xhr.send(formdata);
```

這裡忽略向 XHR request 註冊多個回呼韓式的部分。