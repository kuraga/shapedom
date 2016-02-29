'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Template = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _weakMap = require('babel-runtime/core-js/weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Namespaces
// TODO: properties vs attributes
var uuid = require('an-uuid');

var Template = exports.Template = function Template() {
    (0, _classCallCheck3.default)(this, Template);
};

var Shapedom = function () {
    function Shapedom(document) {
        (0, _classCallCheck3.default)(this, Shapedom);

        this.document = document;
        this.__templates = new _weakMap2.default();
    }

    (0, _createClass3.default)(Shapedom, [{
        key: 'createTemplate',
        value: function createTemplate(shapeOrString) {
            if (typeof shapeOrString === 'string' || shapeOrString instanceof String) {
                return shapeOrString;
            } else {
                var template = new Template();
                template.uuid = uuid();
                template.tag = shapeOrString.tag;
                template.attrs = (0, _assign2.default)({}, shapeOrString.attrs);
                template.children = [];
                if ('children' in shapeOrString) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = (0, _getIterator3.default)(shapeOrString.children), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var childShape = _step.value;

                            var childTemplate = this.createTemplate(childShape);
                            template.children.push(childTemplate);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }
                return template;
            }
        }
    }, {
        key: '__createText',
        value: function __createText(text) {
            var textNode = this.document.createTextNode(text);
            this.__templates.set(textNode, text);
            return textNode;
        }
    }, {
        key: '__createElement',
        value: function __createElement(template) {
            var element = this.document.createElement(template.tag);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(template.attrs)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var attrName = _step2.value;

                    var attrValue = template.attrs[attrName];
                    element.setAttribute(attrName, attrValue);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(template.children), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var child = _step3.value;

                    var childElement = this.__createNode(child);
                    element.appendChild(childElement);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            this.__templates.set(element, template);
            return element;
        }
    }, {
        key: '__createNode',
        value: function __createNode(templateOrString) {
            if (typeof templateOrString === 'string' || templateOrString instanceof String) {
                return this.__createText(templateOrString);
            } else if (templateOrString instanceof Template) {
                return this.__createElement(templateOrString);
            } else {
                throw new Error('Invalid template type');
            }
        }
    }, {
        key: '__updateTextByText',
        value: function __updateTextByText(textNode, newText) {
            var oldText = this.__templates.get(textNode);
            if (newText === oldText) {
                return textNode;
            }
            this.__templates.delete(textNode);
            var newTextNode = this.__createText(newText);
            var parent = textNode.parentNode;
            parent.replaceChild(newTextNode, textNode);
            this.__templates.set(newTextNode, newText);
            return newTextNode;
        }
    }, {
        key: '__updateTextByElement',
        value: function __updateTextByElement(textNode, newTemplate) {
            this.__templates.delete(textNode);
            var newElement = this.__createElement(newTemplate);
            var parent = textNode.parentNode;
            parent.replaceChild(newElement, textNode);
            return newElement;
        }
    }, {
        key: '__updateElementByText',
        value: function __updateElementByText(element, newText) {
            this.__removeChildren(element);
            this.__templates.delete(element);
            var newTextNode = this.__createText(newText);
            var parent = element.parentNode;
            parent.replaceChild(newTextNode, element);
            return newTextNode;
        }
    }, {
        key: '__removeNode',
        value: function __removeNode(node) {
            var parent = node.parentNode;
            parent.removeChild(node);
            this.__templates.delete(node);
        }
    }, {
        key: '__removeChildren',
        value: function __removeChildren(node) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = (0, _getIterator3.default)(node.childNodes), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var childNode = _step4.value;

                    this.__removeNode(childNode);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }, {
        key: '__updateElementByElementSameTemplate',
        value: function __updateElementByElementSameTemplate(element, newTemplate) {
            var oldTemplate = this.__templates.get(element);
            // Structure of newTemplate is the same as oldTemplate's,
            // so newTemplate.tag === oldTemplate.tag
            // Structure of newTemplate is the same as oldTemplate's,
            // so newTemplate.attrs === oldTemplate.attrs
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = (0, _getIterator3.default)((0, _keys2.default)(newTemplate.attrs)), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var newAttrName = _step5.value;

                    var oldAttrValue = oldTemplate.attrs[newAttrName];
                    var newAttrValue = newTemplate.attrs[newAttrName];
                    if (newAttrValue !== oldAttrValue) {
                        element.setAttribute(newAttrName, newAttrValue);
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            this.__templates.set(element, newTemplate);
            // Structure of newTemplate is the same as oldTemplate's,
            // so newTemplate.children.length === oldTemplate.children.length
            // and newTemplate.children[i].uuid === oldTemplate.children[i].uuid
            var oldChildren = oldTemplate.children;
            var newChildren = newTemplate.children;
            for (var i = 0; i < oldChildren.length; ++i) {
                var newChildTemplate = newChildren[i];
                var childNode = element.childNodes[i]; // TODO: Refactor
                this.__updateNode(childNode, newChildTemplate);
            }
            return element;
        }
    }, {
        key: '__updateChildren',
        value: function __updateChildren(element, newChildren) {
            var template = this.__templates.get(element);
            var oldChildren = template.children;
            var childrenToUpdate = Math.min(oldChildren.length, newChildren.length);
            for (var i = 0; i < childrenToUpdate; ++i) {
                var newChildTemplate = newChildren[i];
                var childNode = element.childNodes[i]; // TODO: Refactor
                this.__updateNode(childNode, newChildTemplate);
            }
            if (oldChildren.length <= newChildren.length) {
                for (var i = childrenToUpdate; i < newChildren.length; ++i) {
                    var newChild = newChildren[i];
                    var newChildNode = this.__createNode(newChild);
                    element.appendChild(newChildNode);
                }
            } else {
                for (var i = childrenToUpdate; i < oldChildren.length; ++i) {
                    // Pass the same index each time as element.childNodes is a *live* collection
                    this.__removeNode(element.childNodes[childrenToUpdate]);
                }
            }
            return element.childNodes;
        }
    }, {
        key: '__updateElementByElementDifferentTemplateSameTag',
        value: function __updateElementByElementDifferentTemplateSameTag(element, newTemplate) {
            var oldTemplate = this.__templates.get(element);
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = (0, _getIterator3.default)((0, _keys2.default)(oldTemplate.attrs)), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var oldAttrName = _step6.value;

                    var newAttrValue = newTemplate.attrs[oldAttrName];
                    if (!newAttrValue) {
                        element.removeAttribute(oldAttrName);
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = (0, _getIterator3.default)((0, _keys2.default)(newTemplate.attrs)), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var newAttrName = _step7.value;

                    var oldAttrValue = oldTemplate.attrs[newAttrName];
                    var newAttrValue = newTemplate.attrs[newAttrName];
                    if (newAttrValue !== oldAttrValue) {
                        element.setAttribute(newAttrName, newAttrValue);
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            var newChildren = newTemplate.children;
            this.__updateChildren(element, newChildren);
            this.__templates.set(element, newTemplate);
            return element;
        }
    }, {
        key: '__updateElementByElementDifferentTemplateDifferentTag',
        value: function __updateElementByElementDifferentTemplateDifferentTag(element, newTemplate) {
            var oldTemplate = this.__templates.get(element);
            this.__removeChildren(element);
            this.__templates.delete(element);
            var newElement = this.__createElement(newTemplate);
            var parent = element.parentNode;
            parent.replaceChild(newElement, element);
            return newElement;
        }
    }, {
        key: '__updateElementByElementDifferentTemplate',
        value: function __updateElementByElementDifferentTemplate(element, newTemplate) {
            var oldTemplate = this.__templates.get(element);
            if (newTemplate.tag === oldTemplate.tag) {
                return this.__updateElementByElementDifferentTemplateSameTag(element, newTemplate);
            } else {
                return this.__updateElementByElementDifferentTemplateDifferentTag(element, newTemplate);
            }
        }
    }, {
        key: '__updateNode',
        value: function __updateNode(node, newTemplate) {
            var oldTemplate = this.__templates.get(node);
            if (newTemplate === oldTemplate) {
                return node;
            }
            if (oldTemplate instanceof Template) {
                if (newTemplate instanceof Template) {
                    if (newTemplate.uuid === oldTemplate.uuid) {
                        return this.__updateElementByElementSameTemplate(node, newTemplate);
                    } else {
                        return this.__updateElementByElementDifferentTemplate(node, newTemplate);
                    }
                } else if (typeof newTemplate === 'string' || newTemplate instanceof String) {
                    return this.__updateElementByText(node, newTemplate);
                }
            } else if (typeof oldTemplate === 'string' || oldTemplate instanceof String) {
                if (newTemplate instanceof Template) {
                    return this.__updateTextByElement(node, newTemplate);
                } else if (typeof newTemplate === 'string' || newTemplate instanceof String) {
                    return this.__updateTextByText(node, newTemplate);
                }
            }
        }
    }, {
        key: 'render',
        value: function render(template) {
            var node = this.__createNode(template);
            return node;
        }
    }, {
        key: 'update',
        value: function update(node, template) {
            var newNode = undefined;
            if (!this.__templates.has(node)) {
                throw new Error('Node hasn\'t been rendered yet.');
            }
            if (!node.parentNode) {
                throw new Error('Can\'t update unattached node.');
            }
            newNode = this.__updateNode(node, template);
            return newNode;
        }
    }]);
    return Shapedom;
}();

exports.default = Shapedom;
