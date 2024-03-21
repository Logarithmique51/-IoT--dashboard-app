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
  const [deviceList,setDeviceList] = useState<Device[]>([])

  const handleDiscovery = (args: Device) => {
    setDeviceList(prev => {
      console.log("Received:", args);
      // Check if the received device already exists in the list
      if (!prev.some(device => device.id === args.id)) {
        console.log("Added:", args.id);
        return [...prev, args]; // Add the new device to the list
      }
      return prev; // If the device already exists, return the previous list
    });
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('discovery',handleDiscovery);
    return () => {
      window.electron.ipcRenderer.removeEventListener('discovery',handleDiscovery);
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
            deviceList &&
            deviceList.map((val)=>(
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
