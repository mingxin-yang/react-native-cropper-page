import React, { Component } from 'react';
import { ImageEditor, Animated, PanResponder } from 'react-native';
import RNImageRotate from 'react-native-image-rotate';
import PropTypes from 'prop-types';
import { SCREEN_WIDTH, SCREEN_HEIGHT, W, H, Q } from '../components/Cropper/Cropper.constants';
import Cropper from '../components/Cropper/Cropper.component';
import { getCropperLimits } from '../utils';

class CropperPage extends Component {
  constructor(props) {
    super(props);
    const { imageWidth, imageHeight, BORDER_WIDTH } = props;
    const W_INT = W - (2 * BORDER_WIDTH);
    const H_INT = H - (2 * BORDER_WIDTH);
    const {
      TOP_LIMIT,
      LEFT_LIMIT,
      BOTTOM_LIMIT,
      RIGHT_LIMIT,
      DIFF
    } = getCropperLimits(imageWidth, imageHeight, props.initialRotation, W_INT, H_INT, W, H, BORDER_WIDTH, Q);

    const TOP_VALUE = props.TOP_VALUE !== 0 ? props.TOP_VALUE : TOP_LIMIT;
    const LEFT_VALUE = props.LEFT_VALUE !== 0 ? props.LEFT_VALUE : LEFT_LIMIT;
    const BOTTOM_VALUE = props.BOTTOM_VALUE !== 0 ? props.BOTTOM_VALUE : BOTTOM_LIMIT;
    const RIGHT_VALUE = props.RIGHT_VALUE !== 0 ? props.RIGHT_VALUE : RIGHT_LIMIT;

    console.warn(BORDER_WIDTH,TOP_VALUE,BOTTOM_VALUE)

    const topOuterPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: TOP_VALUE - BORDER_WIDTH });
    const topOuterPanResponder = new PanResponder.create({ onStartShouldSetPanResponder: () => false });
    const leftOuterPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: TOP_VALUE - BORDER_WIDTH });
    const leftOuterPanResponder = new PanResponder.create({ onStartShouldSetPanResponder: () => false });
    const bottomOuterPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: SCREEN_HEIGHT - BOTTOM_VALUE });
    const bottomOuterPanResponder = new PanResponder.create({ onStartShouldSetPanResponder: () => false });
    const rightOuterPosition = new Animated.ValueXY({ x: SCREEN_WIDTH - RIGHT_VALUE, y: TOP_VALUE - BORDER_WIDTH });
    const rightOuterPanResponder = new PanResponder.create({ onStartShouldSetPanResponder: () => false });

    const topPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: TOP_VALUE - BORDER_WIDTH });
    const topPanResponder = this.initSidePanResponder('topPosition');
    const leftPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: TOP_VALUE - BORDER_WIDTH });
    const leftPanResponder = this.initSidePanResponder('leftPosition');
    const bottomPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: SCREEN_HEIGHT - BOTTOM_VALUE });
    const bottomPanResponder = this.initSidePanResponder('bottomPosition');
    const rightPosition = new Animated.ValueXY({ x: SCREEN_WIDTH - RIGHT_VALUE, y: TOP_VALUE - BORDER_WIDTH - (DIFF / 2) });
    const rightPanResponder = this.initSidePanResponder('rightPosition');

    const topLeftPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: TOP_VALUE - BORDER_WIDTH });
    const topLeftPanResponder = this.initCornerPanResponder('topPosition', 'leftPosition');
    const bottomLeftPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: SCREEN_HEIGHT - BOTTOM_VALUE });
    const bottomLeftPanResponder = this.initCornerPanResponder('bottomPosition', 'leftPosition');
    const bottomRightPosition = new Animated.ValueXY({ x: SCREEN_WIDTH - RIGHT_VALUE, y: SCREEN_HEIGHT - BOTTOM_VALUE });
    const bottomRightPanResponder = this.initCornerPanResponder('bottomPosition', 'rightPosition');
    const topRightPosition = new Animated.ValueXY({ x: SCREEN_WIDTH - RIGHT_VALUE, y: TOP_VALUE - BORDER_WIDTH });
    const topRightPanResponder = this.initCornerPanResponder('topPosition', 'rightPosition');

    const rectanglePosition = new Animated.ValueXY({ x: LEFT_VALUE, y: TOP_VALUE });
    const rectanglePanResponder = this.initRectanglePanResponder();
    const imagePanResponder = this.imagePanResponder();

    var imageWidthShow = 0 , imageHeightShow = 0 , imageTop = 0, imageLeft = 0;
    console.warn(topLeftPosition.getLayout(),topRightPosition.getLayout())

    if(imageHeight/imageWidth>16/9){
      imageWidthShow = SCREEN_WIDTH - LEFT_VALUE - RIGHT_VALUE
      imageHeightShow = imageHeight * imageWidthShow / imageWidth 
      imageLeft = LEFT_VALUE
      imageTop = TOP_VALUE - (imageHeightShow - SCREEN_HEIGHT + TOP_VALUE + BOTTOM_VALUE)/2
    } else {
      imageHeightShow = SCREEN_HEIGHT - TOP_VALUE - BOTTOM_VALUE
      imageWidthShow = imageWidth * imageHeightShow / imageHeight 
      imageLeft = LEFT_VALUE - (imageWidthShow- SCREEN_WIDTH + LEFT_VALUE + RIGHT_VALUE)/2
      imageTop = TOP_VALUE
    }
    this.cropWidth = SCREEN_WIDTH - LEFT_VALUE - RIGHT_VALUE
    console.warn(imageHeightShow,imageWidthShow)

    this.state = {
      topOuterPosition,
      topOuterPanResponder,
      leftOuterPosition,
      leftOuterPanResponder,
      bottomOuterPosition,
      bottomOuterPanResponder,
      rightOuterPosition,
      rightOuterPanResponder,

      topPosition,
      topPanResponder,
      leftPosition,
      leftPanResponder,
      bottomPosition,
      bottomPanResponder,
      rightPosition,
      rightPanResponder,

      topLeftPosition,
      topLeftPanResponder,
      bottomLeftPosition,
      bottomLeftPanResponder,
      bottomRightPosition,
      bottomRightPanResponder,
      topRightPosition,
      topRightPanResponder,

      rectanglePosition,
      rectanglePanResponder,
      imagePanResponder,

      TOP_LIMIT,
      LEFT_LIMIT,
      BOTTOM_LIMIT,
      RIGHT_LIMIT,

      TOP_VALUE,
      LEFT_VALUE,
      BOTTOM_VALUE,
      RIGHT_VALUE,
      rotation: props.initialRotation,
      image: {
        uri: null,
        width: imageWidthShow,
        height: imageHeightShow,
        x: imageLeft,
        y: imageTop,
      },
      isPinching: false,
      isMoving: false,
      cropIn:false,
    };
    this.isRectangleMoving = false;
    this.initDistance = 0;
    this.initW = 0;
    this.initH = 0;
    this.initX = 0;
    this.initY = 0;
    
  }

  onCancel = () => { this.props.onCancel(); }

  getTopOuterStyle = () => {
    return {
      ...this.state.topOuterPosition.getLayout(),
      top: -this.state.TOP_LIMIT,
      left: this.state.LEFT_LIMIT,
      height: Animated.add(this.state.TOP_LIMIT, this.state.topPosition.y),
      width: W,
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };  
  }

  getLeftOuterStyle = () => {
    return {
      ...this.state.leftOuterPosition.getLayout(),
      top: Animated.add(this.props.BORDER_WIDTH, this.state.topPosition.y),
      left: this.state.LEFT_LIMIT,
      height: Animated.add(
        -this.props.BORDER_WIDTH,
        Animated.add(
          this.state.bottomPosition.y,
          Animated.multiply(-1, this.state.topPosition.y)
        )
      ),
      width: Animated.add(this.props.BORDER_WIDTH - this.state.LEFT_LIMIT, this.state.leftPosition.x),
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };
  }

  getBottomOuterStyle = () => {
    return {
      ...this.state.bottomOuterPosition.getLayout(),
      top: this.state.bottomPosition.y,
      left: this.state.LEFT_LIMIT,
      height: Animated.add(
        SCREEN_HEIGHT,
        Animated.multiply(-1, this.state.bottomPosition.y)
      ),
      width: W,
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };
  }

  getRightOuterStyle = () => {
    return {
      ...this.state.rightOuterPosition.getLayout(),
      top: Animated.add(this.props.BORDER_WIDTH, this.state.topPosition.y),
      left: this.state.rightPosition.x,
      height: Animated.add(
        -this.props.BORDER_WIDTH,
        Animated.add(
          this.state.bottomPosition.y,
          Animated.multiply(-1, this.state.topPosition.y)
        )
      ),
      right: this.state.RIGHT_LIMIT,
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };
  }

  getTopLeftStyle = () => {
    return {
      ...this.state.topLeftPosition.getLayout(),
      top: this.state.topPosition.y,
      left: this.state.leftPosition.x,
      width: this.props.BORDER_WIDTH,
      paddingBottom: this.props.BORDER_WIDTH,
    };
  }

  getBottomLeftStyle = () => {
    return {
      ...this.state.bottomLeftPosition.getLayout(),
      top: this.state.bottomPosition.y,
      left: this.state.leftPosition.x,
      width: this.props.BORDER_WIDTH,
      paddingTop: this.props.BORDER_WIDTH,
    };
  }

  getBottomRightStyle = () => {
    return {
      ...this.state.bottomRightPosition.getLayout(),
      top: this.state.bottomPosition.y,
      left: this.state.rightPosition.x,
      height: this.props.BORDER_WIDTH,
      paddingLeft: this.props.BORDER_WIDTH,
    };
  }

  getTopRightStyle = () => {
    return {
      ...this.state.topRightPosition.getLayout(),
      top: this.state.topPosition.y,
      left: this.state.rightPosition.x,
      height: this.props.BORDER_WIDTH,
      paddingLeft: this.props.BORDER_WIDTH,
    };
  }

  getTopSideStyle = () => {
    return {
      ...this.state.topPosition.getLayout(),
      left: Animated.add(this.props.BORDER_WIDTH, this.state.leftPosition.x),
      width: Animated.add(
        -this.props.BORDER_WIDTH,
        Animated.add(
          this.state.rightPosition.x,
          Animated.multiply(-1, this.state.leftPosition.x)
        )
      ),
      paddingBottom: this.props.BORDER_WIDTH,
    };
  }

  getLeftSideStyle = () => {
    return {
      ...this.state.leftPosition.getLayout(),
      top: Animated.add(this.props.BORDER_WIDTH, this.state.topPosition.y),
      height: Animated.add(
        -this.props.BORDER_WIDTH,
        Animated.add(
          this.state.bottomPosition.y,
          Animated.multiply(-1, this.state.topPosition.y)
        ),
      ),
      paddingLeft: this.props.BORDER_WIDTH,
    };
  }

  getBottomSideStyle = () => {
    return {
      ...this.state.bottomPosition.getLayout(),
      left: Animated.add(this.props.BORDER_WIDTH, this.state.leftPosition.x),
      width: Animated.add(
        -this.props.BORDER_WIDTH,
        Animated.add(
          this.state.rightPosition.x,
          Animated.multiply(-1, this.state.leftPosition.x)
        )
      ),
      paddingTop: this.props.BORDER_WIDTH,
    };
  }

  getRightSideStyle = () => {
    return {
      ...this.state.rightPosition.getLayout(),
      top: Animated.add(this.props.BORDER_WIDTH, this.state.topPosition.y),
      height: Animated.add(
        -this.props.BORDER_WIDTH,
        Animated.add(
          this.state.bottomPosition.y,
          Animated.multiply(-1, this.state.topPosition.y)
        )
      ),
      paddingLeft: this.props.BORDER_WIDTH,
    };
  }

  getRectangleStyle = () => {
    return {
      ...this.state.rectanglePosition.getLayout(),
      top: Animated.add(this.props.BORDER_WIDTH, this.state.topPosition.y),
      left: Animated.add(this.props.BORDER_WIDTH, this.state.leftPosition.x),
      width: Animated.add(
        -this.props.BORDER_WIDTH,
        Animated.add(
          this.state.rightPosition.x,
          Animated.multiply(-1, this.state.leftPosition.x)
        )
      ),
      height: Animated.add(
        -this.props.BORDER_WIDTH,
        Animated.add(
          this.state.bottomPosition.y,
          Animated.multiply(-1, this.state.topPosition.y)
        )
      ),
      zIndex: 3
    };
  }

  getImageStyle = () => {
    const DIFF = this.state.topPosition.y._value - this.state.rightPosition.y._value;
    return {
      width:this.state.image.width,
      height: this.state.image.height,
      position: 'absolute',
      top:this.state.image.y,
      left:this.state.image.x,
      // position: 'absolute',
      // top: this.state.TOP_LIMIT - DIFF,
      // left: this.state.LEFT_LIMIT + DIFF,
      // bottom: this.state.BOTTOM_LIMIT - DIFF,
      // right: this.state.RIGHT_LIMIT + DIFF,
      resizeMode: 'stretch',
      transform: [
        { rotate: `${this.state.rotation.toString()}deg` },
      ],
    };
  }

  isAllowedToMoveTopSide = (gesture) => {
    return this.state.topPosition.y._offset + gesture.dy >= this.state.TOP_LIMIT - this.props.BORDER_WIDTH &&
      this.state.topPosition.y._offset + gesture.dy + this.props.BORDER_WIDTH + 1 < this.state.bottomPosition.y._offset;
  }
  isAllowedToMoveLeftSide = (gesture) => {
    return this.state.leftPosition.x._offset + gesture.dx >= this.state.LEFT_LIMIT - this.props.BORDER_WIDTH &&
      this.state.leftPosition.x._offset + gesture.dx + this.props.BORDER_WIDTH + 1 < this.state.rightPosition.x._offset;
  }
  isAllowedToMoveBottomSide = (gesture) => {
    return this.state.bottomPosition.y._offset + gesture.dy <= SCREEN_HEIGHT - this.state.BOTTOM_LIMIT &&
        this.state.topPosition.y._offset + this.props.BORDER_WIDTH + 1 < this.state.bottomPosition.y._offset + gesture.dy;
  }
  isAllowedToMoveRightSide = (gesture) => {
    return this.state.rightPosition.x._offset + gesture.dx <= SCREEN_WIDTH - this.state.RIGHT_LIMIT &&
        this.state.leftPosition.x._offset + this.props.BORDER_WIDTH + 1 < this.state.rightPosition.x._offset + gesture.dx;
  }

  isAllowedToMove = (position, gesture) => {
    if (position === 'topPosition') { return this.isAllowedToMoveTopSide(gesture); }
    if (position === 'leftPosition') { return this.isAllowedToMoveLeftSide(gesture); }
    if (position === 'bottomPosition') { return this.isAllowedToMoveBottomSide(gesture); }
    if (position === 'rightPosition') { return this.isAllowedToMoveRightSide(gesture); }
  }

  initSidePanResponder = (position) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !this.isRectangleMoving,
      onPanResponderMove: (event, gesture) => {
        if (this.isAllowedToMove(position, gesture)) {
          this.state[position].setValue({ x: gesture.dx, y: gesture.dy });
        }
      },
      onPanResponderRelease: () => {
        // make to not reset position
        this.state.topPosition.flattenOffset();
        this.state.leftPosition.flattenOffset();
        this.state.bottomPosition.flattenOffset();
        this.state.rightPosition.flattenOffset();
      },
      onPanResponderGrant: () => {
        this.state.topPosition.setOffset({
          x: this.state.topPosition.x._value,
          y: this.state.topPosition.y._value
        });
        this.state.leftPosition.setOffset({
          x: this.state.leftPosition.x._value,
          y: this.state.leftPosition.y._value
        });
        this.state.bottomPosition.setOffset({
          x: this.state.bottomPosition.x._value,
          y: this.state.bottomPosition.y._value
        });
        this.state.rightPosition.setOffset({
          x: this.state.rightPosition.x._value,
          y: this.state.rightPosition.y._value
        });

        this.state.topPosition.setValue({ x: 0, y: 0 });
        this.state.leftPosition.setValue({ x: 0, y: 0 });
        this.state.bottomPosition.setValue({ x: 0, y: 0 });
        this.state.rightPosition.setValue({ x: 0, y: 0 });
      }
    });
  }
  // TODO:imagePanResponder
  imagePanResponder = () => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove:this.onMove.bind(this),
      onPanResponderRelease: this.onRelease.bind(this),
      onPanResponderTerminate: this.onRelease.bind(this),
      onPanResponderGrant: () => {
        
      }
    });
  }

  onRelease(e) {
    this.setState({ isPinching: false, isMoving: false });
    this.distance = 0;
  }

  onMove(e, gestureState) {
    e.persist();
    // console.log(e.nativeEvent.touches.length, this.state.image)
    //Pinching
    var x1 = this.state.topRightPosition.x._value
    var x2 = this.state.topLeftPosition.x._value
    var cropWidth = x1 - x2
    var cropHight = this.state.bottomLeftPosition.y._value - this.state.topLeftPosition.y._value
    var minX = this.state.topLeftPosition.x._value - this.state.image.width + cropWidth,
            maxX = this.state.topLeftPosition.x._value,
            minY = this.state.topLeftPosition.y._value - this.state.image.height + cropHight,
            maxY = this.state.topLeftPosition.y._value;
    if (e.nativeEvent.touches.length == 2) {
      let x1 = e.nativeEvent.touches[0].locationX;
      let y1 = e.nativeEvent.touches[0].locationY;
      let x2 = e.nativeEvent.touches[1].locationX;
      let y2 = e.nativeEvent.touches[1].locationY;
      let a = x1 - x2;
      let b = y1 - y2;
      let dist = Math.sqrt(a * a + b * b);

      let info = {};

      if (this.state.isPinching) {
        this.distance = dist - this.initDistance;
        console.log("this.distance",this.distance)
        info.image = {
          ...this.state.image,
          width: this.initW + this.distance,
          height: (this.initW + this.distance) * this.props.imageHeight / this.props.imageWidth
        };
        // this.initDistance = dist

        if (!this.state.cropIn) {
          //Keep the image size >= to crop area
          var new_iw = info.image.width,
            new_ih = info.image.height;
          if ( cropWidth > info.image.width) {
            // console.warn(1)
            new_iw = cropWidth;
            new_ih = (new_iw * this.initH) / this.initW;
          }

          if (cropHight > new_ih) {
            // console.warn(1)
            new_ih = cropHight;
            new_iw = (new_ih * this.initW) / this.initH;
          }

          info.image.width = new_iw;
          info.image.height = new_ih;

          //position
          var x = this.state.image.x;
          var y = this.state.image.y;
          if( x > maxX) x = maxX
          if(y>maxY) y = maxY
          if( x < minX) x = minX
          if(y < minY) y = minY
          info.image.x = x;
          info.image.y = y;
          // console.warn(info,cropWidth,cropHight)

        }
      } else {
        this.initW = this.state.image.width;
        this.initH = this.state.image.height;
        this.initDistance = dist;
        info.isPinching = true;
      }
      this.setState(info);
    } else if (e.nativeEvent.touches.length == 1) {
      //Moving
      if (this.state.isMoving) {
        var x = this.initX + gestureState.dx,
          y = this.initY + gestureState.dy;
          // console.warn(x,y,maxX,maxY)
          if( x > maxX) x = maxX
          if(y>maxY) y = maxY
          if( x < minX) x = minX
          if(y < minY) y = minY
          this.setState({
                  image: {
                    ...this.state.image,
                    x: x,
                    y: y
                  }
                },()=>{
                  console.log("x",this.state.image.x)
                });
      } else {
        this.initX = this.state.image.x;
        this.initY = this.state.image.y;
        this.setState({ isMoving: true });
      }
    }
  }

  initRectanglePanResponder = () => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !this.isRectangleMoving,
      onPanResponderMove: (event, gesture) => {
        this.state.topPosition.setValue({ x: gesture.dx, y: gesture.dy });
        this.state.leftPosition.setValue({ x: gesture.dx, y: gesture.dy });
        this.state.bottomPosition.setValue({ x: gesture.dx, y: gesture.dy });
        this.state.rightPosition.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: () => {
        this.isRectangleMoving = true;
        // make to not reset position
        this.state.topPosition.flattenOffset();
        this.state.leftPosition.flattenOffset();
        this.state.bottomPosition.flattenOffset();
        this.state.rightPosition.flattenOffset();

        const width = this.state.rightPosition.x._value - this.state.leftPosition.x._value - this.props.BORDER_WIDTH;
        const height = this.state.bottomPosition.y._value - this.state.topPosition.y._value - this.props.BORDER_WIDTH;
        let isOutside = false;

        if (this.state.leftPosition.x._value < this.state.LEFT_LIMIT - this.props.BORDER_WIDTH) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.leftPosition.x, { toValue: this.state.LEFT_LIMIT - this.props.BORDER_WIDTH }),
            Animated.spring(this.state.rightPosition.x, { toValue: this.state.LEFT_LIMIT + width })
          ]).start(
            () => { this.isRectangleMoving = false; }
          );
        }
        if (this.state.topPosition.y._value < this.state.TOP_LIMIT - this.props.BORDER_WIDTH) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.topPosition.y, { toValue: this.state.TOP_LIMIT - this.props.BORDER_WIDTH }),
            Animated.spring(this.state.bottomPosition.y, { toValue: this.state.TOP_LIMIT + height })
          ]).start(
            () => { this.isRectangleMoving = false; }
          );
        }
        if (width + this.state.leftPosition.x._value + this.props.BORDER_WIDTH > SCREEN_WIDTH - this.state.RIGHT_LIMIT) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.leftPosition.x, { toValue: SCREEN_WIDTH - this.state.RIGHT_LIMIT - width - this.props.BORDER_WIDTH }),
            Animated.spring(this.state.rightPosition.x, { toValue: SCREEN_WIDTH - this.state.RIGHT_LIMIT })
          ]).start(
            () => { this.isRectangleMoving = false; }
          );
        }
        if (height + this.state.topPosition.y._value + this.props.BORDER_WIDTH > SCREEN_HEIGHT - this.state.BOTTOM_LIMIT) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.topPosition.y, { toValue: SCREEN_HEIGHT - this.state.BOTTOM_LIMIT - height - this.props.BORDER_WIDTH }),
            Animated.spring(this.state.bottomPosition.y, { toValue: SCREEN_HEIGHT - this.state.BOTTOM_LIMIT })
          ]).start(
            () => { this.isRectangleMoving = false; }
          );
        }
        if (!isOutside) {
          this.isRectangleMoving = false;
        }
      },
      onPanResponderGrant: () => {
        this.state.topPosition.setOffset({
          x: this.state.topPosition.x._value,
          y: this.state.topPosition.y._value
        });
        this.state.leftPosition.setOffset({
          x: this.state.leftPosition.x._value,
          y: this.state.leftPosition.y._value
        });
        this.state.bottomPosition.setOffset({
          x: this.state.bottomPosition.x._value,
          y: this.state.bottomPosition.y._value
        });
        this.state.rightPosition.setOffset({
          x: this.state.rightPosition.x._value,
          y: this.state.rightPosition.y._value
        });
        this.state.topPosition.setValue({ x: 0, y: 0 });
        this.state.leftPosition.setValue({ x: 0, y: 0 });
        this.state.bottomPosition.setValue({ x: 0, y: 0 });
        this.state.rightPosition.setValue({ x: 0, y: 0 });
      }
    });
  }

  initCornerPanResponder = (pos1, pos2) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !this.isRectangleMoving,
      onPanResponderMove: (event, gesture) => {
        if (this.isAllowedToMove(pos1, gesture)) {
          this.state[pos1].setValue({ x: gesture.dx, y: gesture.dy });
        }
        if (this.isAllowedToMove(pos2, gesture)) {
          this.state[pos2].setValue({ x: gesture.dx, y: gesture.dy });
        }
      },
      onPanResponderRelease: () => {
        this.state.topPosition.flattenOffset();
        this.state.leftPosition.flattenOffset();
        this.state.bottomPosition.flattenOffset();
        this.state.rightPosition.flattenOffset();
      },
      onPanResponderGrant: () => {
        this.state.topPosition.setOffset({ x: this.state.topPosition.x._value, y: this.state.topPosition.y._value });
        this.state.leftPosition.setOffset({ x: this.state.leftPosition.x._value, y: this.state.leftPosition.y._value });
        this.state.bottomPosition.setOffset({ x: this.state.bottomPosition.x._value, y: this.state.bottomPosition.y._value });
        this.state.rightPosition.setOffset({ x: this.state.rightPosition.x._value, y: this.state.rightPosition.y._value });

        this.state.topPosition.setValue({ x: 0, y: 0 });
        this.state.leftPosition.setValue({ x: 0, y: 0 });
        this.state.bottomPosition.setValue({ x: 0, y: 0 });
        this.state.rightPosition.setValue({ x: 0, y: 0 });
      }
    });
  }

  setCropBoxLimits = ({ TOP_LIMIT, LEFT_LIMIT, BOTTOM_LIMIT, RIGHT_LIMIT }) => {
    this.setState({
      TOP_LIMIT,
      LEFT_LIMIT,
      BOTTOM_LIMIT,
      RIGHT_LIMIT
    });
  }

  setCropBoxValues = ({ TOP_VALUE, LEFT_VALUE, BOTTOM_VALUE, RIGHT_VALUE }) => {
    this.setState({
      TOP_VALUE,
      LEFT_VALUE,
      BOTTOM_VALUE,
      RIGHT_VALUE
    });
  }

  setCropBoxRotation = (rotation) => {
    this.setState({ rotation });
  }

  rotate90 = () => {
    this.setCropBoxRotation((360 + (this.state.rotation - 90)) % 360);
  }

  onRotate = () => {
    // const W_INT = W - (2 * this.props.BORDER_WIDTH);
    // const H_INT = H - (2 * this.props.BORDER_WIDTH);
    // let imageWidth = 0;
    // let imageHeight = 0;
    // let rotation = 0;
    // if (this.state.rotation % 180 === 90) {
    //   imageWidth = this.props.imageWidth > 0 ? this.props.imageWidth : 1280; // 340
    //   imageHeight = this.props.imageHeight > 0 ? this.props.imageHeight : 747; // 500
    //   rotation = 0;
    // } else {
    //   imageWidth = SCREEN_WIDTH - this.state.LEFT_LIMIT - this.state.RIGHT_LIMIT;
    //   imageHeight = SCREEN_HEIGHT - this.state.TOP_LIMIT - this.state.BOTTOM_LIMIT;
    //   rotation = 90;
    // }
    // const {
    //   TOP_LIMIT,
    //   LEFT_LIMIT,
    //   BOTTOM_LIMIT,
    //   RIGHT_LIMIT,
    //   DIFF
    // } = getCropperLimits(imageWidth, imageHeight, rotation, W_INT, H_INT, W, H, this.props.BORDER_WIDTH, Q);
    this.rotate90();
    // this.setCropBoxLimits({ TOP_LIMIT, LEFT_LIMIT, BOTTOM_LIMIT, RIGHT_LIMIT });
    // const startPositionBeforeRotationX = (this.state.leftPosition.x._value - this.state.LEFT_LIMIT) + this.props.BORDER_WIDTH;
    // const startPositionBeforeRotationY = (this.state.topPosition.y._value - this.state.TOP_LIMIT) + this.props.BORDER_WIDTH;
    // const imageWidthBeforeRotation = SCREEN_WIDTH - this.state.RIGHT_LIMIT - this.state.LEFT_LIMIT;
    // const imageHeightBeforeRotation = SCREEN_HEIGHT - this.state.BOTTOM_LIMIT - this.state.TOP_LIMIT;
    // const rectangleWidthBeforeRotation = this.state.rightPosition.x._value - this.state.leftPosition.x._value - this.props.BORDER_WIDTH;
    // const rectangleHeightBeforeRotation = this.state.bottomPosition.y._value - this.state.topPosition.y._value - this.props.BORDER_WIDTH;
    // const imageWidthAfterRotation = SCREEN_WIDTH - RIGHT_LIMIT - LEFT_LIMIT;
    // const imageHeightAfterRotation = SCREEN_HEIGHT - BOTTOM_LIMIT - TOP_LIMIT;
    // const rectangleWidthAfterRotation = (imageWidthAfterRotation * rectangleHeightBeforeRotation) / imageHeightBeforeRotation;
    // const rectangleHeightAfterRotation = (imageHeightAfterRotation * rectangleWidthBeforeRotation) / imageWidthBeforeRotation;
    // const startPositionAfterRotationX = (startPositionBeforeRotationY * imageWidthAfterRotation) / imageHeightBeforeRotation;
    // const startPositionAfterRotationY = (
    //   (imageWidthBeforeRotation - startPositionBeforeRotationX - rectangleWidthBeforeRotation) * imageHeightAfterRotation
    // ) / imageWidthBeforeRotation;

    // this.state.topPosition.setValue({
    //   x: (LEFT_LIMIT + startPositionAfterRotationX) - this.props.BORDER_WIDTH,
    //   y: (TOP_LIMIT + startPositionAfterRotationY) - this.props.BORDER_WIDTH
    // });
    // this.state.leftPosition.setValue({
    //   x: (LEFT_LIMIT + startPositionAfterRotationX) - this.props.BORDER_WIDTH,
    //   y: (TOP_LIMIT + startPositionAfterRotationY) - this.props.BORDER_WIDTH
    // });
    // this.state.bottomPosition.setValue({
    //   x: (LEFT_LIMIT + startPositionAfterRotationX) - this.props.BORDER_WIDTH,
    //   y: TOP_LIMIT + startPositionAfterRotationY + rectangleHeightAfterRotation
    // });
    // this.state.rightPosition.setValue({
    //   x: LEFT_LIMIT + startPositionAfterRotationX + rectangleWidthAfterRotation,
    //   y: (TOP_LIMIT + startPositionAfterRotationY) - this.props.BORDER_WIDTH - (DIFF / 2)
    // });
    // this.topOuter.setNativeProps({ style: { top: TOP_LIMIT, height: 0 } });
    // this.leftOuter.setNativeProps({ style: { left: LEFT_LIMIT, width: 0 } });
    // this.bottomOuter.setNativeProps({ style: { top: BOTTOM_LIMIT, height: 0 } });
    // this.rightOuter.setNativeProps({ style: { top: TOP_LIMIT, height: 0 } });
  }

  onDone = () => {
    if (this.isRectangleMoving) return null;

    //this.setState({ isSaving: true });
    const IMAGE_W = SCREEN_WIDTH - this.state.RIGHT_LIMIT - this.state.LEFT_LIMIT;
    const IMAGE_H = SCREEN_HEIGHT - this.state.BOTTOM_LIMIT - this.state.TOP_LIMIT;
    let x = (this.state.leftPosition.x._value) + this.props.BORDER_WIDTH;
    let y = (this.state.topPosition.y._value) + this.props.BORDER_WIDTH;
    // 裁剪宽高
    let width = this.state.rightPosition.x._value - this.state.leftPosition.x._value - this.props.BORDER_WIDTH;
    let height = this.state.bottomPosition.y._value - this.state.topPosition.y._value - this.props.BORDER_WIDTH;
    // 图片原始宽高
    let imageWidth = this.props.imageWidth > 0 ? this.props.imageWidth : 1280; // 340
    let imageHeight = this.props.imageHeight > 0 ? this.props.imageHeight : 747; // 500
    if (this.state.rotation % 180 === 90) {
      const pivot = imageWidth;
      imageWidth = imageHeight;
      imageHeight = pivot;
    }

    width = imageWidth * width / this.state.image.width
    height = (height * imageHeight) / this.state.image.height;

    x = imageWidth * (x - this.state.image.x) / this.state.image.width;
    console.log(y,this.state.image.y)
    y = (y - this.state.image.y)  * imageHeight / this.state.image.height;

    console.log(x,y)
    // width = (width * imageWidth) / IMAGE_W;
    // height = (height * imageHeight) / IMAGE_H;
    // x = (x * imageWidth) / IMAGE_W;
    // y = (y * imageHeight) / IMAGE_H;
    const cropData = {
      offset: { x, y },
      size: { width, height },
      resizeMode: 'stretch'
    };
    RNImageRotate.rotateImage(
      this.props.imageUri,
      this.state.rotation,
      (rotatedUri) => {
        //
        ImageEditor.cropImage(
          rotatedUri,
          cropData,
          (croppedUri) => {
            this.props.onDone(croppedUri);
          },
          (err) => {
            console.log('cropping error');
            console.log(err);
          }
        );
        //
      },
      (err) => {
        alert(err);
        console.log(err);
      }
    );
  }

  render() {
    return (
      <Cropper
        imageUri={this.props.imageUri} // 'https://3.imimg.com/data3/SN/NO/MY-10244508/vertical-building-parking-500x500.jpg'
        footerComponent={this.props.footerComponent}
        getTopOuterStyle={this.getTopOuterStyle}
        getLeftOuterStyle={this.getLeftOuterStyle}
        getBottomOuterStyle={this.getBottomOuterStyle}
        getRightOuterStyle={this.getRightOuterStyle}
        getTopLeftStyle={this.getTopLeftStyle}
        getBottomLeftStyle={this.getBottomLeftStyle}
        getBottomRightStyle={this.getBottomRightStyle}
        getTopRightStyle={this.getTopRightStyle}
        getTopSideStyle={this.getTopSideStyle}
        getLeftSideStyle={this.getLeftSideStyle}
        getBottomSideStyle={this.getBottomSideStyle}
        getRightSideStyle={this.getRightSideStyle}
        getRectangleStyle={this.getRectangleStyle}
        getImageStyle={this.getImageStyle}
        onDone={this.onDone}
        onRotate={this.onRotate}
        onCancel={this.onCancel}
        topOuterPanResponder={this.state.topOuterPanResponder}
        leftOuterPanResponder={this.state.leftOuterPanResponder}
        bottomOuterPanResponder={this.state.bottomOuterPanResponder}
        rightOuterPanResponder={this.state.rightOuterPanResponder}
        topPanResponder={this.state.topPanResponder}
        leftPanResponder={this.state.leftPanResponder}
        bottomPanResponder={this.state.bottomPanResponder}
        rightPanResponder={this.state.rightPanResponder}
        topLeftPanResponder={this.state.topLeftPanResponder}
        bottomLeftPanResponder={this.state.bottomLeftPanResponder}
        bottomRightPanResponder={this.state.bottomRightPanResponder}
        topRightPanResponder={this.state.topRightPanResponder}
        rectanglePanResponder={this.state.rectanglePanResponder}
        imagePanResponder={this.state.imagePanResponder}
        topOuterRef={ref => { this.topOuter = ref; }}
        leftOuterRef={ref => { this.leftOuter = ref; }}
        bottomOuterRef={ref => { this.bottomOuter = ref; }}
        rightOuterRef={ref => { this.rightOuter = ref; }}
      />
    );
  }
}

CropperPage.propTypes = {
  footerComponent: PropTypes.object,
  onDone: PropTypes.func,
  onCancel: PropTypes.func,
  imageUri: PropTypes.string,
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  TOP_VALUE: PropTypes.number,
  LEFT_VALUE: PropTypes.number,
  BOTTOM_VALUE: PropTypes.number,
  RIGHT_VALUE: PropTypes.number,
  initialRotation: PropTypes.number,
  NOT_SELECTED_AREA_OPACITY: PropTypes.number,
};

export default CropperPage;
