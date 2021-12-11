import React,{useEffect,useState} from 'react';
import { StyleSheet,ScrollView } from 'react-native';

import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Text,BottomSheet, ListItem,Button,SearchBar,Card,Icon } from 'react-native-elements';
import UrlBase from '../middleware/UrlBase';
import {
  LineChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [isVisible, setIsVisible] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [datos, setdatos] = useState({
    labels:[],
    datasets:[{
      data:[],
      strokeWidth:'0'
    }],
    valor:''
  })
  const [estadoLineChart, setestadoLineChart] = useState(false);
  const [cedula, setcedula] = useState('')
  const [id, setid] = useState('')
  const [paciente, setpaciente] = useState('')
  const [pulso, setpulso] = useState('')
  const [buscador, setbuscador] = useState('')
  const screenWidth = Dimensions.get("window").width;
  const [estado_pulso, setestado_pulso] = useState('')

  
  async function listadoPaciente(x){
    try {
      const response= await fetch(UrlBase+"/pacientes?cedula="+x);
      const json=await response.json();
      setData(json);
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
}

const buscarPersonaXcedula=async(e)=>{
  setbuscador(e)
  listadoPaciente(e);
}

async function selecionarPacienete(params:Object) {
  setid(params.id)
  setcedula(params.cedula)
  setpaciente(params.apellidos+' '+params.nombres)
  setIsVisible(false)
}

async function obtenerPulsos() {
  try {
   const response = await fetch(UrlBase+"/pulsos");
   const json = await response.json();
    setdatos(json);
    setpulso(Number.parseFloat(json.valor).toFixed(2))
    
    switch (json.estado) {
      case '0':
        setestado_pulso('Normal')
        break;
      case '1':
        setestado_pulso('Falso positivo')
        break;
      case '2':
        setestado_pulso('Taquicardia')
        break;
      case '3':
        setestado_pulso('Falso negativo')
        break;
      case '4':
        setestado_pulso('Bradicardia')
        break;
      default:
        setestado_pulso('N/A')
        break;
    }
    
    if(id!='' && pulso!=json.valor){
      console.log('ok puede enviar otro ',pulso, json.valor)
      await guardarHistorial();
    }
   
 } catch (error) {
   console.error(error);
 } finally {
  setestadoLineChart(true);
 }
}


const guardarHistorial=async()=>{
  try {
    
    const response= await fetch(UrlBase+"/historial-guardar", {
     method: 'POST',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       id,
       pulso,
       estado_pulso
     })
   });
   const json=await response.json();
   console.log(json)
   if(json.errors){
    console.log(json.errors)  
   }
   
  } catch (error) {
    console.log(error)
  }finally{
  }
}


  useEffect(() => {
    listadoPaciente(buscador);
   // obtenerPulsos();
    const interval = setInterval(() => {
    obtenerPulsos();

    }, 1000);
    return () => clearInterval(interval);
    

  }, [id,pulso,estado_pulso,datos]);


  return (
    <View style={styles.container}>
      <ScrollView>
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
        >
          
          <SearchBar
            placeholder="Buscar por cédula..."
            onChangeText={buscarPersonaXcedula}
            value={buscador}
          />
            {
            data.map((l, i) => (
              <ListItem key={i} bottomDivider onPress={()=>selecionarPacienete(l)}>
                <ListItem.Content>
                  <ListItem.Title>{l.cedula}</ListItem.Title>
                  <ListItem.Subtitle>{l.apellidos} {l.nombres}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            ))
          }
          <ListItem key="x" containerStyle={{ backgroundColor:'red' }} onPress={()=>setIsVisible(false)}>
            <ListItem.Content>
              <ListItem.Title style={{ color:'white' }}>Cancelar</ListItem.Title>
            </ListItem.Content>
          </ListItem>
      </BottomSheet>
      </ScrollView>
      <ScrollView>

      <Text style={styles.title}>Selecionar paciente</Text>

      <Card containerStyle={{ padding:5,width:'100%' }}>
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
        
      </Card>
      {
        estadoLineChart===true?
        <LineChart
          data={datos}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          chartConfig={chartConfig}
          style={{
            marginVertical: 1,
            borderRadius: 1
          }}
          // withDots={false}
          // withShadow={false}
          withInnerLines={false}
          // withOuterLines={false}
          // withVerticalLines={false}
          // withHorizontalLines={false}
          withVerticalLabels={false}
          // withHorizontalLabels={false}
          
        />:
      <></>
      }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

const chartConfig = {
  backgroundColor: "#000",
  strokeWidth:0.5,
  backgroundGradientFrom: "#0e354ccc",
  backgroundGradientTo: "#0e354ccc",
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, 1)`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 1
  },
  propsForDots: {
    r: "",
    strokeWidth: "0.1",
    stroke: "#00B74A"
  }
};