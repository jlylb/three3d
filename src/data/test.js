export default {
    models: [
        {
            
            name: 'floor',
            modelType: 'floor',
            size: [2000, 10, 1600], // x y z
            rotation: [0,0,0],
            position: [0,0,0],
            visible: true,
            style: {
                color: 0x8ac9e2,
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
                }
            },
            childrens: [

            ]
        },
    ]
}