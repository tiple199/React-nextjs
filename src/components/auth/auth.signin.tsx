'use client'
import {useState} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Alert, Button, Divider, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, Stack, TextField } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { signIn } from 'next-auth/react'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation'



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  
}));


const AuthSignIn = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [username,setUsername] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
    const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

    const [errorUsername,setErrorUsername] = useState<string>("");
    const [errorPassword,setErrorPassword] = useState<string>("");

    const [openMessage,setOpenMessage] = useState<boolean>(false);
    const [resMessage,setResMessage] = useState<string>("");

    const handleSubmit = async () => {
        setIsErrorUsername(false);
        setIsErrorPassword(false);
        setErrorUsername("");
        setErrorPassword("");

        if(username === ""){
            setIsErrorUsername(true); 
            setErrorUsername("Username is not empty!");
            return;
        }
        if (password === ""){
            setIsErrorPassword(true);
            setErrorPassword("Password is not empty!")
            return;
        }
        
        const res = await signIn("credentials",{
            username: username,
            password: password,
            redirect: false
        });
        if(!res?.error){
            setOpenMessage(true);
            setResMessage("Đăng nhập thành công!");
            router.push("/");
        }
        else{
            setOpenMessage(true);
            setResMessage(res.error);
        }
            

    }

    

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
    return (
        
        <Box sx={{ flexGrow: 1,marginTop:"250px"}}>
            <Grid container spacing={1} sx={{justifyContent: "center"}}>         
                <Grid item xs={12} md={3}>
                    <Item sx={{position: "relative",paddingTop: 5, boxShadow: "1px #ccc "}}>
                        <Link href="/" style={{position: "absolute", left:10,top: 10}}>
                            <ArrowBack/>
                        </Link>
                        <div style={{background: "#CCC",width: 40,height: 40,borderRadius: "50%",display: "flex",justifyContent: "center",alignItems: "center", marginLeft: "50%",translate: "-50% 0px"}}>
                            <LockIcon/>
                        </div>
                        <h4>Sign In</h4>
                        

                        <TextField id="email" label="Username" variant="outlined" value={username} onChange={(v)=>{setUsername(v.target.value)}} sx={{width: "95%",marginBottom: "20px"}} error={isErrorUsername} helperText={errorUsername}/>
                        <TextField id="password" label="Password" variant="outlined"
                         value={password} onKeyDown={(e)=>{
                            if(e.key === "Enter"){
                                handleSubmit();
                            }
                         }} onChange={(v)=>{setPassword(v.target.value)}} 
                        sx={{width: "95%",marginBottom: "20px"}} error={isErrorPassword} helperText={errorPassword}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment:
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={handleClickShowPassword}
                                      edge="end"
                                    >
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                
                            }}
                        />
                            
                        
                        
                        <Button variant="contained" sx={{width: "95%",marginBottom: "10px"}} onClick={handleSubmit}>Sign In</Button>
                        <Divider>Or using</Divider>
                        <div style={{display: "flex",justifyContent: "center",gap:10, marginTop: 15 }}>
                            <div style={{background: "#CCC",width: 40,height: 40,borderRadius: "50%",
                                display: "flex",justifyContent: "center",alignItems: "center",flexShrink: 0, backgroundColor:"#ffa300",cursor: "pointer"}} onClick={()=>{signIn("github")}}>
                                <GitHubIcon sx={{color: "#FFF"}}/>
                            </div>
                            <div style={{background: "#CCC",width: 40,height: 40,borderRadius: "50%",
                                display: "flex",justifyContent: "center",alignItems: "center",flexShrink: 0,backgroundColor:"#ffa300",cursor: "pointer"}}>
                                <GoogleIcon sx={{color: "#FFF"}}/>
                            </div>
                        </div>
                    </Item>
                </Grid>
            </Grid>
            
            <Snackbar
             open={openMessage} 
             autoHideDuration={5000}
             anchorOrigin={{vertical: "top",horizontal: "center"}}
             onClose={()=>setOpenMessage(false)}
             >
                <Alert
                  onClose={()=>setOpenMessage(false)}
                  severity="error"
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                    {resMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default AuthSignIn;