/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  AlertIOS,
  ListView,
  Image,
  TouchableOpacity,
  NavigatorIOS,
} = React;

var Baobab = require("baobab");
var db = new Baobab({
  todos: [{title: "Bring back the milk"},{title: "Let the dogs out"}],
});

var todos = db.select("todos");


require("image!red-button");
require("image!blue-button");
require("image!yellow-button");
require("image!green-button");

var AddItem = (function() {
  var css = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 16,
      // marginTop: -200,
      // padding: 10,
      // backgroundColor: 'red',
    },

    label: {
      // fontFamily: 'AvenirNext',
      fontWeight: '100',
      fontSize: 36,
      marginBottom: 25,
      textAlign: 'center'
    },

    input: {
      // flex: 1,
      // backgroundColor: 'green',
      height: 50,
      padding: 10,
      fontWeight: '200',
      fontSize: 20,

      backgroundColor: '#F7FF00'
    },

    colorSelectContainer: {
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },

    colorSelector: {
      margin: 10,
    },

    cancelButton: {
      // right: 10,
      position: 'absolute',
      // textAlign: 'right'
      right: 10,
      marginTop: 10,
    }
  });

  var styles = css;

  return React.createClass({
    onSubmit: function(e) {
      var text = e.nativeEvent.text;
      todos.push({title: text});
      this.props.navigator.pop();
    },

    onCancel: function(e) {
      this.props.navigator.pop();
    },

    render: function() {
      var buttons = ["red","yellow","blue","green"].map(function(color) {
        return (
          <Image
            style={css.colorSelector}
            source={require("image!"+color+"-button")}/>
        );
      });

      return (
        <View style={css.container}>
          <View style={css.colorSelectContainer}>
            {buttons}
          </View>
          <Text style={css.label}>Change The World</Text>
          <TextInput ref="input"
            style={css.input}
            onSubmitEditing={this.onSubmit}
            placeholder="One TODO at a time"/>
          <TouchableOpacity onPress={this.onCancel}>
            <Image style={css.cancelButton}
              source={require("image!cancel-button")}/>
          </TouchableOpacity>

        </View>
      );
    },
  });
})();

var TodoListItem = (function() {
  var css = StyleSheet.create({
    todoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },

    todoText: {
      fontSize: 20,
      fontWeight: '100',
    },

    todoColor: {
      width: 15,
      height: 50,
      backgroundColor: '#3AFF47',
      marginRight: 15,
    },
  });

  return React.createClass({
    render: function() {
      var todo = this.props.todo;
      return (
        <View style={css.todoRow}>
          <View style={css.todoColor}>
          </View>
          <Text
            style={css.todoText}>
            {todo.title}
          </Text>
        </View>
      );
    },
  });
})();

var TodoList = (function() {
  var css = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: 'rgba(255,0,0,0.3)',
    },

    toolbar: {
      height: 75,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',

    },

    colorSelector: {
      margin: 10,
    },

    addItemButton: {
      marginLeft: 10,
    },




  });

  return React.createClass({
    componentWillMount: function() {
      this.todosUpdated();
      todos.on("update",this.todosUpdated);
    },

    componentWillUnmount: function() {
      todos.off("update",this.todosUpdated);
    },

    getInitialState: function() {
      return {
        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      };
    },

    todosUpdated: function() {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(todos.get()),
      });
    },

    renderTodo: function(todo) {
      return <TodoListItem todo={todo}></TodoListItem>;
    },

    onAddItemTapped: function() {
      this.props.navigator.push({
        component: AddItem,
      });
    },

    render: function() {
      var buttons = ["red","yellow","blue","green"].map(function(color) {
        return (
          <Image
            style={css.colorSelector}
            source={require("image!"+color+"-button")}/>
        );
      });

      return (
        <View style={css.container}>
          <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderTodo}/>
          <View style={css.toolbar}>
            {buttons}
            <TouchableOpacity onPress={this.onAddItemTapped}>
              <Image
                style={css.addItemButton}
                source={require("image!add-item-button")}/>
            </TouchableOpacity>

          </View>
        </View>
      );
    },
  });
})();

var Todo = React.createClass({
  render: function() {
    return (
      <NavigatorIOS style={styles.nav}
        navigationBarHidden={true}
        initialRoute={{
          component: TodoList,
          // component: AddItem,
        }}>
      </NavigatorIOS>
    );
  }
});

var styles = StyleSheet.create({
  nav: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    // backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Todo', () => Todo);
