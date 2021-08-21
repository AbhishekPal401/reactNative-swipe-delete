import React ,{useState,useRef,useCallback}from 'react';
import { StyleSheet, Text,SafeAreaView } from 'react-native';
import ListItems from './Components/ListItems';
import {ScrollView} from 'react-native-gesture-handler';

const TITLES = [
  'Record the dismissible tutorial',
  'Leave to the video',
  'Check YouTube comments',
  'Subscribe to the channel ',
  'Leave a  on the GitHub Repo',
  'random shit',
  'random shit',
  'random shit',
  'random shit',
  'random shit',

];

const BACKGROUND_COLOR = '#FAFBFF';
export default function App() {
const[tasks,setTasks]=useState(TITLES);

const onDismiss = useCallback((title) =>  setTasks(prevTask => prevTask.filter(task => task !== title) ), []);

  const scrollRef = useRef(null);
 

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      <ScrollView style={{ flex: 1 }} ref={scrollRef} >
        {TITLES.map((item,index) =>{
          return <ListItems key={index}  index={index} title={item} onDismiss={onDismiss} simultaneousHandlers={scrollRef} />
        })}
      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    
  },
  title: {
    fontSize: 60,
    marginVertical: 20,
    paddingLeft: '5%',
  },
});
