// 312161767

var line = 0;
var fine = true;
var err = 0;
function foo() {
  return foo.staticVar;
}

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.sbn = factory());
}(this, (function () { 'use strict';

function lexer (code) {
  //$("footer").text("");
  $("footer").addClass('err');
  var _tokens = code
    .split(/[\t\f\v ]+/)
  var tokens = []
  for (var i = 0; i < _tokens.length; i++) {
    var t = _tokens[i]
    if(t.length <= 0 || isNaN(t)) {
      if(t.length > 0) {
        tokens.push({type: 'word', value: t})
      }
    } else {
      tokens.push({type: 'number', value: t})
    }
  }

  if (tokens.length < 1) {
    $("footer").text('Comienza a codificar, puedes iniciar con "Paper Morado"');
    $("footer").addClass('err');
  }

  return tokens
}

function parser (tokens, line) {
  function expectedTypeCheck (type, expect) {
    if(Array.isArray(expect)) {
      var i = expect.indexOf(type)
      return i >= 0
    }
    return type === expect
  }

  function createDot (current_token, currentPosition, node) {
    var expectedType = ['ob','number', 'number','word']
    var expectedLength = 4
    currentPosition = currentPosition || 0
    node = node || {type: 'dot'}

    if (currentPosition < expectedLength - 1) {
      if (expectedTypeCheck(current_token.type, expectedType[currentPosition])){
        if(currentPosition === 1) {
          node.x = current_token.value
        }
        if(currentPosition === 2) {
          node.y = current_token.value
        }
        currentPosition++
        createDot(tokens.shift(), currentPosition, node)
      } else {
        $("footer").text( 'Esperamos un ' + expectedType[currentPosition] + ' pero encontramos ' + current_token.type + '.');
        $("footer").addClass('err');
      }
    }
    return node
  }

  function findArguments(command, expectedLength, expectedType, currentPosition, currentList) {
    currentPosition = currentPosition || 0
    currentList = currentList || []
    while (expectedLength > currentPosition) {
      var token = tokens.shift()
      if (!token) {
        err = line;
        $("footer").text( 
          command + ' necesita ' + 
          expectedLength + ' argumento(s). en linea: ' + 
          line
        );
        $("footer").addClass('err');
        $("#code > div:nth-child(" + line + ")").addClass('err');
        $("#lines > div:nth-child(" + line + ")").addClass('err');
      }

      if (expectedType){
        var expected = expectedTypeCheck(token.type, expectedType[currentPosition])
        if (!expected) {
          /*$("footer").text( command + ' tiene ' + JSON.stringify(expectedType[currentPosition]) + ' argumento ' + (currentPosition + 1) + '. ' + (token ? 'Instead found a ' + token.type + ' '+ (token.value || '') + '.' : ''));
          $("footer").addClass('err');*/
        }
        if (token.type === 'number' && (token.value < 0 || token.value > 100)){
          $("footer").text( 'Buscando valores ' + token.value + ' para ' + command + '. Debe de estar entre 0 - 100.');
          $("footer").addClass('err');
        }
      }
      /*
      alert(
        JSON.stringify(token)        
      );*/

      if (token.type != 'word' && command != "Color") {
        var arg = {
          type: token.type,
          value: token.value
        }
      } else {
        var arg = {
          type: 'number',
          value: token.value
        }
      }

      if (token.type === 'ob') {
        arg = createDot(token)
      }
      currentList.push(arg)
      currentPosition++
    }
    return currentList
  }

  var AST = {
    type: 'Drawing',
    body: []
  }
  var paper = false
  var pen = true

  while (tokens.length > 0) {
    var current_token = tokens.shift()
    if (current_token.type === 'word') {
      switch (current_token.value) {
        case '//' :
          var expression = {
            type: 'CommentExpression',
            value: ''
          }
          var next = tokens.shift()
          while (next.type !== 'newline') {
            expression.value += next.value + ' '
            next = tokens.shift()
          }
          AST.body.push(expression)
          break
        case 'Paper' :
          if (err == line) {
            fine = true;
          }
          if (paper) {
            $("footer").text( 'You can not define Paper more than once');
            $("footer").addClass('err');
          }
          var expression = {
            type: 'CallExpression',
            name: 'Paper',
            arguments: []
          }
          var args = findArguments('Paper', 1)
          expression.arguments = expression.arguments.concat(args)
          AST.body.push(expression)
          paper = true
          break
        case 'Color' :
          if (err == line) {
            fine = true;
          }
          var expression = {
            type: 'CallExpression',
            name: 'Color',
            arguments: []
          }
          var args = findArguments('Color', 1)
          expression.arguments = expression.arguments.concat(args)
          AST.body.push(expression)
          pen = true
          break
        case 'Linea':
          pen = true;
          if (err == line) {
            fine = true;
          }
          if(!paper) {
            // $("footer").text( 'Primero ingrese un Paper');
          }
          if(!pen) {
            // $("footer").text( 'Primero ingrese pen 1st');
          }
          var expression = {
            type: 'CallExpression',
            name: 'Linea',
            arguments: []
          }
          var args = findArguments('Linea', 4)
          expression.arguments = expression.arguments.concat(args)
          AST.body.push(expression)
          break
        case 'Circulo':
          if (err == line) {
            fine = true;
          }
          if(!paper) {
            // $("footer").text( 'Primero ingrese un Paper');
          }
          if(!pen) {
            // $("footer").text( 'Primero ingrese pen 1st');
          }
          var expression = {
            type: 'CallExpression',
            name: 'Circulo',
            arguments: []
          }
          var args = findArguments('Circulo', 3, 'word')
          expression.arguments = expression.arguments.concat(args)
          AST.body.push(expression)
          break
        case 'Rectangulo':
          if (err == line) {
            fine = true;
          }
          if(!paper) {
            // $("footer").text( 'Primero ingrese un Paper');
          }
          if(!pen) {
            // $("footer").text( 'Primero ingrese pen 1st');
          }
          var expression = {
            type: 'CallExpression',
            name: 'Rectangulo',
            arguments: []
          }
          var args = findArguments('Rectangulo', 4)
          expression.arguments = expression.arguments.concat(args)
          AST.body.push(expression)
          break
        default:
          fine = false;
          err = line;
          $("footer").text( current_token.value + ' no es un comando valido en la linea: ' + line);
          $("footer").addClass('err');
          $("#code > div:nth-child(" + line + ")").addClass('err');
          $("#lines > div:nth-child(" + line + ")").addClass('err');
      }
    } else if (['newline', 'ocb', 'ccb'].indexOf[current_token.type] < 0 ) {
      $("footer").text( 'Unexpected token type : ' + current_token.type);
      $("footer").addClass('err');
    }
  }

  return AST
}

function transformer (ast) {

  function makeColor (level) {
    switch (level) {
      case 'Rojo':
        level = '#e74c3c'
        break
      case 'Verde':
        level = '#1abc9c'
        break
      case 'Amarillo':
        level = '#f1c40f'
        break
      case 'Gris':
        level = '#95a5a6'
        break
      case 'Azul':
        level = '#3498db'
        break
      case 'Blanco':
        level = '#ecf0f1'
        break
      case 'Naranja':
        level = '#e67e22'
        break
      case 'Morado':
        level = '#9b59b6'
        break
      case 'Buzzard':
        level = 'rgb(102,113,124)'
        break
    }
    return level
  }

  function findParamValue (p) {
    if (p.type === 'word') {
      return variables[p.value]
    }
    return p.value
  }

  var elements = {
    'Linea' : function (param, pen_color_value) {
      return {
        tag: 'line',
        attr: {
          x1: findParamValue(param[0]),
          y1: 100 - findParamValue(param[1]),
          x2: findParamValue(param[2]),
          y2: 100 - findParamValue(param[3]),
          stroke: makeColor(pen_color_value),
          'stroke-linecap': 'round'
        },
        body: []
      }
    },
    'Circulo' : function (param, pen_color_value) {
      return {
        tag: 'circle',
        attr: {
          cx: findParamValue(param[0]),
          cy: 100 - findParamValue(param[1]),
          r: findParamValue(param[2]),
          fill: makeColor(pen_color_value)
        },
        body: []
      }
    },
    'Rectangulo' : function (param, pen_color_value) {
      return {
        tag: 'rect',
        attr: {
          x: findParamValue(param[0]),
          y: 100 - findParamValue(param[1]),
          width: findParamValue(param[2]),
          height: findParamValue(param[3]),
          fill: makeColor(pen_color_value)
        },
        body: []
      }
    },
    'Paper' : function (param) {
      return {
        tag : 'rect',
        attr : {
          x: 0,
          y: 0,
          width: 100,
          height:100,
          fill: makeColor(findParamValue(param[0]))
        },
        body : []
      }
    }
  }

  var newAST = {
    tag : 'svg',
    attr: {
      width: "100%",
      height: "100%",
      viewBox: '0 0 100 100',
      xmlns: 'http://www.w3.org/2000/svg',
      version: '1.1'
    },
    body:[]
  }

  var current_pen_color = foo();

  var variables = {}

  while (ast.body.length > 0) {
    var node = ast.body.shift()
    if(node.type === 'CallExpression' || node.type === 'VariableDeclaration') {
      if(node.name === 'Color') {
        foo.staticVar = findParamValue(node.arguments[0]);
        current_pen_color = foo.staticVar;
      } else if (node.name === 'Set') {
        variables[node.identifier.value] = node.value.value
      } else {
        var el = elements[node.name]
        if (!el) {
          $("footer").text( node.name + ' is not a valid command.');
          $("footer").addClass('err');
        }
        if (typeof !current_pen_color === 'undefined') {
          // $("footer").text( 'Primero define Line, despues Pane.');
          $("footer").addClass('err');
        }
        newAST.body.push(el(node.arguments, current_pen_color))
      }
    }
  }

  return newAST
}

function generator (ast) {

  function traverseSvgAst(obj, parent, rest, text) {
    parent = parent || []
    rest = rest || []
    text = text || ''
    if (!Array.isArray(obj)) {
      obj = [obj]
      
      //alert(JSON.stringify(obj, null, 4));
    }

    while (obj.length > 0) {
      var currentNode = obj.shift()
      var body = currentNode.body || ''
      var attr = Object.keys(currentNode.attr).map(function (key){
        return key + '="' + currentNode.attr[key] + '"'
      }).join(' ')

      //text += parent.map(function(){return '\t'}).join('') + '<' + currentNode.tag + ' ' + attr + '>'
      
      if(currentNode.tag != 'svg') {
        text += parent.map(function(){return '\t'}).join('') + '<' + currentNode.tag + ' ' + attr + '>'
      }

      if (currentNode.body && Array.isArray(currentNode.body) && currentNode.body.length > 0) {
        text += '\n'
        parent.push(currentNode.tag)
        rest.push(obj)
        return traverseSvgAst(currentNode.body, parent, rest, text)
      }

      text += body + '</'+ currentNode.tag +'>\n'
    }

    while (rest.length > 0) {
      var next = rest.pop()
      var tag = parent.pop()
      text += parent.map(function(){return '\t'}).join('') + '</'+ tag +'>\n'
      if (next.length > 0) {
        traverseSvgAst(next, parent, rest, text)
      }
    }

    return text
  }

  if (fine) {
    $("footer").text(""); 
    $("footer").removeClass('err');
    $("#code > div:nth-child(" + err + ")").removeClass('err');
  }

  return traverseSvgAst(ast)
}

var SBN = {}

SBN.VERSION = '0.5.6'
SBN.lexer = lexer
SBN.parser = parser
SBN.transformer = transformer
SBN.generator = generator

SBN.compile = function (code, line) {
  line = line;
  return this.generator(this.transformer(this.parser(this.lexer(code), line)))
}

return SBN;

})));
