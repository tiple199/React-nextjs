'use client'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast';



function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel(props : IProps) {

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={props.trackUpload.percent} />
    </Box>
  );
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function InputFileUpload(props: any) {
  const { data: session } = useSession();
  const {setInfo,info} = props;
  const toast = useToast()
  const handleUpload = async (image: any) =>{
    const formData = new FormData()
      formData.append("fileUpload", image)

      try{
        const res = await axios.post("http://localhost:8000/api/v1/files/upload",formData,
        {
          headers: { Authorization: `Bearer ${session?.access_token}`,
          "target_type": "images" ,
          // delay: 5000
          },
        }
        
      )
      setInfo({
          ...info,
          imgUrl: res.data.data.fileName
        })
    }
      catch(e){
        //@ts-ignore
        toast.error(e?.response?.data?.message);
      }
  }
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={(event) => {
          if(event.target.files){
            handleUpload(event.target.files[0]);
          }
        }}
      />
    </Button>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
}));

interface IProps{
  trackUpload:{
    fileName: string,
    percent: number,
    uploadedTrackName: string
  },
  setValue: (v : number) => void;
}
interface INewTrack {
  title: string,
  description: string,
  trackUrl: string,
  imgUrl: string,
  category: string,
}

const Step2 = (props: IProps) => {
  const { data: session } = useSession();
  
  const toast = useToast()
  const {trackUpload,setValue} = props;
  const [info,setInfo] = useState<INewTrack>({
    title: "",
    description: "",
    trackUrl: "",
    imgUrl: "",
    category: "",
  });
  useEffect(()=>{
    if(trackUpload && trackUpload.uploadedTrackName){
      setInfo({
        ...info,
        trackUrl: trackUpload.uploadedTrackName
      })
    }
  },[trackUpload])
  


    const currencies = [
  {
    value: 'CHILL',
    label: 'CHILL',
  },
  {
    value: 'WORKOUT',
    label: 'WORKOUT',
  },
  {
    value: 'PARTY',
    label: 'PARTY',
  },
  
];

  const handleSubmitForm = async () =>{
    const res = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: "http://localhost:8000/api/v1/tracks",
        method: "POST",
        body: {
          title: info.title,
          description: info.description,
          trackUrl: info.trackUrl,
          imgUrl: info.imgUrl,
          category: info.category,
        },
        headers: { Authorization: `Bearer ${session?.access_token}`,
          // delay: 5000
          },
      });
      if(res.data){
        setValue(0);
        toast.success("Create a track success!");
      }
      else{
        toast.error(res.message);
      }
      
  }

;

  return (
    <Box sx={{ width: '100%' }}>
        <Typography>{trackUpload.fileName}</Typography>
      <LinearWithValueLabel trackUpload={trackUpload} setValue={setValue}/>
      <Box sx={{ flexGrow: 1 , marginTop: 5}}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <Item sx={{display: "flex", alignItems: "center",flexDirection: "column", boxShadow: "initial"}}>
            <div style={{width: "250px", height: "250px", background: "#CCC", marginBottom: 15}}>
              <div>
                {info.imgUrl && 
                  <img height={250} width={250} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`} alt="" />
                }
              </div>
            </div>
            <InputFileUpload setInfo={setInfo} info={info}/>
          </Item>
        </Grid>
        <Grid item xs={6} md={8}>
          
                <TextField value={info?.title} onChange={(v)=>setInfo({
                  ...info,
                  title: v.target.value,
                })} label="Title" variant="standard" fullWidth margin='dense'/>
                <TextField value={info?.description} onChange={(v)=>setInfo({
                  ...info,
                  description: v.target.value
                })} label="Description" variant="standard" fullWidth margin='dense'/>
                <TextField
                    value={info?.category} onChange={(v)=>setInfo({
                      ...info,
                      category: v.target.value,
                    })}
                    sx={{mt: 3}}
                    id="standard-select-currency"
                    select
                    label="Category"
                    variant="standard"
                    fullWidth
                    

                >
                    {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
                <Button variant='outlined'
                sx={{mt: 5}}
                onClick={()=>handleSubmitForm()}
                >
                    Save
                </Button>
            
        </Grid>
        
      </Grid>
    </Box>
    </Box>
  );
}

export default Step2;