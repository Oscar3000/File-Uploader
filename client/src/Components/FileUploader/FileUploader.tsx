import { Button, FormControl, Grid, Input, InputLabel, Paper, Typography, withStyles } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from 'axios';
import React from 'react';
import Message from '../Message/Message';

interface Props{
classes:any;
}

interface IUploadedData{
    fileName:string;
    filePath:string;
}

interface IMessage{
    message:string,
    open:boolean
}

const styles = (theme:any) => ({
    root:{
        maxWidth:600,
        margin: `${theme.spacing.unit * 4}px auto`
    },
    formControl:{
        margin: theme.spacing.unit
    },
    form:{
        display:'flex',
        alignItem:'basline',
        justifyContent:'space-evenly'
      },
      margin:{
          margin:theme.spacing.unit
      },
      button:{
          marginTop: theme.spacing.unit*2
      },
      rightIcon:{
          marginLeft:theme.spacing.unit
      },
      grid:{
          flexGrow:1,
          marginTop:theme.spacing.unit*2
      },
      img:{
          width:'100%'
      }
});

const fileUploader: React.FC<Props> = (props) =>{
    const [message,setMessage] = React.useState<IMessage>({message:'',open:false});
    const [file,setFile]:[File | undefined,(file:File | undefined)=>void] = React.useState();
    const [filename,setFilename]:[string,(filename:string)=>void] = React.useState('Choose file');
    const [uploadedFile,setUploadedFile]:[IUploadedData,(file:IUploadedData)=>void] = React.useState({fileName:'',filePath:''});
    const [uploadPercentage,setUploadPercentage] = React.useState(0);

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        if(e.currentTarget.files !== undefined && e.currentTarget.files !== null){
            setFile(e.currentTarget.files[0]);
            setFilename(e.currentTarget.files[0].name);
        }
    }

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        console.log(file);
        if(file !== undefined){
            const fileType = /image\/*/.test(file.type);
            if(fileType){
                const formData = new FormData();
                formData.append('file',file);
                try{
                    const res = await axios.post('/upload',formData,{
                        headers:{
                            'Content-Type':'multipart/form-data'
                        },
                        onUploadProgress: progressEvent =>{
                            const percent:number = Math.round((progressEvent.loaded*100) /progressEvent.total);
                            console.log(percent);
                            setUploadPercentage(percent);
                            //Clear Percentage
                            setTimeout(()=>setUploadPercentage(0),10000);
                        }
                    });
                    const {fileName,filePath} = res.data;
                    setUploadedFile({fileName,filePath});
                    setMessage({message:"File Uploaded successfully",open:true});
                }catch(err){
                    if(err.response.status === 500){
                        setMessage({message:'There was a problem with the server',open:true});
                    }else{
                        setMessage({message:err.response.data.msg,open:true});
                    }
                }
            }else{
                setMessage({message:`the file type: ${file.type} is not supported for upload`,open:true});
            }
        }

    }
    const handleClose = () =>{
        setMessage({message:'',open:false});
    }
    return (<React.Fragment>
        <Paper className={props.classes.root}>
            <Typography variant="display1" align="center" color="primary">React File Uploader</Typography>
            <form className={props.classes.form} onSubmit={onSubmit}>
                <FormControl className={props.classes.margin}>
                    <InputLabel htmlFor="upload-file">{filename}</InputLabel>
                    <Input type="file" id="upload-file" className={props.classes.input} onChange={onChange} />
                </FormControl>
                <FormControl>
                    <Button type="submit" variant="contained" className={props.classes.button} color="primary">
                        Upload
                        <CloudUploadIcon className={props.classes.rightIcon} />
                    </Button>
                </FormControl>
            </form>
            {uploadedFile ? (<Grid container className={props.classes.grid} spacing={24}>
                <Grid item xs={12} sm={6}>
                    <img src={uploadedFile.filePath} className={props.classes.img}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography component='p' align='center'>
                        FileName:
                        {uploadedFile.fileName}
                    </Typography>
                </Grid>
            </Grid>) : null}
        </Paper>
        <Message msg={message} handleClose={handleClose} />
    </React.Fragment>);
}

export default withStyles(styles)(fileUploader);

