import React,{useState,useEffect} from 'react';
import { StyleSheet, TextInput,Alert,ScrollView} from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from '../components/Themed';
import UrlBase from '../middleware/UrlBase';
import { BottomSheet, ListItem,Button,SearchBar,Card,Icon,Input } from 'react-native-elements';
export default function TabTwoScreen() {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [id, setid] = useState('')
  const [apellidos, setapellidos] = useState('');
  const [nombres, setnombres] = useState('')
  const [cedula, setcedula] = useState('')
  const [edad, setedad] = useState('')
  const [buscador, setbuscador] = useState('')
 
  
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

 const guardarPaciente=async()=>{
   try {
     setLoading(true)
     const response= await fetch(UrlBase+"api/guardar-paciente", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        apellidos,
        nombres,
        cedula,
        edad
      })
    });
    const json=await response.json();
    console.log(json)
    if(json.errors){
      Object.keys(json.errors).forEach(key => {
        Alert.alert('Error.!',json.errors[key].toString())
      })
    }
    if(json.msg=='crear'){
      Alert.alert('','Paciente ingresado.!')
      vaciarCajas();
      listadoPaciente(buscador)
    }
    if(json.msg=='editar'){
      Alert.alert('','Paciente actualizado.!')
      listadoPaciente(buscador)
      vaciarCajas();
    }
   } catch (error) {
     console.log(error)
   }finally{
     setLoading(false)
   }
 }

 async function vaciarCajas() {
   await setid('')
   await setapellidos('')
   await setnombres('')
   await setcedula('')
 }
 async function selecionarPacienete(params:Object) {
  setid(params.id)
  setcedula(params.cedula)
  setapellidos(params.apellidos)
  setnombres(params.nombres)
  
}


const eliminarPaciente=async()=>{
  try {
    
    const response= await fetch(UrlBase+"api/eliminar-paciente", {
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
   if(json.msg=='ok'){
     Alert.alert('','Paciente eliminado.!')
     vaciarCajas();
     listadoPaciente(buscador)
   }
   if(json.msg=='no'){
     Alert.alert('','Paciente no eliminado, ya que contiene información.!')
   }
  } catch (error) {
    console.log(error)
  }finally{
    
  }
}
const createTwoButtonAlert = () =>
Alert.alert(
  "Confirmar",
  "Está seguro de eliminar el paciente.!",
  [
    {
      text: "CANCELAR",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel"
    },
    { text: "ELIMINAR", onPress: () => eliminarPaciente() }
  ]
);

 useEffect(() => {
  listadoPaciente(buscador);
}, []);

  return (
    <SafeAreaProvider>
<ScrollView>
      <View >
        <Input
          onChangeText={setapellidos}
          value={apellidos}
          placeholder="Ingrese Apellidos"
          autoFocus={true}
          maxLength={100}
          label="Nombres"
        />
        <Input
          label='Apellidos'
          onChangeText={setnombres}
          value={nombres}
          placeholder="Ingrese Nombres"
        />
        <Input
          label='Cédula'
          onChangeText={setcedula}
          value={cedula}
          placeholder="Ingrese Cédula"
          keyboardType="numeric"
        />
        <Input
          label='Edad'
          onChangeText={setedad}
          value={edad}
          placeholder="Ingrese edad"
          keyboardType="numeric"
        />
         <Button
          title={isLoading===false?'GUARDAR':'GUARDANDO'}
          onPress={guardarPaciente}
        />
        { id!=''?
        <Button
          title="ELIMINAR"
          type='outline'
          onPress={createTwoButtonAlert}
        />
        :<></>
      }

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
      </View>
      </ScrollView>
      
    </SafeAreaProvider>
  );
}


