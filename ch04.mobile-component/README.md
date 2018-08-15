# 行動裝置用的元件

React Native 與 React 共用程式碼：[https://github.com/necolas/react-native-web](https://github.com/necolas/react-native-web)

## `<Text>` 元件

在 React Native 中，只有 `<Text>` 元件可以有純文字的子項，所以不可以這樣用：

```javascript
<View>
  Text doesn't go here!
</View>
```

要用 `<Text>` 包裝過：

```javascript
<View>
  <Text>Text doesn't go here!</Text>
</View>
```

非存取像 `<strong>`、`<em>` 套用樣式：

- fontWeight
- fontStyle

可建立樣式元件：

```javascript
const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  }
});

class Strong extends Component {
  render() {
    return (
      <Text style={styles.bold}>
      {this.props.children}
      </Text>
    )
  }
}

class Em extends Component {
  render() {
    return (
      <Text style={styles.italic}>
      {this.props.children}
      </Text>
    )
  }
}
```

宣告這樣樣式元件，就可以很自由套上樣式了。

React Native 的樣式繼承是限定的，所以你在樹中的所有節點都會失去預設字型。React Native 文件建議使用樣式元件來解決這個問題：


> 你在樹中的所有節點都會失去原來的預設字型，如果你想要你的應用程式中使用一致的字型和大小，建議建立 MyAppText 元件，這個元件包括想要的字型和大小，並在你的應用程式中使用 MyAppText 元件。你也可利用這個元件來製作別種文字樣式，像是 MyAppHeaderText。

比起樣式繼承或重用，React Native 更建議使用樣式元件。雖一開始要花比較多時間，但這個方法最後使程式碼比較乾淨。下一章會進一步討論這個方法。

## `<Image>` 元件

```javascript
<Image source={require('./puppies.png')}
```

這裡適用於自動選取適用平台的原則：

- xxx.ios.png 及 xxx.android.png，React Native 依目標平台自動選擇
- `xxx@2x.png` 及 `xxx@3x.png`，React Native 依解析度自動選用適當的影像檔

網路路徑指定：

```javascript
<Image source={{uri: 'http://...'}}
       style={{width: 400, height: 400}} />
```

當指定使用網路影像時，你必須手動指定大小。

使用網路影像的優勢：

- 開發雛形
- 減少手機應用程式體積的好處

缺點：

- 仰賴別人資源

所以大多數時候，你應該不會想使用這種使用影像 URI 的方法

第六章會討論如何使用照相機照片。

React Native 著重在使用元件，所以影像也要被 `<Image>` 元件引用，不能透過樣式 (background-image 屬性指定)。

指定影像的樣式也很直捷，除了指定樣式，也會使用一些屬性來控制影像顯示，通常會使用 resizeMode 屬性，可以設定為 contain、cover 或是 stretch 等，UIExplorer App 是表現這些屬性的好例子。

## 使用觸控和手勢

在行動裝置上，是使用觸控。你會依照行動平台的互動規範來設計應用程式。不過視不同平台，互動會有差異。

React Native 提供一堆 API，讓你可以用來建立適用觸控的介面。

### `<Button>` 建立基本互動

```javascript
<Button
  onPress={this._onPress}
  title="Press me"
  color="#841584"
  accessibilityLabel="Press this button"
/>
```

如果想要建立自己的互動元件，就要使用 `<TouchableHighlight>` 了。

### 使用 `<TouchableHighlight>`

任何能回應使用者觸控的介面元素 (按鈕、控制元素等) 都應該用一個 `<TouchableHighlight>` 包裝。

`<TouchableHighlight>` 在使用者碰觸到時，會顯示一層疊加層，讓使用者視覺上有所回饋，疊加一層讓行動應用程式讓人感覺直覺的關鍵。

`<TouchableHighlight>` 提供數種事件提供勾子函式 (回呼函式)，例如：

- onPressIn
- onPressOut
- onLongPress
- 其他

```javascript
<TouchableHighlight
  onPressIn={this._onPressIn}
  onPressOut={this._onPressOut}
  accessibilityLabel={'PUSH ME'}
  style={styles.touchable}>
  <View style={styles.button}>
    <Text style={styles.welcome}>
      {this.state.pressing ? 'EEK!': 'PUSH ME'}
    </Text>
  </View>
</TouchableHighlight>
```

完整程式碼：

```javascript
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {pressing: false};
  }

  _onPressIn = () => {
    this.setState({pressing: true});
  };

  _onPressOut = () => {
    this.setState({pressing: false});
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPressIn={this._onPressIn}
          onPressOut={this._onPressOut}
          accessibilityLabel={'PUSH ME'}
          style={styles.touchable}>
          <View style={styles.button}>
            <Text style={styles.welcome}>
              {this.state.pressing ? 'EEK!': 'PUSH ME'}
            </Text>
          </View>
        </TouchableHighlight>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#FFFFFF'
  },
  touchable: {
    borderRadius: 100
  },
  button: {
    backgroundColor: '#FF0000',
    borderRadius: 100,
    height: 200,
    width: 200,
    justifyContent: 'center'
  }
});
```

可在設定 onPress 或 onLongPress 的勾子，讓他回應其他的事件。

## 使用 PanResponder 類別

它不是元件，而是一個 React Native 提供的一個類別。PanResponder gestureState 物件讓你可以存取原始的位置資料和資訊，例如當前手勢的速度和累積距離。

若想在 React 元件中使用 PanResponder，我們先建立一個 PanResponder 物件，然後將它附加在元件的 render 方法中。

建立 PanResponder 需要為 PanResponder 事件指定適當的事件處理函式。

建立一個 PanResponder 需指定數個回呼函式：

```javascript
this._panResponder = PanResponder.create({
  onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
  onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
  onPanResponderGrant: this._handlePanResponderGrant,
  onPanResponderMove: this._handlePanResponderMove,
  onPanResponderRelease: this._handlePanResponderEnd,
  onPanResponderTerminate: this._handlePanResponderEnd
});
```

這六個函式可讓我們存取完整的觸控事件生命週期：

- onStartShouldSetPanResponder, onMoveShouldSetPanResponder 決定我們要不要回應一個觸控事件
- onPanResponderGrant 在觸控事件開始時會被呼叫
- onPanResponderRelease, onPanResponderTerminate 在觸控事件結束時被呼叫
- onPanResponderMove 則是對正在進行中的事件存取觸控資料

用擴展語法將 onPanResponderGrant 加到我們元件的 render 方法中的 view。

```javascript
render: function () {
  return (
    <View
      {...this._panResponder.panHandlers}
      {/* View contents here */}
    />
  )
}
```

做完之後，如果觸控在 view 中發生，你傳遞給 PanResponder.create 的事件處理函式就會在適當時被呼叫。

現在實作一個小圈，你將它在畫面上拖動，而你移動它座標會同步顯示。

藉由實作 _handleStartShouldSetPanResponder 和 _handleMoveShouldSetPanResponder，我們可以宣告我們想要這個 PanResponder 回應觸控事件。

直接在前兩個回呼函式回傳 true：

```javascript
_handleStartShouldSetPanResponder = (event, gestureState) => {
  // 使用者按下圓圈時，狀態要變成 active 嗎？
  return true;
}

_handleMoveShouldSetPanResponder = (evenr, gestureState) => {
  // 在使用者的觸控在圓圈上移動時，狀態要變成 active 嗎？
  return true;
}
```

然後用 _handlePanResponderMove 得到的位置資料更新 circle view 中顯示座標：

```javascript
_handlePanResponderMove = (event, gestureState) => {
  // 使用位移量計算目前位置
  this._circleStyles.style.left = this._previousLeft + gestureState.dx;
  this._circleStyles.style.top = this._previousTop + gestureState.dy;
  this._updatePosition();
};

_updatePosition = () => {
  this.circle && this.circle.setNativeProps(this._circleStyles);
}
```

呼叫 setNativeProps 的目的是要更新 circle view 的顯示座標。

> 如果有使用動畫，你可以直接用 setNativeProps 修改元件，而不需要使用傳統方法設定 state 和 props。這讓你不用重新 render 所有階層的元件，不過使用時請保守些。

接著實作 _handlePanResponderGrant 和 _handlePanResponderEnd，以便在觸控動作改變圈圈的色彩

```javascript
// _highlight and _unHighlight get called by PanResponder methods,
// providing visual feedback to the user.
_highlight = () => {
  this.circle &&
    this.circle.setNativeProps({
      style: { backgroundColor: CIRCLE_HIGHLIGHT_COLOR }
    });
};

_unHighlight = () => {
  this.circle &&
    this.circle.setNativeProps({ style: { backgroundColor: CIRCLE_COLOR } });
};

_handlePanResponderGrant = (event, gestureState) => {
  this._highlight();
};

_handlePanResponderEnd = (event, gestureState) => {
  this._unHighlight();
};
```

全部程式碼：

```javascript
// Adapted from https://github.com/facebook/react-native/blob/master/
// Examples/UIExplorer/PanResponderExample.js

"use strict";

import React, { Component } from "react";
import { StyleSheet, PanResponder, View, Text } from "react-native";

const CIRCLE_SIZE = 40;
const CIRCLE_COLOR = "blue";
const CIRCLE_HIGHLIGHT_COLOR = "green";

class PanResponderExample extends Component {
  // Set some initial values.
  _panResponder = {};
  _previousLeft = 0;
  _previousTop = 0;
  _circleStyles = {};
  circle = null;

  constructor(props) {
    super(props);
    this.state = {
      numberActiveTouches: 0,
      moveX: 0,
      moveY: 0,
      x0: 0,
      y0: 0,
      dx: 0,
      dy: 0,
      vx: 0,
      vy: 0
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd
    });
    this._previousLeft = 20;
    this._previousTop = 84;
    this._circleStyles = {
      style: { left: this._previousLeft, top: this._previousTop }
    };
  }

  componentDidMount() {
    this._updatePosition();
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          ref={circle => {
            this.circle = circle;
          }}
          style={styles.circle}
          {...this._panResponder.panHandlers}
        />
        <Text>
          {this.state.numberActiveTouches} touches,
          dx: {this.state.dx},
          dy: {this.state.dy},
          vx: {this.state.vx},
          vy: {this.state.vy}
        </Text>
      </View>
    );
  }

  // _highlight and _unHighlight get called by PanResponder methods,
  // providing visual feedback to the user.
  _highlight = () => {
    this.circle &&
      this.circle.setNativeProps({
        style: { backgroundColor: CIRCLE_HIGHLIGHT_COLOR }
      });
  };

  _unHighlight = () => {
    this.circle &&
      this.circle.setNativeProps({ style: { backgroundColor: CIRCLE_COLOR } });
  };

  // We're controlling the circle's position directly with setNativeProps.
  _updatePosition = () => {
    this.circle && this.circle.setNativeProps(this._circleStyles);
  };

  _handleStartShouldSetPanResponder = (event, gestureState) => {
    // Should we become active when the user presses down on the circle?
    return true;
  };

  _handleMoveShouldSetPanResponder = (event, gestureState) => {
    // Should we become active when the user moves a touch over the circle?
    return true;
  };

  _handlePanResponderGrant = (event, gestureState) => {
    this._highlight();
  };

  _handlePanResponderMove = (event, gestureState) => {
    this.setState({
      stateID: gestureState.stateID,
      moveX: gestureState.moveX,
      moveY: gestureState.moveY,
      x0: gestureState.x0,
      y0: gestureState.y0,
      dx: gestureState.dx,
      dy: gestureState.dy,
      vx: gestureState.vx,
      vy: gestureState.vy,
      numberActiveTouches: gestureState.numberActiveTouches
    });

    // Calculate current position using deltas
    this._circleStyles.style.left = this._previousLeft + gestureState.dx;
    this._circleStyles.style.top = this._previousTop + gestureState.dy;
    this._updatePosition();
  };

  _handlePanResponderEnd = (event, gestureState) => {
    this._unHighlight();
    this._previousLeft += gestureState.dx;
    this._previousTop += gestureState.dy;
  };
}

const styles = StyleSheet.create({
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: CIRCLE_COLOR,
    position: "absolute",
    left: 0,
    top: 0
  },
  container: { flex: 1, paddingTop: 64 }
});

export default PanResponderExample;
```

什麼時候使用觸控和手勢 API 呢？答案是取決於你想做的動作是什麼。

如果是想表達一個按鈕或其他元素可以被點擊，建議使用 `<TouchableHighlight>` 元件處理回饋和指示。

如果是想識做你自己的觸控介面，可以選擇使用 PanResponder。如果你正設計一個遊戲或少見介面的應用程式，你會需要花一點時間建立想要的觸控介面。

對於大多數的應用程式而言，你並不需要實作任何客製的觸控處理。下一小節，我們會看到一些高階的元件，這些高階元件已幫你把常見的 UI 模式實作完了。

## 使用 List

- list 在行動裝置使用者介面當作重要元素
- list 其實只是一個可以捲動的容器，包裝了好幾個 view
- 兩種 API list 元件
  - `<FlatList>`
    - 處理既長且捲動、又會變化的一群相似結構資料
    - 做過數種效能優化
  - `<SectionList>`
    - 拆解為邏輯小區塊的資料
    - 有區塊標頭
    - 類似 iOS 的 UITableView
  - 底層或客製 list 處理：`<VirtualizedList>`

### 使用基本的 FlatList 元件

這裡會使用到它的兩個屬性：

- data
- renderItem

```javascript
<FlatList
  data={this.state.data}
  renderItem={this._renderItem} />
```

- data 應該是一個陣列型態，每個元素具有唯一 key 屬性，並可以加上你想用的其他屬性
- renderItem 是一個函式，這個函式會回傳一個元件，該元件是 data 陣列中的其中一個元素

```javascript
import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {key: 'a'},
        {key: 'b'},
        {key: 'c'},
        {key: 'd'},
        {key: 'a longer example'},
        {key: 'e'},
        {key: 'f'},
        {key: 'g'},
        {key: 'h'},
        {key: 'i'},
        {key: 'j'},
        {key: 'k'},
        {key: 'l'},
        {key: 'm'},
        {key: 'n'},
        {key: 'o'},
        {key: 'p'},
      ]
    };
  }

  _renderItem = (data) => {
    return <Text style={styles.row}>{data.item.key}</Text>
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.state.data} renderItem={this._renderItem}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    fontSize: 24,
    padding: 42,
    borderWidth: 1,
    borderColor: '#DDDDDD'
  }
});
```

renderItem 傳出對應 item 屬性的資料。可簡化：

```javascript
_renderItem = ({item}) => {
  return <Text style={styles.row}>{item.key}</Text>
};
```

### 更新 `<FlatList>` 內容

我們將使用紐約時報 API 建立一個簡單的暢銷書排行 app。

一開始先使用假的資料來代替：

```javascript
const mockBooks = [
  {
    rank: 1,
    title: "GATHERING PREY",
    author: "John Sandford",
    book_image: "http://du.ec2.nytimes.com.s3.amazonaws.com/prd/books/9780399168796.jpg"
  },
  {
    rank: 2,
    title: "MEMORY MAN",
    author: "David Baldacci",
    book_image: "http://du.ec2.nytimes.com.s3.amazonaws.com/prd/books/9781455586387.jpg"
  }
];
````

然後加入一個可以 render 這些假資料的元件 `<BookItem>`：

```javascript
// Book

import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const styles = StyleSheet.create({
  bookItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#AAAAAA',
    borderBottomWidth: 2,
    padding: 5,
    height: 175
  },
  cover: {
    flex: 1,
    height: 150,
    resizeMode: 'contain'
  },
  info: {
    flex: 3,
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20
  },
  author: {fontSize: 18},
  title: {fontSize: 18, fontWeight: 'bold'}
});

export default class App extends React.Component {

  render() {
    return (
      <View style={styles.bookItem}>
        <Image style={styles.cover} source={{uri: this.props.coverURL}}/>
        <View style={styles.info}>
          <Text style={styles.author}>{this.props.author}</Text>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
      </View>
    );
  }
}
```

```javascript
// App.js

import React from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import BookItem from "./BookItem";

const mockBooks = [
  {
    rank: 1,
    title: "GATHERING PREY",
    author: "John Sandford",
    book_image: "http://du.ec2.nytimes.com.s3.amazonaws.com/prd/books/9780399168796.jpg"
  },
  {
    rank: 2,
    title: "MEMORY MAN",
    author: "David Baldacci",
    book_image: "http://du.ec2.nytimes.com.s3.amazonaws.com/prd/books/9781455586387.jpg"
  }
];

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this._addKeysToBooks(mockBooks)
    };
  }

  _addKeysToBooks = books => {
    return books.map(book => {
      return Object.assign(book, {key: book.title})
    })
  };

  _renderItem = ({item}) => {
    return (
      <BookItem coverURL={item.book_image}
                title={item.key}
                author={item.author}/>
    )
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.state.data} renderItem={this._renderItem}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  }
});
```

### 整合真實資料

```javascript
// NYT.js

const API_KEY = "73b19491b83909c7e07016f4bb4644f9:2:60667290";
const LIST_NAME = "hardcover-fiction";
const API_STEM = "https://api.nytimes.com/svc/books/v3/lists";

function fetchBooks(list_name = LIST_NAME) {
  let url = `${API_STEM}/${list_name}?response-format=json&api-key=${API_KEY}`;
  return fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      return responseJson.results.books;
    })
    .catch(error => {
      console.error(error);
    });
}

export default {fetchBooks};
```

現在將函式庫引入元件：

```javascript
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  
  // ...
  
  _refreshData = () => {
    NYT.fetchBooks().then(books => {
      this.setState({data: this._addKeysToBooks(books)});
    })
  };
  
  componentDidMount() {
    this._refreshData();
  };
  
  // ...
  
}
```

只要記得把你的資料組織得宜，使用 `<FlatList>` 元件是很直截的，除了處理捲動與觸控互動外，`<FlatList>` 也做了很多加速 render 和減少記憶體使用量的效能優化。

### 使用 `<SectionList>`

- 設計來顯示資料集合
- 集合內是同質性並可選擇要不要加標頭

舉例，如果要顯示數種不同類的暢銷書，並為每一類加上標頭，此時選用 `<SectionList>` 就很合適

`<SectionList>` 要用到下列屬性：

- sections
  - 陣列
    - 元素 (一塊資料)
      - title
      - data (同 `<FlatList>` data，有唯一 key 屬性)
- renderItem
- renderSectionHeader

我們來將 _renderData 方法進階，可抓取小說和非小說，並更新對應的元件狀態：

```javascript
_refreshData = () => {
  Promise
    .all([
      NYT.fetchBooks('hardcover-fiction'),
      NYT.fetchBooks('hardcover-nonfiction')
    ])
    .then(results => {
      if (results.length !== 2) {
        console.error('Unexpected results');
      }

      this.setState({
        sections: [
          {
            title: 'Hardcover Fiction',
            data: this._addKeysToBooks(results[0])
          },
          {
            title: 'Hardcover NonFiction',
            data: this._addKeysToBooks(results[1])
          }
        ]
      })
    });
};
```

不用更新 _renderItem 方法，但需加上新的 _renderHeader 方法：

```javascript
_renderHeader = ({section}) => {
  return (
    <Text style={styles.headingText}>
      {section.title}
    </Text>
  )
};
```

最後更新 render 方法：

```javascript
render() {
  return (
    <View style={styles.container}>
      <SectionList sections={this.state.sections}
                   renderItem={this._renderItem}
                   renderSectionHeader={this._renderHeader}/>
    </View>
  );
}
```

## Navigation

導航，切換不同畫面的動作。一個畫面移動到另一個畫面的程式碼。網頁上屬於 window.history API 負責，這個 API 提供像 “上一頁” 和 “下一頁” 的功能。

在 React Native 中，一般 Navigation 元件是內建的：

- `<Navigator>`
- `<NavigatorIOS>`

以及社群開發的：

- `<StackNavigator>` (react-navigation 函式提供)

為了在行動裝置 app 裡的畫面間移動，所以必須要有 Navigation 的邏輯，還要具備 “深度連結” (deep linking) 的功能，這樣使用者才能藉由一個 URL 跳到 app 中指定的畫面。

第十章深入討論 Navigation

## 組織用元件

還有很多其他用來組織的元件，幾個好用的如 `<TabBarIOS>`、`<SegmentedControlIOS>`，以及 `<DrawerLayoutAndroid>` 和 `<ToolbarAndroid>`。

這些都是由該平台上 UI 元素的原生 API 重新包裝而來。

寫應用程式，這些元件在組織多畫面非常有用。

- `<TabBarIOS>` 和 `<DrawerLayoutAndroid>` 可切換多種模式或功能
- `<SegmentedControlIOS>` 和 `<ToolbarAndroid>` 更適合較小一點的控制

參考不同平台的設計規範，以更適當的使用這些元件：

- [https://developer.android.com/guide/topics/resources/drawable-resource#Bitmap](https://developer.android.com/guide/topics/resources/drawable-resource#Bitmap)
- [https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/](https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/)


第七章會深入說明使用不同平台的元件

## 總結

- 多個幾個重要元件
- 客製的觸控處理

下一章將討論樣式設定，以及如何在行動裝置 app 上使用 React Native。