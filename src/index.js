import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './base.css';
import ToDoUtils from './todomodel.js'

class ToDoList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editText: '',
            oldText:'',
            editing: false,
        }
    }
    handleEdit(){
        this.setState({editText: this.props.todo.title,oldText: this.props.todo.title,editing: true});
    }
    handleSave(){
        this.setState({editing: false})
        var val = this.state.editText;
        if(val){
            this.props.onSave(this.props.todo,val);
        }else{
            this.props.onRemove(this.props.todo);
        }
    }
    handleKeyDown(event) {
        if(event.keyCode === 13) {
            this.setState({editText: event.target.value,editing: false});
            this.handleSave(this.props.todo,this.state.editText);
        }
        if(event.keyCode === 27){
            this.setState({editText: this.state.oldText,editing: false});
            this.handleSave(this.props.todo,this.state.oldText);
        }
    }
    handleRemove(todo){
        this.props.onRemove(todo);
    }
    handleToggle(todo){
        this.props.onToggle(todo);
    }
    handleChange(event){
        this.setState({editText: event.target.value});
    }
    render(){
        return(
             <li className={[this.state.editing? 'editing': null, this.props.todo.complete?'completed':null].join(' ')}>	
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked = {this.props.todo.complete}
                        onChange = {this.handleToggle.bind(this,this.props.todo)}
                    />
                    <label onDoubleClick = {this.handleEdit.bind(this)}>
                        {this.props.todo.title}
                    </label>
                    <button className="destroy" onClick={this.handleRemove.bind(this,this.props.todo)}/>
                </div>
                    <input
                        ref="editField"
                        className = "edit"
                        value = {this.state.editText}
                        onChange = {this.handleChange.bind(this)}
                        onBlur = {this.handleSave.bind(this)} 
                        onKeyDown = {this.handleKeyDown.bind(this)}
                    />
            </li>
        );
    }
}
class ToText extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newTodo: ''
        };
    }
    handleChange(event){
        this.setState({newTodo: event.target.value});
    }
    enterDown(event){
         if (event.keyCode !== 13) {
            return;
         }
         var val = this.state.newTodo;
         var model;
         if(val.trim()){
            model = ToDoUtils.add(this.props.model,val.trim());      
            this.setState({newTodo:''});   
            this.props.onUpdate(model); 
         }
    }
    render(){
        return(
            <div className={'todoapp'}>
                <h1>todolist</h1>
                <input className="new-todo" placeholder="输入待办事项"
                    value = {this.state.newTodo}
                    onChange = {this.handleChange.bind(this)}
                    onKeyDown = {this.enterDown.bind(this)}
                    autoFocus = {true}
                >
                </input>
            </div>
        );
    }
}

class TodoFooter extends React.Component{
    constructor(props){
        super(props);
    }
    handle(nowShowing){
        this.props.onshowingUpdate(nowShowing);
    }
    removeAllComplete(){
       this.props.clearComplete();
    }
    render(){
        var todos = this.props.model;
        var activeItem = todos.reduce((num,todo) => {
            return todo.complete ? num : num + 1;
        },0);
        return (
            <div className="footer">
                <span >{activeItem} item left</span> 	
                <button onClick={this.handle.bind(this,"all")}
                    className={ this.props.nowShowing === "all" ? "selected" : ""}>
                        All
                </button>  
                <button onClick={this.handle.bind(this,"active")}
                    className={ this.props.nowShowing === "active" ? "selected" : ""}>
                        active
                </button>
                <button onClick={this.handle.bind(this,"complete")}
                    className={ this.props.nowShowing === "complete" ? "selected" : ""}>
                        complete
                </button>
                <button onClick={this.removeAllComplete.bind(this)}>
                        clear allcomplete
                </button>
            </div>
        );
    }
}

class ToDo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nowShowing: 'all',
            model: []
        }
    }
    handleSave(todoToSave,text){
        let model = this.state.model;
        model = ToDoUtils.save(model,todoToSave,text);
        this.handleUpdate(model);
    }
    handleToggle(todoToToggle){
        let model = this.state.model;
        model = ToDoUtils.toggle(model,todoToToggle);
        this.handleUpdate(model);
    }
    handleToggleAll(){
        var model = this.state.model;
        model = ToDoUtils.toggleAll(model);
        this.handleUpdate(model);
    }
    handleRemove(todoToRemove){
        let model = this.state.model;
        model = ToDoUtils.remove(model,todoToRemove);
        this.handleUpdate(model);
    }
    handleUpdate(models){
        this.setState({model: models})
    }
    showingUpdate(nowShowing){
        this.setState({nowShowing: nowShowing});
    }
    clearAllcompleter(){
        let model = this.state.model;
        model = ToDoUtils.clearaAllComplete(model); 
        this.handleUpdate(model);
    }
    render(){
        var todos =  this.state.model;
        var shownTodos =  todos.filter(function (todo) {
            switch (this.state.nowShowing) {
            case "active":
                return !todo.complete;
            case "complete":
                return todo.complete;
            default:
                return true;
            }
        }, this);
        var list;
        list = shownTodos.map(function(todo){
            return(
                <ToDoList 
                    key = {todo.id}
                    todo = {todo}
                    onSave = {this.handleSave.bind(this)}
                    onToggle = {this.handleToggle.bind(this)}
                    onRemove = {this.handleRemove.bind(this)}
                /> 
            ) 
        },this);
        return(
            <div className="todo">
                <header className="header">
                    <ToText model = {this.state.model} onUpdate = {this.handleUpdate.bind(this)}/>
                </header>
                <section className="main">
                    <input
                        id="toggle-all"
                        className="toggle-all"
                        type="checkbox"
                        onChange = {this.handleToggleAll.bind(this)}
                    />
                    <label
                        htmlFor="toggle-all"
                    />
                    <ul className="todo-list">
                        {list}
                    </ul>
                </section>
                <TodoFooter model = {this.state.model} 
                    nowShowing = {this.state.nowShowing} 
                    onshowingUpdate = {this.showingUpdate.bind(this)}
                    clearComplete = {this.clearAllcompleter.bind(this)}
                ></TodoFooter>
            </div>
        );
    }
}
ReactDOM.render(<ToDo />,document.getElementById("root"))


