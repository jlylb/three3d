const frontJpg = require('../assets/rack_front_door.jpg')
const backJpg = require('../assets/rack_door_back.jpg')
const rackJpg = require('../assets/rack.jpg')

const data = {
  show: true,
  name: 'cabinet1_1',
  shellname: 'cabinet1_1_shell',
  uuid: '',
  objType: 'emptyCabinet',
  transparent: true,
  size: { width: 66, depth: 70, height: 200, thick: 2 },
  position: { x: 0, y: 0, z: 0 },
  doors: {
    doorType: 'lr', // ud上下门 lr左右门 单门可以缺省
    doorSize: [1],
    doorname: ['cabinet_door_01'],
    skins: [
      {
        skinColor: 0x333333,
        left: {
          imgurl: backJpg //左
        },
        right: {
          imgurl: backJpg //右
        },
        up: { imgurl: backJpg }, //上
        down: { imgurl: backJpg }, //下

        after: { imgurl: backJpg }, //后
        before: { imgurl: frontJpg } //前
      }
    ]
  },
  skin: {
    skinColor: 0xff0000,
    up: {
      skin: {
        skinColor: 0xff0000,
        up: { imgurl: backJpg },
        down: { imgurl: backJpg },
        before: {
          skinColor: 0xff0000,
          imgurl: backJpg
        },
        after: {
          skinColor: 0xff0000,
          imgurl: backJpg
        },
        left: { imgurl: backJpg },
        right: { imgurl: backJpg }
      }
    },
    down: {
      skin: {
        skinColor: 0xff0000,
        up: { imgurl: backJpg },
        down: { imgurl: backJpg },
        before: {
          skinColor: 0xff0000,
          imgurl: backJpg
        },
        after: {
          skinColor: 0xff0000,
          imgurl: backJpg
        },
        left: { imgurl: backJpg },
        right: { imgurl: backJpg }
      }
    },
    left: {
      skin: {
        skinColor: 0xff0000,
        up: { imgurl: backJpg },
        down: { imgurl: backJpg },
        before: {
          skinColor: 0xff0000,
          imgurl: backJpg
        },
        after: {
          skinColor: 0xff0000,
          imgurl: backJpg
        },
        left: { imgurl: backJpg },
        right: { imgurl: backJpg }
      }
    },
    right: {
      skin: {
        skinColor: 0xff0000,
        up: { imgurl: backJpg },
        down: { imgurl: backJpg },
        before: {
          skinColor: 0xff0000,
          imgurl: backJpg
        },
        after: {
          skinColor: 0xff0000,
          imgurl: backJpg
        },
        left: { imgurl: backJpg },
        right: { imgurl: backJpg }
      }
    },
    after: {
      skin: {
        skinColor: 0xff0000,
        up: { imgurl: backJpg },
        down: { imgurl: backJpg },
        before: {
          skinColor: 0xff0000,
          imgurl: backJpg
        },
        after: {
          skinColor: 0xff0000,
          imgurl: backJpg
        },
        left: { imgurl: backJpg },
        right: { imgurl: backJpg }
      }
    }
  }
}

export default data
