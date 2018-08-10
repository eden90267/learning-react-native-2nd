# 建立第一個應用程式

## 設定開發環境

- 使用 Create React Native App
  - 只支援純 JavaScript 應用程式
  - 可透過 eject 升級成完整版 React Native 專案
- 安裝完整 React Native 以及所有需要的套件

## Create React Native App

```shell
$ npm i -g create-react-native-app
```

### 使用 create-react-native-app

```shell
$ create-react-native-app first-project
```

這個動作會安裝一些必要的 JavaScript 套件，而且會建立基礎樣板：

```
.
├── App.js
├── App.test.js
├── README.md
├── app.json
├── node_modules
├── package-lock.json
└── package.json
```

### 預覽 App

```shell
$ cd first-project
$ npm start
```

在 iOS 或 Android 裝置上下載一個 Expo 的 app。再將裝置對準二維條碼，這樣你的 React Native App 就會被載入。請注意，裝置和電腦需要在同一個網路，否則就不能互相通訊了。

## 開發環境：傳統方法

可看 React Native 官方文件，找到如何安裝 React Native 以及相關套件的指引

開發環境的設立：

- node.js
- React Native
- iOS 開發環境 Xcode
- Android 開發環境 (JDK、Android SDK 及 Android Studio)

### 用 react-native 建立第一個應用程式

```shell
$ npm i -g react-native-cli
```

```shell
$ react-native init FirstProject
```

產出來的結構：

```
.
├── __tests__
├── android
├── app.json
├── index.android.js
├── index.ios.js
├── ios
├── node_modules
├── package.json
└── yarn.lock
```

- ios/ 和 android/ 目錄下就是對應該平台的樣板程式
- React 程式碼被放在 index.ios.js 和 index.android.js 檔案中，是兩個平台對應的程式碼起始點 (新版已結合一個 index.js)

### iOS 上執行 App

```shell
$ cd FirstProject
$ react-native run-ios
```

或在 Xcode 打開應用程式專案，從 iOS 模擬器中執行：

```shell
$ open ios/FirstProject.xcodeproj
```

你也可使用 XCode 把應用程式上傳到真實裝置進行測試，記得準備好 Apple ID，這樣才能完成程式碼簽章。

```
Xcode -> Project Navigator -> General tab -> Signing menu 的 Team 選擇 Apple 開發者帳號
```

### Android 上執行 App

有完整功能的 Android 開發環境：

- Android Studio
- Android SDK

可參考官網的 Getting Started

```shell
$ react-native run-android
```

可在 Android 模擬器或透過 USB 連接的實際裝置執行你的應用程式，不過實際裝置需打開 USB 除錯選項

## 查看範例程式

```javascript
// App.js

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

- 使用 React Native 時，必須明確指定引入想用的每一個原生模組。不像 `<div>` 單純存在
- 另外像 Stylesheet 及 AppRegistry，也一樣要被明確指定引入
- 處理樣式的標準方法是使用 StyleSheet 函式庫，你可以看到樣式物件在檔案尾端被定義
- 只有 `<Text>` 元件可以接受像是 fontSize 這樣的文字樣式
- 所有樣式邏輯都由 flexbox 負責

## 建立一個天氣 App

- 使用樣式表
- flexbox
- 網路通訊
- 使用者輸入
- 照片
- Android 或 iOS 執行
- 文字欄位接收使用者輸入的郵遞區號，並送到 OpenWeatherMap API，取得目前天氣資訊並顯示

實現細節請查看：[https://github.com/eden90267/weather-app](https://github.com/eden90267/weather-app)