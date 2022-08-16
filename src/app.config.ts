export default {
  pages: [
    'pages/index/index',
    'pages/svg2canvas/index'
  ],
  tabBar: {
    // 使用custom-tab-bar
    color: '#999999',
    selectedColor: '#13b2ae',
    borderStyle: 'white',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        pagePath: 'pages/svg2canvas/index',
        text: 'SvgToCanvas',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
