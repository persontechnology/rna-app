import React,{useEffect,useState} from 'react';
import { StyleSheet,ScrollView } from 'react-native';

import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Text,BottomSheet, ListItem,Button,SearchBar,Card,Icon } from 'react-native-elements';

import {
  LineChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";


import Constants from 'expo-constants';
import { Divider } from 'react-native-elements';
import Grafica from './Grafica';
import UrlBase from '../middleware/UrlBase';


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [isVisible, setIsVisible] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
 

  const [cedula, setcedula] = useState('')
  const [id, setid] = useState('')
  const [paciente, setpaciente] = useState('')
  const [pulso, setpulso] = useState('')
  const [buscador, setbuscador] = useState('')
  const screenWidth = Dimensions.get("window").width;
  const [estado_pulso, setestado_pulso] = useState('')
  

  const buscarPersonaXcedula=async(e)=>{
    setbuscador(e)
    listadoPaciente(e);
  }

  async function listadoPaciente(x){
    try {
      const response= await fetch(UrlBase+"api/pacientes?cedula="+x,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json=await response.json();
      setData(json);
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
}

async function obtenerPulsos() {
  try {
   const response = await fetch(UrlBase+"api/pulsos",{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
   });
   const json = await response.json();

   console.log(json)
   setpulso(Number.parseFloat(json.valor).toFixed(2))
   switch (json.estado) {
    case '0':
      setestado_pulso('Normal')
      break;
    case '2':
      setestado_pulso('Normal')
      break;
    case '1':
      setestado_pulso('Falso positivo')
      break;
    case '3':
      setestado_pulso('Taquicardia')
      break;
    case '4':
      setestado_pulso('Bradicardia')
      break;
  }
    if(id!='' && pulso!=json.valor){
            await guardarHistorial();
          }

 } catch (error) {
   console.error(error);
 } finally {
  
 }
}
async function selecionarPacienete(params:Object) {
  setid(params.id)
  setcedula(params.cedula)
  setpaciente(params.apellidos+' '+params.nombres)
  setIsVisible(false)
}

async function quitarPacienete() {
  setid('')
  setcedula('')
  setpaciente('')
}
const guardarHistorial=async()=>{
  try {
    
    const response= await fetch(UrlBase+"api/historial-guardar", {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       id,
       pulso,
       estado_pulso
     })
   });
   
  } catch (error) {
    console.log(error)
  }finally{
  }
}


  useEffect(() => {
    listadoPaciente(buscador);
    const interval = setInterval( () => {
     obtenerPulsos();
    }, 2000);
    return () => clearInterval(interval);
    

  }, [id,pulso,estado_pulso]);


  return (
    <>
    
    <View style={{ flex:1 }}>
    <ScrollView>
    <Card>
      <Card.Title>
        <Text h1>Pulso: {pulso}</Text>
      </Card.Title>
      <Card.Title>
        <Text h3>Estado: {estado_pulso}</Text>
      </Card.Title>
        <Text style={{marginBottom: 5,alignItems:'center', justifyContent:'center'}}>
          Paciente: {paciente}
        </Text>
        <Text style={{marginBottom: 5,alignItems:'center', justifyContent:'center'}}>
          Cédula: {cedula}
        </Text>
        
        <Button
          icon={<Icon name='person-search' color='#ffffff' />}
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title='Buscar paciente'
          onPress={()=>setIsVisible(true)}
          />
          {
            id!=''?
            <Button
          icon={<Icon name='delete' color='#ffffff' />}
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,backgroundColor:'red'}}
          title='Quitar paciente'
          titleStyle={{ color:'#fff' }}
          type="outline"
          onPress={()=>quitarPacienete()}
          />:
          <></>
          }
          
    </Card>
    <BottomSheet
          isVisible={isVisible}
          containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
          >
            
            <SearchBar
              placeholder="Buscar por cédula..."
              onChangeText={buscarPersonaXcedula}
              value={buscador}
            />
              {data.length>0?
              data.map((l, i) => (
                <ListItem key={i} bottomDivider onPress={()=>selecionarPacienete(l)}>
                  <ListItem.Content>
                    <ListItem.Title>{l.cedula}</ListItem.Title>
                    <ListItem.Subtitle>{l.apellidos} {l.nombres}</ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))
              :<></>
            }
            <ListItem key="x" containerStyle={{ backgroundColor:'red' }} onPress={()=>setIsVisible(false)}>
              <ListItem.Content>
                <ListItem.Title style={{ color:'white' }}>Cancelar</ListItem.Title>
              </ListItem.Content>
            </ListItem>
        </BottomSheet>
    <Grafica/>  
   </ScrollView>
   </View>
    </>
  );
}


