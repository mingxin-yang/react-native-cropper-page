import React from 'react';
import { View, Animated, Image } from 'react-native';
import PropTypes from 'prop-types';
import styles from './Cropper.component.style';
import DefaultFooter from '../Footer/DefaultFooter.component';

const Cropper = (props) => (
  <View style={styles.container}>
    <View style={styles.secondContainer} {...props.imagePanResponder.panHandlers}>
      <Animated.Image
        style={props.getImageStyle()}
        source={{ uri: props.imageUri }}
      />
      <Animated.View
      ref={props.topOuterRef}
      style={[styles.animation, props.getTopOuterStyle()]}
      // {...props.topOuterPanResponder.panHandlers}
    />
    <Animated.View
      ref={props.leftOuterRef}
      style={[styles.animation, props.getLeftOuterStyle()]}
      // {...props.leftOuterPanResponder.panHandlers}
    />
    <Animated.View
      ref={props.bottomOuterRef}
      style={[styles.animation, props.getBottomOuterStyle()]}
      // {...props.bottomOuterPanResponder.panHandlers}
    />
    <Animated.View
      ref={props.rightOuterRef}
      style={[styles.animation, props.getRightOuterStyle()]}
      // {...props.rightOuterPanResponder.panHandlers}
    />

    <Animated.View
      style={[styles.animation, styles.topSideAnimation, props.getTopSideStyle()]}
      // {...props.topPanResponder.panHandlers}
    />
    <Animated.View
      style={[styles.animation, styles.leftSideAnimation, props.getLeftSideStyle()]}
      // {...props.leftPanResponder.panHandlers}
    />
    <Animated.View
      style={[styles.animation, styles.bottomSideAnimation, props.getBottomSideStyle()]}
      // {...props.bottomPanResponder.panHandlers}
    />
    <Animated.View
      style={[styles.animation, styles.rightSideAnimation, props.getRightSideStyle()]}
      // {...props.rightPanResponder.panHandlers}
    />

    <Animated.View
      style={[styles.animation, styles.topLeftAnimation, props.getTopLeftStyle()]}
      // {...props.topLeftPanResponder.panHandlers}
    />
    <Animated.View
      style={[styles.animation, styles.bottomLeftAnimation, props.getBottomLeftStyle()]}
      // {...props.bottomLeftPanResponder.panHandlers}
    />
    <Animated.View
      style={[styles.animation, styles.bottomRightAnimation, props.getBottomRightStyle()]}
      // {...props.bottomRightPanResponder.panHandlers}
    />
    <Animated.View
      style={[styles.animation, styles.topRightAnimation, props.getTopRightStyle()]}
      // {...props.topRightPanResponder.panHandlers}
    />

    <Animated.View
      style={[styles.animation, props.getRectangleStyle()]}

    >
      <View style={styles.gridRow} >
        <View style={styles.gridColumn}>
          <View style={[styles.borderDesign, { borderLeftWidth: 0, borderTopWidth: 0 }]} />
        </View>
        <View style={styles.gridColumn}>
          <View style={[styles.borderDesign, { borderTopWidth: 0, alignSelf: 'center' }]} />
        </View>
        <View style={styles.gridColumn}>
          <View style={[styles.borderDesign, { borderTopWidth: 0, borderRightWidth: 0, alignSelf: 'flex-end' }]} />
        </View>
      </View>

      <View style={styles.gridRow} >
        <View style={[styles.gridColumn, { flexDirection: 'row' }]}>
          <View style={[styles.borderDesign, { borderLeftWidth: 0, alignSelf: 'center' }]} />
        </View>
        <View style={styles.gridColumn} />
        <View style={[styles.gridColumn, { justifyContent: 'center' }]}>
          <View style={[styles.borderDesign, { borderRightWidth: 0, alignSelf: 'flex-end' }]} />
        </View>
      </View>

      <View style={[styles.gridRow]} >
        <View style={[styles.gridColumn,{ justifyContent: 'flex-end' }]}>
          <View style={[styles.borderDesign, { borderLeftWidth: 0, borderBottomWidth: 0 }]} />
        </View>
        <View style={[styles.gridColumn, { justifyContent: 'flex-end' }]}>
          <View style={[styles.borderDesign, { borderBottomWidth:0, alignSelf: 'center' }]} />
        </View>
        <View style={[styles.gridColumn, { justifyContent: 'flex-end' }]}>
          <View style={[styles.borderDesign, { borderRightWidth: 0, borderBottomWidth: 0, alignSelf: 'flex-end' }]} />
        </View>
      </View>
    </Animated.View>
    </View>

  <View style={styles.footerContainer}>
      {props.footerComponent &&
        React.cloneElement(
          props.footerComponent,
          {
            onDone: props.onDone,
            onRotate: props.onRotate,
            onCancel: props.onCancel
          }
        )
      }
    </View>

    
  </View>
)

Cropper.propTypes = {
  imageUri: PropTypes.string,
  footerComponent: PropTypes.object,
  getTopOuterStyle: PropTypes.func,
  getLeftOuterStyle: PropTypes.func,
  getBottomOuterStyle: PropTypes.func,
  getRightOuterStyle: PropTypes.func,
  getTopLeftStyle: PropTypes.func,
  getBottomLeftStyle: PropTypes.func,
  getBottomRightStyle: PropTypes.func,
  getTopRightStyle: PropTypes.func,
  getTopSideStyle: PropTypes.func,
  getLeftSideStyle: PropTypes.func,
  getBottomSideStyle: PropTypes.func,
  getRightSideStyle: PropTypes.func,
  getRectangleStyle: PropTypes.func,
  getImageStyle: PropTypes.func,
  onDone: PropTypes.func,
  onRotate: PropTypes.func,
  onCancel: PropTypes.func,
  topOuterPanResponder: PropTypes.object,
  leftOuterPanResponder: PropTypes.object,
  bottomOuterPanResponder: PropTypes.object,
  rightOuterPanResponder: PropTypes.object,
  topPanResponder: PropTypes.object,
  leftPanResponder: PropTypes.object,
  bottomPanResponder: PropTypes.object,
  rightPanResponder: PropTypes.object,
  topLeftPanResponder: PropTypes.object,
  bottomLeftPanResponder: PropTypes.object,
  bottomRightPanResponder: PropTypes.object,
  topRightPanResponder: PropTypes.object,
  rectanglePanResponder: PropTypes.object,
  imagePanResponder: PropTypes.object,
  topOuterRef: PropTypes.func,
  leftOuterRef: PropTypes.func,
  bottomOuterRef: PropTypes.func,
  rightOuterRef: PropTypes.func,
};

export default Cropper;
