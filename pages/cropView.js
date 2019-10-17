import React, { Component } from "react";
import {
  Platform,
  ImageStore,
  StyleSheet,
  View,
  Image,
  Button,
  TouchableOpacity,
  Text,
} from "react-native";
import AmazingCropper from "react-native-amazing-cropper";
import ImageEdit from "react-native-imageedit";
import {Header} from 'react-navigation'
import ImageCropper from "react-native-simple-image-cropper";
import CropperPage from "../component/cropper/pages/Cropper.page.js";
import DefaultFooter from "../component/cropper/components/Footer/DefaultFooter.component";
import * as action from "../until";
let Dimensions = require("Dimensions");
let screenWidth = Dimensions.get("window").width;
let screenHeight = Dimensions.get("window").height;
const window = Dimensions.get("window");
const w = window.width;

const CROP_AREA_WIDTH = w;
const CROP_AREA_HEIGHT = w;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },

  imagePreview: {
    width: 100,
    height: 100
  }
});
export default class CropView extends React.Component {
  constructor(props) {
    super(props);
    this.tempPhotos = [];
    this.isUploadDone = true;
    const { navigation } = this.props;
    var data = navigation.getParam("data", null);
    this.state = {
      data: data,
      cropperParams: {},
      croppedImage: data.uri
    };
    console.warn(data);
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerStyle: {
        backgroundColor: "#F5618E",
        marginTop: action.getStatusBarHight()
      },
      headerRight: (
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity
            style={{ backgroundColor: "transparent" }}
            activeOpacity={0.7}
            onPress={() => params.onRotate()}
          >
            <Text
              style={{
                height: 44,
                lineHeight: 44,
                color: "white",
                marginRight: 12,
                fontSize: 18
              }}
            >
              旋转
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "transparent" }}
            activeOpacity={0.7}
            onPress={() => params.onDone()}
          >
            <Text
              style={{
                height: 44,
                lineHeight: 44,
                color: "white",
                marginRight: 12,
                fontSize: 18
              }}
            >
              裁剪
            </Text>
          </TouchableOpacity>
        </View>
      ),
      headerTintColor: "#fff"
    };
  };

  componentDidMount(){
    this.props.navigation.setParams({
      onDone: this.cropper.onDone.bind(this),
      onRotate: this.cropper.onRotate.bind(this),
    });
  }

  setCropperParams = cropperParams => {
    this.setState(prevState => ({
      ...prevState,
      cropperParams
    }));
  };

  handlePress = async () => {
    const { cropperParams } = this.state;
    alert(1);
    const cropSize = {
      width: 200,
      height: 200
    };

    const cropAreaSize = {
      width: CROP_AREA_WIDTH,
      height: CROP_AREA_HEIGHT
    };

    try {
      const result = await ImageCropper.crop({
        ...cropperParams,
        imageUri: this.state.data.uri,
        cropSize,
        cropAreaSize
      });
      this.setState(prevState => ({
        ...prevState,
        croppedImage: result
      }));
    } catch (error) {
      console.warn(error);
    }
  };

  _onDone = croppedImageUri => {
    if (Platform.OS === "ios") {
    } else {
      // send image to server
    }
    // navigate to the next page of your application
    console.log("croppedImageUri");
    this.props.navigation.state.params.responseCropData(croppedImageUri);
    this.props.navigation.goBack();
  };

  onCancel = () => {
    // navigate back
  };

  render() {
    const { croppedImage } = this.state;
    const src = { uri: croppedImage };
    const leftRight = 80
    const TopBottom = (screenHeight - ((screenWidth - leftRight * 2) * 16 / 9) - Header.HEIGHT - action.getStatusBarHight()) / 2
    return (
      // <View style={styles.container}>
      //   <ImageCropper
      //     imageUri={this.state.data.uri}
      //     cropAreaWidth={CROP_AREA_WIDTH}
      //     cropAreaHeight={CROP_AREA_HEIGHT}
      //     setCropperParams={this.setCropperParams}
      //   />
      //   <Button onPress={()=>{this.handlePress()}} title="Crop Image" color="blue" />
      //   {croppedImage ? (
      //     <Image style={styles.imagePreview} source={src} />
      //   ) : null}
      //

      // </View>
      <CropperPage
        ref={(cropper)=>this.cropper = cropper}
        onDone={uri => this._onDone(uri)}
        onCancel={() => alert("onCancel")}
        imageUri={this.state.data.uri}
        imageWidth={this.state.data.width}
        imageHeight={this.state.data.height}
        TOP_VALUE={TopBottom}
        LEFT_VALUE={leftRight}
        BOTTOM_VALUE={TopBottom+Header.HEIGHT+action.getStatusBarHight()}
        RIGHT_VALUE={leftRight}
        initialRotation={0}
        NOT_SELECTED_AREA_OPACITY={0.3}
        BORDER_WIDTH={0}
      />
      // <ImageEdit
      //   width={CROP_AREA_WIDTH} //Crop area width
      //   height={CROP_AREA_HEIGHT} //Crop area height
      //   gridColor="red"
      //   editing={true}
      //   image={{
      //           uri :this.state.data.uri,
      //           width: this.state.data.width,
      //           height: this.state.data.height
      //           }}
      //   onSave={info => console.log(info)}
      // />

      // <AmazingCropper
      //   onDone={this.onDone}
      //   onCancel={this.onCancel}
      //   LEFT_VALUE={(screenWidth-screenWidth*0.8)/2}
      //   TOP_VALUE={0}
      //   BOTTOM_VALUE={((screenWidth-screenWidth*0.8)*16/9)}
      //   RIGHT_VALUE={(screenWidth-screenWidth*0.8)/2}
      //   imageUri={this.state.data.uri}
      //   imageWidth={this.state.data.width}
      //   imageHeight={this.state.data.height}
      //   NOT_SELECTED_AREA_OPACITY={0.5}
      //   BORDER_WIDTH={0}
      // />
    );
  }
}
