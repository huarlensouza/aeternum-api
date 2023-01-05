"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _mysql2 = require('mysql2'); var _mysql22 = _interopRequireDefault(_mysql2);
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

exports. default = _mysql22.default.createPool(_database2.default);