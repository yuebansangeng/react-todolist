
import Utils from './utils'
//todos实体
const Todo = {
  add: function(todos,title){
    todos = todos.concat({
      id: Utils.uuid(),
      title: title,
      complete: false
    });
    return todos;
  },

  remove: function(todos,todoToRemove){
    todos = Array.prototype.filter.call(todos,function (candidate) {
      return candidate !== todoToRemove;
    });
    return todos;
  },

  clearaAllComplete: function(todos){
    todos = todos.filter((todo)=>{
      return !todo.complete;
    });
    return todos;
  },

  save: function(todos,todoToSave,text){
    todos = todos.map(function (todo) {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
    });
    return todos;
  },

  toggle: function(todos,todoToToggle) {
    todos = todos.map(function (todo) {
      return todo !== todoToToggle ?
        todo :
        Utils.extend({}, todo, {complete: !todo.complete});
    });
    return todos;
  },

  toggleAll: function(todos){
    todos = todos.map(function(todo){
      return Utils.extend({}, todo, {complete: !todo.complete})
    })
    return todos;
  }
}

export default Todo;