import { IconButton, Snackbar, withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

interface IProp{
    msg:{
        open:boolean;
        message:string;
    };
    classes:any;
    handleClose:() => void
}

const styles = ({spacing}:{spacing:any}) => ({
    close: {
      padding: spacing.unit / 2,
    },
  });

const message:React.FC<IProp> = props =>{
   return (
    <Snackbar 
        anchorOrigin={{
            vertical:'bottom',
            horizontal:'right'
        }}
        open={props.msg.open} 
        onClose={props.handleClose} 
        autoHideDuration={4000}
        message={<span>{props.msg.message}</span>}
        action={(
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={props.classes.close}
                onClick ={props.handleClose}
                >
                <CloseIcon />
            </IconButton>
        )}
    />
   );
}

export default withStyles(styles)(message);