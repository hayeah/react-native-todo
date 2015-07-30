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
} = React;

var AddItem = (function() {
  var styles = StyleSheet.create({
    container: {
      marginTop: -200,
      padding: 10,
      // backgroundColor: 'red',
    },

    label: {
      // fontFamily: 'AvenirNext',
      fontWeight: '100',
      fontSize: 36,
      marginBottom: 25,
    },

    input: {
      flex: 1,
      // backgroundColor: 'green',
      height: 50,
      padding: 10,
      fontWeight: '200',
      fontSize: 20,

      backgroundColor: '#F7FF00'
    },
  });

  return React.createClass({
    onSubmit: function(e) {
      var text = e.nativeEvent.text;
      // console.log("input",this.refs.input.value, arguments);
      AlertIOS.alert("Received Input",text);
    },

    render: function() {
      return (
        <View style={styles.container}>
          <Text style={styles.label}>Change The World</Text>
          <TextInput ref="input"
            style={styles.input}
            onSubmitEditing={this.onSubmit}
            placeholder="One TODO at a time"/>
        </View>
      );
    },
  });
})();

var todos = [
  {title: "Bring back the milk"},
  {title: "Let the dogs out"},
];

require("image!red-button");
require("image!blue-button");
require("image!yellow-button");
require("image!green-button");

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
    getInitialState: function() {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
        dataSource: ds.cloneWithRows(todos),
      };
    },

    renderTodo: function(todo) {
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
            <Image
              style={css.addItemButton}
              source={require("image!add-item-button")}/>

          </View>
        </View>
      );
    },
  });
})();





var Todo = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <TodoList/>
      </View>
    );
  }
});

var styles = StyleSheet.create({
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
