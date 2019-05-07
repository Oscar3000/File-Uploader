import { Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, TextField, Typography, withStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import React from 'react';

interface State{
  title:string
  books:IBook[]
}
interface IBook{
  id:number,
  title:string
}
interface TextValue{
  name?:string,
  value:string
}

const styles = {
  root:{
    margin:'20px auto',
    padding:20,
    maxWidth:600
  },
  form:{
    display:'flex',
    alignItem:'basline',
    justifyContent:'space-evenly'
  }
}

class app extends React.Component<any,State> {
  public state:State = {
    title: '',
    books: []
  }
  HandleSubmit = (e: any) => {
    e.preventDefault();
    if(this.state.title){
      this.setState(({books,title}) =>({
        books: [...books, {title:title,id:Date.now()}],
        title:''
      }));
    }

  }


  HandleChange = (e:any)=>{
    const {value}:TextValue = e.target;
    this.setState(({title:value}));
  }

  HandleDelete =(id:number)=>{
    console.log(id);
    this.setState(({books})=>({
      books:books.filter((book) => book.id != id)
    }));
  }

  render() {
    const {title, books} = this.state;
    const {classes} = this.props;
    return (
        <Paper className={classes.root}>
          <Typography variant="display2" align="center">Books Api</Typography>
          <form onSubmit={this.HandleSubmit} className={classes.form}>
            <TextField onChange={this.HandleChange} margin="normal" value={title} name="title" label='Book'/>
            <Button type="submit" variant="contained" color="primary">Create</Button>
          </form>
          <List>
            {books.map(({id,title}) => {
              return (<ListItem key={id}>
                <ListItemText>{title}</ListItemText>
                <ListItemSecondaryAction><IconButton color="secondary" onClick={()=>this.HandleDelete(id)}><Delete /></IconButton></ListItemSecondaryAction>
              </ListItem>);
            })}
          </List>
        </Paper>
    );
  }
}
export default withStyles(styles)(app);