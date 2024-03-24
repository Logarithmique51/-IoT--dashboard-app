/* eslint-disable prettier/prettier */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CssBaseline,
  ThemeOptions,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import { Device } from '../type/DeviceType';

const themeoptions: ThemeOptions = {
  palette: {
    mode:'dark',
    primary:{
      main:'#f0f'
    },
    background: {
      default: "#222831",
      paper: "#31363F"
    },
  },
};

const themes = createTheme(themeoptions);

function Hello() {
  const [devices,setDevices] = useState<Device[]>([])


  const addOrUpdateDevice = (device: Device) => {
    setDevices(prevDevices => {
      const index = prevDevices.findIndex(d => d.id === device.id);
      if (index !== -1) {
        // Device with same ID exists, update its properties
        const updatedDevices = [...prevDevices];
        updatedDevices[index] = {
          ...updatedDevices[index],
          mac: device.mac,
          ip: device.ip,
          strenght: device.strenght
        };
        return updatedDevices;
      } else {
        return [...prevDevices, device];
      }
    });
  };


  useEffect(() => {
    window.electron.ipcRenderer.on('discovery',addOrUpdateDevice);
    return () => {
      window.electron.ipcRenderer.removeEventListener('discovery',addOrUpdateDevice);
    }
  })



  const discover: () => void = () => {
    window.electron.ipcRenderer.sendMessage('discovery', ['ping']);
  };

  const sendBlink = (id:number)=>{
     window.electron.ipcRenderer.sendMessage('blink',id)
  }

  return (
    <div>
      <ThemeProvider theme={themes}>
        <CssBaseline/>
        <Box display={'flex'} flexWrap={'wrap'} gap={2} justifyContent={'center'} m={2}>

          {
            devices &&
            devices.map((val)=>(
              <Card sx={{}} key={val.mac}>
                <CardActionArea onClick={()=>sendBlink(val.id)} >
                  <CardHeader title={val.ip}/>
                  <CardContent>
                    <Typography>Signal : {val.strenght}db</Typography>
                    <Typography>Mac : {val.mac}db</Typography>
                    <Typography>Id : {val.id}db</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>

            ))
          }
        </Box>
        <Button>ok</Button>
      </ThemeProvider>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
