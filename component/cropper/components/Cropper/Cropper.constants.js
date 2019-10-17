import { Dimensions } from 'react-native';
import * as actions from '../../../../until.js';
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const Q = 0; // buttons container height
export const H = SCREEN_HEIGHT - Q;
export const W = SCREEN_WIDTH;
