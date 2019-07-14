const drPng = require('../assets/door_right.png')
const dlPng = require('../assets/door_left.png')
const floorJpg = require('../assets/floor.jpg')
const glassPng = require('../assets/glass.png')

const plantJpg = require('../assets/plant.png')

const frontJpg = require('../assets/rack_front_door.jpg')
const backJpg = require('../assets/rack_door_back.jpg')
const rackJpg = require('../assets/rack.jpg')

const serverJpg = require('../assets/server2.jpg')
const insideJpg = require('../assets/rack_inside.jpg')

export const room = {
  length: 300,
  width: 240,
  height: 120,
  thick: 3
}
/**
 *
 * @param int length 腿宽
 * @param int boardWidth 盒子宽
 * @param int distance 距中心点距离
 * @param string direction 方向 left|right
 */
const getChair = (length, boardWidth, distance, direction = 'left') => {
  let len
  if (direction === 'left') {
    len = distance + boardWidth / 2 - length / 2
  } else {
    len = distance + length / 2
  }
  return len
}
/**
 *
 * @param Object point 点坐标
 * @param Number length 长
 * @param Number Width 宽
 * @param Number height 高
 * @param Number distance 距离
 * @param Number thick 厚度
 */
const xyzPosition = (
  point,
  distance = 10,
  length = 20,
  Width = 20,
  height = 100,
  thick = 2
) => {
  const { x, y, z } = point
  const pointArr = [
    // 左侧
    [
      [x + length, height / 2 + distance / 2, z],
      [x, height / 2 + distance / 2, z]
    ],
    //右侧
    [
      [x + length, height / 2 + distance / 2, z + Width],
      [x, height / 2 + distance / 2, z + Width]
    ],
    //后侧
    [
      [
        x + length - thick / 2,
        height / 2 + distance / 2,
        z + length - thick / 2
      ],
      [x + length - thick / 2, height / 2 + distance / 2, z + thick / 2]
    ],
    //上侧
    [
      [
        x + length / 2,
        height + distance / 2 - thick / 2,
        z + length - thick / 2
      ],
      [x + length / 2, height + distance / 2 - thick / 2, z + thick / 2]
    ],
    //下侧
    [
      [x + length / 2, distance / 2 + thick / 2, z + length - thick / 2],
      [x + length / 2, distance / 2 + thick / 2, z + thick / 2]
    ]
  ]
  return pointArr
}
const cabinets1 = xyzPosition({ x: 0, y: 10, z: -340 })

const xyzMerge = (
  point,
  distance = 10,
  length = 60,
  Width = 70,
  height = 200,
  thick = 2
) => {
  const { x, y, z } = point
  const pointArr = [
    // 左侧
    [
      [x - Width / 2, height / 2 + distance / 2 + thick / 2, z + 0],
      [x + Width / 2, height / 2 + distance / 2 + thick / 2, z + 0]
    ],
    //右侧
    [[-Width / 2, 0, length], [Width / 2, 0, length]],
    //后侧
    [
      [Width / 2 - thick / 2, 0, length - thick / 2],
      [Width / 2 - thick / 2, 0, thick / 2]
    ],
    //上侧
    [
      [0, height / 2 - thick / 2, length - thick / 2],
      [0, height / 2 - thick / 2, thick / 2]
    ],
    //下侧
    [
      [0, -height / 2 + thick / 2, length - thick / 2],
      [0, -height / 2 + thick / 2, thick / 2]
    ],
    //后侧
    [
      [-Width / 2 + thick / 2, 0, length - thick / 2],
      [-Width / 2 + thick / 2, 0, thick / 2]
    ]
  ]
  return pointArr
}
const cabinets = xyzMerge({ x: -100, y: 10, z: -320 })
console.log(cabinets1, cabinets)

const xyzServer = (i, cHeight=200, height=10, thick=68, length = 58, bottom=2 ) => {
  let boxHeight = -cHeight/2 + bottom + i*height/2+(i-1)*10;
  return [
    [0, boxHeight, length - 1],
    [0, boxHeight, 1],
  ]
}
export default {
  //房间设置
  room: {
    length: 300,
    width: 240,
    height: 120,
    thick: 3
  }, //房间长 宽  高, 墙厚
  floor: 10,
  models: [
    //地面
    {
      name: 'floor',
      modelType: 'floor',
      box: [2000, 10, 1600], // x y z
      rotation: [0, 0, 0],
      position: [0, 0, 0],
      visible: true,
      enabledReceive: true,
      style: {
        color: 0x8ac9e2,
        skin: {
          left: {
            color: 0xdddddd
          },
          right: {
            color: 0xdddddd
          },
          up: {
            color: 0xb0cee0,
            path: floorJpg,
            repeat: true
          },
          down: {
            color: 0xb0cee0
          },
          after: {
            color: 0xb0cee0
          },
          before: {
            color: 0xb0cee0
          }
        }
      }
    },
    //墙面
    {
      name: 'room',
      modelType: 'room',
      room: {
        length: 300,
        width: 240,
        height: 120,
        thick: 3
      }, //房间长 宽  高, 墙厚
      walls: [
        {
          name: 'wall1',
          rotation: [0, 0, 0],
          position: [0, 0, 0],
          start: [-500, 120, -350],
          end: [500, 120, -350],
          visible: true,
          style: {
            color: 0x8ac9e2,
            skin: {
              left: {
                color: 0xb0cee0
              },
              right: {
                color: 0xb0cee0
              },
              up: {
                color: 0xdddddd
              },
              down: {
                color: 0xb0cee0
              },
              after: {
                color: 0xb0cee0
              },
              before: {
                color: 0xb0cee0
              }
            }
          },
          childrens: [
            {
              name: '',
              modelType: 'hole',
              op: '-',
              start: [-400, 120, -350],
              end: [-100, 120, -350],
              height: 200,
              rotation: [0, 0, 0],
              visible: true
            },
            {
              name: '',
              modelType: 'hole',
              op: '-',
              rotation: [0, 0, 0],
              start: [400, 120, -350],
              end: [100, 120, -350],
              height: 200,
              visible: true
            },
            {
              name: 'glass1',
              modelType: 'glass',
              start: [-400, 0, 0],
              end: [-100, 0, 0],
              height: 200,
              thick: 1,
              visible: true,
              enabledShadow: true,
              style: {
                transparent: true,
                opacity: 0.1,
                path: glassPng
              }
            },
            {
              name: 'glass2',
              modelType: 'glass',
              enabledShadow: true,
              start: [400, 0, 0],
              end: [100, 0, 0],
              height: 200,
              thick: 1,
              visible: true,
              style: {
                transparent: true,
                opacity: 0.1,
                path: glassPng
              }
            }
          ]
        },
        {
          name: 'wall2',
          rotation: [0, 0, 0],
          position: [0, 0, 0],
          start: [-500, 120, 450],
          end: [500, 120, 450],
          visible: true,
          style: {
            color: 0x8ac9e2,
            skin: {
              left: {
                color: 0xb0cee0
              },
              right: {
                color: 0xb0cee0
              },
              up: {
                color: 0xdddddd
              },
              down: {
                color: 0xb0cee0
              },
              after: {
                color: 0xb0cee0
              },
              before: {
                color: 0xb0cee0
              }
            }
          },
          childrens: []
        },
        {
          name: 'wall3',
          rotation: [0, 0, 0],
          position: [0, 0, 0],
          start: [490, 120, -350],
          end: [490, 120, 450],
          visible: true,
          style: {
            color: 0x8ac9e2,
            skin: {
              left: {
                color: 0xb0cee0
              },
              right: {
                color: 0xb0cee0
              },
              up: {
                color: 0xdddddd
              },
              down: {
                color: 0xb0cee0
              },
              after: {
                color: 0xb0cee0
              },
              before: {
                color: 0xb0cee0
              }
            }
          },
          childrens:[]
        },
        {
          name: 'wall4',
          rotation: [0, 0, 0],
          position: [0, 0, 0],
          start: [-490, 120, -350],
          end: [-490, 120, 450],
          visible: true,
          style: {
            color: 0x8ac9e2,
            skin: {
              left: {
                color: 0xb0cee0
              },
              right: {
                color: 0xb0cee0
              },
              up: {
                color: 0xdddddd
              },
              down: {
                color: 0xb0cee0
              },
              after: {
                color: 0xb0cee0
              },
              before: {
                color: 0xb0cee0
              }
            }
          },
          childrens: [
            {
              name: '',
              modelType: 'hole',
              op: '-',
              rotation: [0, 0, 0],
              visible: true,
              start: [-490, 110, -60],
              end: [-490, 110, 160],
              height: 210,
              style: {
                color: 0x8ac9e2,
                skin: {
                  left: {
                    color: 0xffdddd
                  },
                  right: {
                    color: 0xffdddd
                  },
                  up: {
                    color: 0xffdddd
                  },
                  down: {
                    color: 0xdddddd
                  },
                  after: {
                    color: 0xffdddd
                  },
                  before: {
                    color: 0xffdddd
                  }
                }
              }
            },
            {
              modelType: 'door',
              start: [0, -10, -110],
              end: [0, -10, 0],
              height: 210,
              thick: 4,
              visible: true,
              name: 'leftdoor',
              direction: 'left',
              enabledAxes: true,
              enabledLine: true,
              enabledShadow: true,
              style: {
                skin: {
                  left: {
                    color: 0xdddddd,
                    path: drPng
                  },
                  right: {
                    color: 0xdddddd,
                    path: dlPng
                  },
                  up: {
                    color: 0xb0cee0
                  },
                  down: {
                    color: 0xb0cee0
                  },
                  after: {
                    color: 0xdeeeee
                  },
                  before: {
                    color: 0xb0cee0
                  }
                }
              },
              userData: {
                door: {
                  left: -3 / 5,
                  right: 3 / 5,
                  animationType: 'elastic'
                }
              }
            },
            {
              modelType: 'door',
              start: [0, -10, 0],
              end: [0, -10, 110],
              height: 210,
              thick: 4,
              visible: true,
              name: 'rightdoor',
              direction: 'right',
              enabledAxes: true,
              enabledShadow: true,
              style: {
                skin: {
                  left: {
                    color: 0xdddddd,
                    path: dlPng
                  },
                  right: {
                    color: 0xdddddd,
                    path: drPng
                  },
                  up: {
                    color: 0xb0cee0
                  },
                  down: {
                    color: 0xb0cee0
                  },
                  after: {
                    color: 0xdeeeee
                  },
                  before: {
                    color: 0xb0cee0
                  }
                }
              },
              userData: {
                door: {
                  left: -3 / 5,
                  right: 3 / 5,
                  animationType: 'elastic'
                }
              }
            }
          ]
        }
      ]
    },
    //桌子
    {
      name: 'desk',
      modelType: 'desk',
      box: [60, 100, 30], // x y z
      rotation: null,
      position: [0, 0, 0],
      start: [-300, 35, 30],
      end: [300, 35, 30],
      height: 60,
      thick: 180,
      sideHoles: [280, 40, 180],
      holes: [10, 80, 30],
      visible: true,
      enabledAxes: true,
      enabledLine: true,
      style: {
        color: 0x8ac9e2,
        skin: {
          left: {
            color: 0xb0cee0
          },
          right: {
            color: 0xb0cee0
          },
          up: {
            color: 0xb0cee0
          },
          down: {
            color: 0xff0000
          },
          after: {
            color: 0xb0cee0
          },
          before: {
            color: 0xb0cee0
          }
        }
      },
      childrens: [
        {
          modelType: 'hole',
          start: [-280, 35, 30],
          end: [280, 35, 30],
          height: 60,
          thick: 40,
          op: '-'
        },
        {
          modelType: 'hole',
          start: [-280, 25, 30],
          end: [280, 25, 30],
          height: 40,
          thick: 180,
          op: '-'
        }
      ]
    },
    // 椅子
    {
      name: 'board',
      modelType: 'chair',
      start: [-240, 25, -100],
      end: [-260, 25, -100],
      height: 2,
      thick: 20,
      childrens: [
        {
          name: 'left_1',
          modelType: 'hole',
          start: [-256, 25, -109],
          end: [-260, 25, -109],
          height: 40,
          thick: 2,
          op: '+'
        },
        {
          name: 'left_2',
          modelType: 'hole',
          start: [-240, 25, -109],
          end: [-244, 25, -109],
          height: 40,
          thick: 2,
          op: '+'
        },
        {
          name: 'right_1',
          modelType: 'hole',
          start: [-256, 15, -91],
          end: [-260, 15, -91],
          height: 20,
          thick: 2,
          op: '+'
        },
        {
          name: 'right_2',
          modelType: 'hole',
          start: [-240, 15, -91],
          end: [-244, 15, -91],
          height: 20,
          thick: 2,
          op: '+'
        },
        {
          name: 'side_board',
          modelType: 'hole',
          start: [-240, 41, -109],
          end: [-260, 41, -109],
          height: 8,
          thick: 2,
          op: '+'
        }
      ]
    },
    {
      name: 'plant',
      modelType: 'plant',
      width: 180, // x y z
      offset: 5,
      style: plantJpg
    },
    {
      name: 'cabinet_1',
      modelType: 'cabinet',
      start: cabinets[0][0],
      end: cabinets[0][1],
      height: 200,
      thick: 2,
      // enabledShadow: true,
      // enabledAxes: true,
      // AxesLen: 1000,

      style: {
        skin: {
          color: 0xff0000,
          up: { path: backJpg },
          down: { path: backJpg },
          before: {
            path: backJpg
          },
          after: {
            path: backJpg
          },
          left: { path: backJpg },
          right: { path: backJpg }
        }
      },
      childrens: [
        //后
        {
          modelType: 'hole',
          start: cabinets[2][0],
          end: cabinets[2][1],
          height: 200,
          thick: 2,
          op: '+'
        },
        //右
        {
          modelType: 'hole',
          start: cabinets[1][0],
          end: cabinets[1][1],
          height: 200,
          thick: 2,
          op: '+'
        },
        //上
        {
          modelType: 'hole',
          start: cabinets[3][0],
          end: cabinets[3][1],
          height: 2,
          thick: 68,
          op: '+'
        },
        //下
        {
          modelType: 'hole',
          start: cabinets[4][0],
          end: cabinets[4][1],
          height: 2,
          thick: 68,
          op: '+'
        },
        {
          modelType: 'door',
          start: cabinets[5][0],
          end: cabinets[5][1],
          height: 196,
          thick: 2,
          name: 'cabinets_door',
          style: {
            transparent: true,
            color: 0x00ff00,
            opacity: 0.2,
            skin: {
              left: {
                path: rackJpg //左
              },
              right: {
                path: frontJpg //右
              },
              up: { path: backJpg }, //上
              down: { path: backJpg }, //下

              after: { path: backJpg }, //后
              before: { path: backJpg } //前
            }
          },
          userData: {
            door: {
              left: -3 / 5,
              right: 3 / 5,
              animationType: 'none'
            }
          }
        },
        {
          modelType: 'server',
          name: 'server_1',
          start: xyzServer(6)[0],
          end: xyzServer(6)[1],
          height: 10,
          thick: 68,
          style: {
            transparent: true,
            color: 0x00ff00,
            opacity: 0.2,
            skin: {
              left: {
                path: insideJpg
              },
              right: {
                path: serverJpg
              },
              up: {
                path: insideJpg
              },
              down: {
                path: insideJpg
              },
              after: {
                path: insideJpg
              },
              before: {
                path: insideJpg
              }
            }
          }
        },
        {
          modelType: 'server',
          name: 'server_1',
          start: xyzServer(5)[0],
          end: xyzServer(5)[1],
          height: 10,
          thick: 68,
          style: {
            transparent: true,
            color: 0x00ff00,
            opacity: 0.2,
            skin: {
              left: {
                path: insideJpg
              },
              right: {
                path: serverJpg
              },
              up: {
                path: insideJpg
              },
              down: {
                path: insideJpg
              },
              after: {
                path: insideJpg
              },
              before: {
                path: insideJpg
              }
            }
          }
        },
        {
          modelType: 'server',
          name: 'server_1',
          start: xyzServer(10)[0],
          end: xyzServer(10)[1],
          height: 10,
          thick: 68,
          style: {
            transparent: true,
            color: 0x00ff00,
            opacity: 0.2,
            skin: {
              left: {
                path: insideJpg
              },
              right: {
                path: serverJpg
              },
              up: {
                path: insideJpg
              },
              down: {
                path: insideJpg
              },
              after: {
                path: insideJpg
              },
              before: {
                path: insideJpg
              }
            }
          }
        },
      ]
    },

    {
      name: 'empty_box',
      modelType: 'box',
      start: cabinets[0][0],
      end: cabinets[0][1],
      height: 200,
      thick: 2,
      groupPosition: [-400, 105, 100],
      style: {
        transparent: true,
        color: 0x00ff00,
        opacity: 0.2,
      },
      childrens: [
        //后
        {
          modelType: 'hole',
          start: cabinets[2][0],
          end: cabinets[2][1],
          height: 200,
          thick: 2,
          op: '+',
          style: {
            transparent: true,
            color: 0x00ff00,
            opacity: 0.2,
          },
        },
        //右
        {
          modelType: 'hole',
          start: cabinets[1][0],
          end: cabinets[1][1],
          height: 200,
          thick: 2,
          op: '+',
          style: {
            transparent: true,
            color: 0x00ff00,
            opacity: 0.2,
          },
        },
        //上
        {
          modelType: 'hole',
          start: cabinets[3][0],
          end: cabinets[3][1],
          height: 2,
          thick: 68,
          op: '+',
          style: {
            transparent: true,
            color: 0x00ff00,
            opacity: 0.2,
          },
        },
        //下
        {
          modelType: 'hole',
          start: cabinets[4][0],
          end: cabinets[4][1],
          height: 2,
          thick: 68,
          op: '+',
          style: {
            transparent: true,
            color: 0x00ff00,
            opacity: 0.2,
          },
        },
        {
          modelType: 'hole',
          start: cabinets[5][0],
          end: cabinets[5][1],
          height: 196,
          thick: 2,
          op: '+',
          style: {
            transparent: true,
            color: 0x00ff00,
            opacity: 0.2,
          },

        },
        {
          modelType: 'box',
          name: 'inner_box',
          start: xyzServer(6)[0],
          end: xyzServer(6)[1],
          height: 10,
          thick: 68,
          style: {
            transparent: true,
            color: 0xff0000,
            opacity: 0.5,
          },
          animation: true
        },


      ]
    },
  ]
}
