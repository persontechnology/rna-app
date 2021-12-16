import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import { Platform, StyleSheet,View,ScrollView,Alert } from 'react-native';
import { ListItem, Avatar,BottomSheet,Button,Icon,SearchBar,Text } from 'react-native-elements'
import UrlBase from '../middleware/UrlBase';
export default function ModalScreen() {

  const [isVisible, setIsVisible] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [cedula, setcedula] = useState('')
  const [id, setid] = useState('')
  const [paciente, setpaciente] = useState('')
  const [pulso, setpulso] = useState('')
  const [buscador, setbuscador] = useState('')
  const [listado, setlistado] = useState([])


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

const buscarPersonaXcedula=async(e)=>{
  setbuscador(e)
  listadoPaciente(e);
}

async function selecionarPacienete(params:Object) {
  setid(params.id)
  setcedula(params.cedula)
  setpaciente(params.apellidos+' '+params.nombres)
  setIsVisible(false)
  listadoHistorial(params.id)
}

async function listadoHistorial(x){
  try {
    const response= await fetch(UrlBase+"api/listado-historials?paciente="+x,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const json=await response.json();
    setlistado(json);
    
  } catch (error) {
    console.log(error)
  }finally{
    setLoading(false)
  }
}

const confirmarEliminarHistorial = () =>
{
  Alert.alert('Confirmación', 'Está seguro de vaciar el historial de: '+paciente, [
    {
      text: 'Cancelar',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'Vaciar', onPress: () => eliminarok() },
  ]);
}

  const eliminarok=async()=>{
    try {
      const response= await fetch(UrlBase+"api/vaciar-historial", {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         id
       })
     });
     const json=await response.json();
     listadoHistorial(id)
     console.log(json)
    } catch (error) {
      console.log(error)
    }finally{
   
    }
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


useEffect(() => {
    listadoPaciente(buscador);   

  }, []);

  return (
    <ScrollView>
    <View>
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

      <Button
        icon={<Icon name='person-search' color='#ffffff' />}
        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
        title='Buscar paciente'
        onPress={()=>setIsVisible(true)}
          />
        
        {
          listado.length>0?
          <>
          <ListItem key="00" bottomDivider>

            <ListItem.Content>
            <Button
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,backgroundColor:'red'}}
              title='Vaciar historial'
              onPress={()=>confirmarEliminarHistorial()}
              />
            </ListItem.Content>
          </ListItem>

        {listado.map((l, i) => (
          <ListItem key={i} bottomDivider>

            <ListItem.Content>
              <ListItem.Title>Pulso: {l.pulso_cardiaco}</ListItem.Title>
              <ListItem.Subtitle>Estado: {l.estado}</ListItem.Subtitle>
              <ListItem.Subtitle>Fecha: {l.created_at}</ListItem.Subtitle>
              
            </ListItem.Content>
          </ListItem>
        ))}
        </>
        :
        <Text>No existe historial</Text>
      }

    </View>
    </ScrollView>
  );
}

