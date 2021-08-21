import React from 'react'
import { StyleSheet, Text, View ,Dimensions} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle,useSharedValue,useAnimatedGestureHandler,withSpring,withTiming,runOnJS} from 'react-native-reanimated';
import {FontAwesome5}from '@expo/vector-icons'

const LIST_ITEM_HEIGHT = 70;

const { width, height } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = -width * 0.3;

const ListItems = (props) => {

    const translateX=useSharedValue(0);
    const itemHeight=useSharedValue(LIST_ITEM_HEIGHT);
    const marginVertical = useSharedValue(10);
    const opacity = useSharedValue(1);

    const panGestureHandler=useAnimatedGestureHandler({
        onStart:(event,context)=>{
            context.x=translateX.value
        
        },
        onActive:(event,context)=>{
            translateX.value=event.translationX+context.x;
        },
        onEnd:()=>{
            const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD;
            if (shouldBeDismissed) {
                translateX.value = withTiming(-width);
                itemHeight.value=withTiming(0);
                marginVertical.value = withTiming(0);
                opacity.value=withTiming(0,undefined,(isFinished) => {
                    if (isFinished && props.onDismiss) {
                      runOnJS(props.onDismiss)(props.title);
                    }
                  })
            }else {

                translateX.value = withTiming(0);
              }
           
        }
    
    });

    const taskStyles=useAnimatedStyle(()=>{
        return {
            transform:[{translateX:translateX.value}]
        }
    })

    const iconStyle=useAnimatedStyle(()=>{

        const opacity=withTiming(translateX.value< TRANSLATE_X_THRESHOLD?1:0) 
        return {
            opacity
        }
    })

    const mainStyle=useAnimatedStyle(()=>{
        return {
            height:itemHeight.value,
            marginVertical:marginVertical.value,
            opacity:opacity.value
        }
    })

    return (
        <Animated.View style={[styles.listContainer,mainStyle]}>
        <Animated.View style={[styles.iconContainer,iconStyle]}>
        <FontAwesome5
          name={'trash-alt'}
          size={LIST_ITEM_HEIGHT * 0.4}
          color={'red'}
        />
        </Animated.View>
        <PanGestureHandler simultaneousHandlers={props.simultaneousHandlers} onGestureEvent={panGestureHandler}>
        <Animated.View style={[styles.task,taskStyles]}>
            <Text style={styles.taskTitle}>{props.title}</Text>
        </Animated.View>
        </PanGestureHandler>
        
        </Animated.View>
    )
}

export default ListItems;

const styles = StyleSheet.create({
    listContainer:{
        width:'100%',
        alignItems:'center',
    },
    task: {
        width: '90%',
        height: LIST_ITEM_HEIGHT,
        justifyContent: 'center',
        paddingLeft: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        // Shadow for iOS
        shadowOpacity: 0.08,
        shadowOffset: {
          width: 0,
          height: 20,
        },
        shadowRadius: 10,
        // Shadow for Android
        elevation: 5,
        justifyContent: 'center',

      },
       taskTitle:{
          fontSize:16,
      },

      iconContainer: {
        height: LIST_ITEM_HEIGHT,
        width: LIST_ITEM_HEIGHT,
        position: 'absolute',
        right: '10%',
        justifyContent: 'center',
        alignItems: 'center',
      },
})
