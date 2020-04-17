"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.database = database;
exports.write = write;

var _pluralize = require("pluralize");

var _processContent = _interopRequireDefault(require("./process-content"));

var fs = require('fs');

var path = require('path');

var pluralize = require('pluralize');

var type = {
  is: {
    file: function file(item) {
      if (/\..+$/.test(item)) {
        return item.split('.')[0];
      } else {
        return false;
      }
    },
    folder: function folder(item) {
      if (!/\..+$/.test(item)) {
        return item;
      } else {
        return false;
      }
    },
    singular: function singular(item) {
      return pluralize.isSingular(item);
    },
    plural: function plural(item) {
      return pluralize.isPlural(item);
    },
    index: function index(value) {
      return /^index..+$/.test(value);
    },
    collection: function collection(value, source) {
      var isCollection = false;

      if (type.is.folder(value) && type.has.index(source, value)) {
        isCollection = true;
      }

      return isCollection;
    },
    item: function item(value, source) {
      var isItem = false;

      if (type.is.file(value) || type.has.index(source, value)) {
        isItem = true;
      }

      return isItem;
    },
    hidden: function hidden(value) {
      return /^_/.test(value);
    }
  },
  has: {
    index: function index(source, value) {
      var hasIndex = false;

      if (type.is.folder(value)) {
        fs.readdirSync(path.join(source + value)).map(function (value, index) {
          if (type.is.index(value)) {
            hasIndex = true;
          }
        });
      }

      return hasIndex;
    }
  }
};

function createResrouce(dir, value, index, parent) {
  var level = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

  if (type.is.hidden(value)) {
    return;
  }

  var resource = {
    _id: index,
    _file: value,
    _type: "item"
  };

  if (type.is.singular(value)) {
    resource._type = "item";
  }

  if (type.is.folder(value) && !type.has.index(dir, value)) {
    resource._type = "collection";
  }

  if (type.is.item(value, dir)) {
    resource._collection = parent;
  }

  if (type.is.folder(value)) {
    var subDir = path.join(dir + value + '/');
    var _parent = value;
    fs.readdirSync(subDir).map(function (value, index) {
      createResrouce(subDir, value, index, _parent);
    });
  } // Get content
  // Apply content from file


  if (type.is.file(value)) {
    Object.assign(resource, (0, _processContent["default"])(dir, value));
  } // Apply content from index file


  if (type.is.folder(value) && type.has.index(dir)) {
    var _subDir = path.join(dir + value + '/');

    var indexContent = "";
    fs.readdirSync(dir).map(function (value, index) {
      if (/\index..+$/.test(value)) {
        indexContent = (0, _processContent["default"])(dir, value); // console.log(subDir)
      }
    });
    Object.assign(resource, indexContent);
  }

  if (!type.is.index(value)) db.push(resource);
}

var db = [];

function createDatabase(dir) {
  var database = fs.readdirSync(dir).map(function (value, index) {
    createResrouce(dir, value, index);
  });
  return db;
}

function database(dir) {
  return createDatabase(dir);
}

function write(dir) {
  var db = JSON.stringify(createDatabase(dir), null, '\t');
  fs.writeFile('db.json', db, function (err) {
    if (err) throw err; // console.log('The file has been saved!');
  });
}