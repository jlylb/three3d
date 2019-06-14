const doorLeftJpg = require('../assets/door_left.png')
const doorRightJpg = require('../assets/door_right.png')
const doorControlJpg = require('../assets/doorControl.jpg')

export default {
  show: true,
  uuid: '',
  name: 'wall',
  objType: 'wall',
  thick: 20,
  length: 100,
  height: 240,
  wallData: [
    {
      //wall1
      uuid: '',
      name: 'wall1',
      thick: 20,
      height: 240,
      skin: {
        left: {
          skinColor: 0xdddddd
        },
        right: {
          skinColor: 0xdddddd
        },
        up: {
          skinColor: 0xb0cee0
        },
        down: {
          skinColor: 0xb0cee0
        },
        after: {
          skinColor: 0xdeeeee
        },
        before: {
          skinColor: 0xb0cee0
        }
      },
      startDot: {
        x: -500,
        y: 120,
        z: -350
      },
      endDot: {
        x: 500,
        y: 120,
        z: -350
      },
      rotation: [{ direction: 'x', degree: 0 }], //旋转 表示x方向0度  arb表示任意参数值[x,y,z,angle]
      childrens: [
        {
          op: '-',
          show: true,
          uuid: '',
          name: 'doorhole',
          objType: 'doorhole',
          thick: 20,
          height: 220,
          startDot: {
            x: -410,
            y: 110,
            z: -350
          },
          endDot: {
            x: -190,
            y: 110,
            z: -350
          },
          skin: {
            left: {
              skinColor: 0xffdddd
            },
            right: {
              skinColor: 0xdddddd
            },
            up: {
              skinColor: 0xffdddd
            },
            down: {
              skinColor: 0xffdddd
            },
            after: {
              skinColor: 0xffdddd
            },
            before: {
              skinColor: 0xffdddd
            }
          }
        },
        {
          op: '-',
          show: true,
          uuid: '',
          name: 'windowHole',
          objType: 'windowHole',
          thick: 20,
          height: 160,
          startDot: {
            x: -50,
            y: 130,
            z: -350
          },
          endDot: {
            x: 450,
            y: 130,
            z: -350
          }
        },
        {
          show: true,
          name: 'windowCaseBottom',
          uuid: '',
          objType: 'cube',
          thick: 30,
          height: 10,
          startDot: {
            x: -50,
            y: 50,
            z: -350
          },
          endDot: {
            x: 450,
            y: 50,
            z: -350
          },
          skin: {
            left: {
              skinColor: 0xc0dee0
            },
            right: {
              skinColor: 0xc0dee0
            },
            up: {
              skinColor: 0xc0dee0
            },
            down: {
              skinColor: 0xc0dee0
            },
            after: {
              skinColor: 0xd0eef0
            },
            before: {
              skinColor: 0xd0eef0
            }
          }
        },

        {
          show: true,
          uuid: '',
          name: 'doorCaseRight',
          objType: 'cube',
          thick: 24,
          height: 220,
          startDot: {
            x: -410,
            y: 110,
            z: -350
          },
          endDot: {
            x: -405,
            y: 110,
            z: -350
          },
          skin: {
            left: {
              skinColor: 0xc0dee0
            },
            right: {
              skinColor: 0xc0dee0
            },
            up: {
              skinColor: 0xc0dee0
            },
            down: {
              skinColor: 0xc0dee0
            },
            after: {
              skinColor: 0xd0eef0
            },
            before: {
              skinColor: 0xd0eef0
            }
          }
        },
        {
          show: true,
          name: 'doorCaseLeft',
          uuid: '',
          objType: 'cube',
          thick: 24,
          height: 220,
          startDot: {
            x: -190,
            y: 110,
            z: -350
          },
          endDot: {
            x: -195,
            y: 110,
            z: -350
          },
          skin: {
            left: {
              skinColor: 0xc0dee0
            },
            right: {
              skinColor: 0xc0dee0
            },
            up: {
              skinColor: 0xc0dee0
            },
            down: {
              skinColor: 0xc0dee0
            },
            after: {
              skinColor: 0xd0eef0
            },
            before: {
              skinColor: 0xd0eef0
            }
          }
        },
        {
          show: true,
          name: 'doorCaseTop',
          uuid: '',
          objType: 'cube',
          thick: 24,
          height: 5,
          startDot: {
            x: -190,
            y: 220,
            z: -350
          },
          endDot: {
            x: -410,
            y: 220,
            z: -350
          },
          skin: {
            left: {
              skinColor: 0xc0dee0
            },
            right: {
              skinColor: 0xc0dee0
            },
            up: {
              skinColor: 0xc0dee0
            },
            down: {
              skinColor: 0xc0dee0
            },
            after: {
              skinColor: 0xd0eef0
            },
            before: {
              skinColor: 0xd0eef0
            }
          }
        },
        {
          show: true,
          name: 'doorCaseBottom',
          uuid: '',
          objType: 'cube',
          thick: 24,
          height: 5,
          startDot: {
            x: -190,
            y: 5,
            z: -350
          },
          endDot: {
            x: -410,
            y: 5,
            z: -350
          },
          skin: {
            left: {
              skinColor: 0xc0dee0
            },
            right: {
              skinColor: 0xc0dee0
            },
            up: {
              skinColor: 0xc0dee0
            },
            down: {
              skinColor: 0xc0dee0
            },
            after: {
              skinColor: 0xd0eef0
            },
            before: {
              skinColor: 0xd0eef0
            }
          }
        },
        {
          show: true,
          name: 'doorLeft',
          uuid: '',
          objType: 'cube',
          thick: 4,
          height: 210,
          startDot: {
            x: -196,
            y: 112,
            z: -350
          },
          endDot: {
            x: -300,
            y: 112,
            z: -350
          },
          skin: {
            opacity: 0.1,
            up: {
              skinColor: 0x51443e
            },
            down: {
              skinColor: 0x51443e
            },
            before: {
              skinColor: 0x51443e,
              imgurl: doorLeftJpg
            },
            after: {
              skinColor: 0x51443e,
              imgurl: doorRightJpg
            },
            left: {
              skinColor: 0x51443e
              //imgurl: doorLeftJpg
            },
            right: {
              skinColor: 0x51443e
              //imgurl: doorRightJpg
            }
          }
        },
        {
          show: true,
          name: 'doorRight',
          uuid: '',
          objType: 'cube',
          thick: 4,
          height: 210,
          startDot: {
            x: -300,
            y: 112,
            z: -350
          },
          endDot: {
            x: -404,
            y: 112,
            z: -350
          },
          skin: {
            opacity: 0.1,
            up: {
              skinColor: 0x51443e
            },
            down: {
              skinColor: 0x51443e
            },
            before: {
              skinColor: 0x51443e,
              imgurl: doorRightJpg
            },
            after: {
              skinColor: 0x51443e,
              imgurl: doorLeftJpg
            },
            left: {
              skinColor: 0x51443e
            },
            right: {
              skinColor: 0x51443e
            }
          }
        },
        {
          show: true,
          name: 'doorControl',
          uuid: '',
          objType: 'cube',
          thick: 10,
          height: 40,
          startDot: {
            x: -120,
            y: 160,
            z: -365
          },
          endDot: {
            x: -160,
            y: 160,
            z: -365
          },
          skin: {
            opacity: 0.1,
            up: {
              skinColor: 0x333333
            },
            down: {
              skinColor: 0x333333
            },
            before: {
              skinColor: 0x333333,
              imgurl: doorControlJpg
            },
            after: {
              skinColor: 0x333333
            },
            left: {
              skinColor: 0x333333
            },
            right: {
              skinColor: 0x333333
            }
          }
        }
      ]
    },
    {
      //wall2
      uuid: '',
      name: 'wall2',
      thick: 20,
      height: 240,
      skin: {
        up: {
          skinColor: 0xdddddd
        },
        down: {
          skinColor: 0xdddddd
        },
        before: {
          skinColor: 0xb0cee0
        },
        after: {
          skinColor: 0xb0cee0
        },
        left: {
          skinColor: 0xb0cee0
        },
        right: {
          skinColor: 0xdeeeee
        }
      },
      startDot: {
        x: -500,
        y: 120,
        z: 450
      },
      endDot: {
        x: 500,
        y: 120,
        z: 450
      }
    },
    {
      //wall3
      uuid: '',
      name: 'wall3',
      thick: 20,
      height: 240,
      skin: {
        up: {
          skinColor: 0xdddddd
        },
        down: {
          skinColor: 0xdddddd
        },
        before: {
          skinColor: 0xb0cee0
        },
        after: {
          skinColor: 0xdeeeee
        },
        left: {
          skinColor: 0xb0cee0
        },
        right: {
          skinColor: 0xb0cee0
        }
      },
      startDot: {
        x: 490,
        y: 120,
        z: -355
      },
      endDot: {
        x: 490,
        y: 120,
        z: 455
      }
    },
    {
      //wall4
      uuid: '',
      name: 'wall4',
      thick: 20,
      height: 240,
      skin: {
        up: {
          skinColor: 0xdddddd
        },
        down: {
          skinColor: 0xdddddd
        },
        before: {
          skinColor: 0xdeeeee
        },
        after: {
          skinColor: 0xb0cee0
        },
        left: {
          skinColor: 0xb0cee0
        },
        right: {
          skinColor: 0xb0cee0
        }
      },
      startDot: {
        x: -490,
        y: 120,
        z: -355
      },
      endDot: {
        x: -490,
        y: 120,
        z: 455
      }
    }
  ],
  style: {
    skinColor: 0x8ac9e2
  }
}
