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
  Animated,
  PanResponder,
  LayoutAnimation,
} = React;

var ColorHexes = {
  "red": "#FE4515",
  "yellow": "#F8FE15",
  "blue": "#396DFF",
  "green": "#3AFF47",
};

var Baobab = require("baobab");
var db = new Baobab({
  todos: {},
});

var todos = db.select("todos");

var todoIDCounter = 0;
function createTodo(title,color) {
  var id = String(todoIDCounter++);
  todos.set(id,{title: title, color: color, id: id});
}

function completeTodo(todo) {
  var oldTodos = todos.get();
  todos.unset(String(todo.id));
}

createTodo("Bring back the milk",ColorHexes["green"]);
createTodo("Let the dogs out", ColorHexes["red"]);
createTodo("Meditate for 10 seconds", ColorHexes["blue"]);
createTodo("Clear the fridge", ColorHexes["blue"]);

require("image!red-button");
require("image!blue-button");
require("image!yellow-button");
require("image!green-button");



var AddItem = (function() {
  var css = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 16,
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
    getInitialState: function() {
      return {
        selectedColor: "yellow",
      };
    },

    onSubmit: function(e) {
      var text = e.nativeEvent.text.trim();
      if(text !== "") {
        createTodo(text,this.state.selectedColor);
        this.props.navigator.pop();
      }


    },

    onCancel: function(e) {
      this.props.navigator.pop();
    },

    handleChangeColor: function(color) {
      this.setState({selectedColor: color});
    },

    render: function() {
      var buttons = ["red","yellow","blue","green"].map((color) => {
        //
        return (
          <TouchableOpacity onPress={this.handleChangeColor.bind(this,color)}>
            <Image
              style={css.colorSelector}
              source={require("image!"+color+"-button")}/>
          </TouchableOpacity>
        );
      });

      var inputColor = this.state.selectedColor === "yellow" ? "#333" : "#fff"

      return (
        <View style={css.container}>
          <View style={css.colorSelectContainer}>
            {buttons}
          </View>
          <Text style={css.label}>Change The World</Text>
          <TextInput ref="input"
            style={[css.input,{color: inputColor},{backgroundColor: this.state.selectedColor}]}
            onSubmitEditing={this.onSubmit}
            placeholder="One TODO at a time"
            placeholderTextColor={inputColor}/>
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

    checkbox: {
      marginRight: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },

    checkboxHide: {
      width: 15,
      height: 50,
    },

    checkboxShow: {
      width: 50,
      height: 50,
    },

    checkmark: {
      tintColor: "#fff",
    },
  });

  return React.createClass({
    getInitialState: function() {
      return {
        opacity: new Animated.Value(0),
        showCheckmark: false,
      }
    },

    componentWillMount: function() {
      this._panResponder = PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderTerminationRequest: (evt, gestureState) => true,

        onPanResponderRelease: (evt, gestureState) => {
          var dx = gestureState.dx;
          console.log("swipe",{dx:gestureState.dx,dy:gestureState.dy});
          if(dx > 50) {
            this.setState({showCheckmark: true});
          } else if(dx < 50) {
            this.setState({showCheckmark: false});
          }

          LayoutAnimation.configureNext(LayoutAnimation.create(
            100,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.opacity),
          () => {
            this.animateTodoComplete();
            // completeTodo(this.props.todo);
          }, (err) => {

          });
          // LayoutAnimation.easeInEaseOut();
        },

      });

      Animated.timing(this.state.opacity,{
        duration: 200,
        toValue: 1,
      }).start();
    },

    animateTodoComplete: function() {
      var newOpacity = new Animated.Value(1);
      this.setState({
        opacity: newOpacity,
      });

      Animated.timing(newOpacity,{
        duration: 500,
        toValue: 0,
      }).start(() => {
        completeTodo(this.props.todo);
      });
    },

    render: function() {
      var todo = this.props.todo;
      var animatedStyles = {
        opacity: this.state.opacity,
      };

      var checkbox;

      var showCheckbox = this.state.showCheckmark == true


      checkbox = (
        <View style={[css.checkbox,showCheckbox ? css.checkboxShow : css.checkboxHide, {backgroundColor: todo.color || '#3AFF47'}]}>
          <Image style={[css.checkmark,showCheckbox ? null : {marginLeft: -100}]} source={require("image!check-button")}/>
        </View>
      );


      return (
        <Animated.View style={[css.todoRow,animatedStyles]}
          {...this._panResponder.panHandlers}>
          {checkbox}
          <View>
            <Text
              style={css.todoText}>
              {todo.title}
            </Text>
          </View>
        </Animated.View>
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
        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => {
          if(r1 !== r2) {
            console.log("row changed",r1,r2);
          }

          return r1 !== r2;
        }}),
      };
    },

    todosUpdated: function() {
      var rows = todos.get();

      // animate row insertion and deletion
      LayoutAnimation.configureNext(LayoutAnimation.create(100,LayoutAnimation.Types.easeInEaseOut,LayoutAnimation.Properties.opacity))

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(rows),
      });
    },

    renderTodo: function(todo,section,row) {
      return <TodoListItem key={todo.id} todo={todo}></TodoListItem>;
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
            key={color+"-button"}
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
