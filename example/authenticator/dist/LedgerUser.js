"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LedgerUser = void 0;

var _eosjsLedgerSignatureProvider = require("@blockone/eosjs-ledger-signature-provider");

var _universalAuthenticatorLibrary = require("@blockone/universal-authenticator-library");

var _eosjs = require("eosjs");

var _textEncoding = require("text-encoding");

var _UALLedgerError = require("./UALLedgerError");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LedgerUser =
/*#__PURE__*/
function (_User) {
  _inherits(LedgerUser, _User);

  function LedgerUser(chain, accountName, requestPermission) {
    var _this;

    _classCallCheck(this, LedgerUser);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LedgerUser).call(this));

    _defineProperty(_assertThisInitialized(_this), "api", null);

    _defineProperty(_assertThisInitialized(_this), "rpc", null);

    _defineProperty(_assertThisInitialized(_this), "signatureProvider", void 0);

    _defineProperty(_assertThisInitialized(_this), "textEncoder", void 0);

    _defineProperty(_assertThisInitialized(_this), "textDecoder", void 0);

    if (typeof TextEncoder !== 'undefined') {
      _this.textEncoder = TextEncoder;
      _this.textDecoder = TextDecoder;
    } else {
      _this.textEncoder = _textEncoding.TextEncoder;
      _this.textDecoder = _textEncoding.TextDecoder;
    }

    return _this;
  }

  _createClass(LedgerUser, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var rpcEndpoint, rpcEndpointString;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.signatureProvider = new _eosjsLedgerSignatureProvider.SignatureProvider();
                rpcEndpoint = this.chain.rpcEndpoints[0];
                rpcEndpointString = "".concat(rpcEndpoint.protocol, "://").concat(rpcEndpoint.host, ":").concat(rpcEndpoint.port);
                this.rpc = new _eosjs.JsonRpc(rpcEndpointString);
                this.api = new _eosjs.Api({
                  rpc: this.rpc,
                  signatureProvider: this.signatureProvider,
                  textEncoder: new this.textEncoder(),
                  textDecoder: new this.textDecoder()
                });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "signTransaction",
    value: function () {
      var _signTransaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(transaction, _ref) {
        var _ref$broadcast, broadcast, _ref$blocksBehind, blocksBehind, _ref$expireSeconds, expireSeconds, completedTransaction, message, type, cause;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ref$broadcast = _ref.broadcast, broadcast = _ref$broadcast === void 0 ? true : _ref$broadcast, _ref$blocksBehind = _ref.blocksBehind, blocksBehind = _ref$blocksBehind === void 0 ? 3 : _ref$blocksBehind, _ref$expireSeconds = _ref.expireSeconds, expireSeconds = _ref$expireSeconds === void 0 ? 30 : _ref$expireSeconds;
                _context2.prev = 1;
                _context2.t0 = this.api;

                if (!_context2.t0) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 6;
                return this.api.transact(transaction, {
                  broadcast: broadcast,
                  blocksBehind: blocksBehind,
                  expireSeconds: expireSeconds
                });

              case 6:
                _context2.t0 = _context2.sent;

              case 7:
                completedTransaction = _context2.t0;
                return _context2.abrupt("return", this.returnEosjsTransaction(broadcast, completedTransaction));

              case 11:
                _context2.prev = 11;
                _context2.t1 = _context2["catch"](1);
                message = _context2.t1.message ? _context2.t1.message : 'Unable to sign transaction';
                type = UALErrorType.Signing;
                cause = _context2.t1;
                throw new _UALLedgerError.UALLedgerError(message, type, cause);

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 11]]);
      }));

      function signTransaction(_x, _x2) {
        return _signTransaction.apply(this, arguments);
      }

      return signTransaction;
    }()
  }, {
    key: "signArbitrary",
    value: function () {
      var _signArbitrary = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                throw new _UALLedgerError.UALLedgerError("".concat(Name, " does not currently support signArbitrary"), UALErrorType.Unsupported, null);

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function signArbitrary() {
        return _signArbitrary.apply(this, arguments);
      }

      return signArbitrary;
    }()
  }, {
    key: "verifyKeyOwnership",
    value: function () {
      var _verifyKeyOwnership = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                throw new _UALLedgerError.UALLedgerError("".concat(Name, " does not currently support verifyKeyOwnership"), UALErrorType.Unsupported, null);

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function verifyKeyOwnership() {
        return _verifyKeyOwnership.apply(this, arguments);
      }

      return verifyKeyOwnership;
    }()
  }, {
    key: "getAccountName",
    value: function () {
      var _getAccountName = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", this.accountName);

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getAccountName() {
        return _getAccountName.apply(this, arguments);
      }

      return getAccountName;
    }()
  }, {
    key: "getChainId",
    value: function () {
      var _getChainId = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", this.chain.chainId);

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getChainId() {
        return _getChainId.apply(this, arguments);
      }

      return getChainId;
    }()
  }, {
    key: "getKeys",
    value: function () {
      var _getKeys = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7() {
        var keys, message, type, cause;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return this.signatureProvider.getAvailableKeys(this.requestPermission);

              case 3:
                keys = _context7.sent;
                return _context7.abrupt("return", keys);

              case 7:
                _context7.prev = 7;
                _context7.t0 = _context7["catch"](0);
                message = "Unable to getKeys for account ".concat(this.accountName, ".\n        Please make sure your ledger device is connected and unlocked");
                type = UALErrorType.DataRequest;
                cause = _context7.t0;
                throw new _UALLedgerError.UALLedgerError(message, type, cause);

              case 13:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 7]]);
      }));

      function getKeys() {
        return _getKeys.apply(this, arguments);
      }

      return getKeys;
    }()
  }, {
    key: "isAccountValid",
    value: function () {
      var _isAccountValid = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8() {
        var account, actualKeys, authorizationKeys, message, type, cause;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                _context8.t0 = this.rpc;

                if (!_context8.t0) {
                  _context8.next = 6;
                  break;
                }

                _context8.next = 5;
                return this.rpc.get_account(this.accountName);

              case 5:
                _context8.t0 = _context8.sent;

              case 6:
                account = _context8.t0;
                actualKeys = this.extractAccountKeys(account);
                _context8.next = 10;
                return this.getKeys();

              case 10:
                authorizationKeys = _context8.sent;
                return _context8.abrupt("return", actualKeys.filter(function (key) {
                  return authorizationKeys.indexOf(key) !== -1;
                }).length > 0);

              case 14:
                _context8.prev = 14;
                _context8.t1 = _context8["catch"](0);

                if (!(_context8.t1.constructor.name === 'UALLedgerError')) {
                  _context8.next = 18;
                  break;
                }

                throw _context8.t1;

              case 18:
                message = "Account validation failed for account ".concat(this.accountName, ".");
                type = UALErrorType.Validation;
                cause = _context8.t1;
                throw new _UALLedgerError.UALLedgerError(message, type, cause);

              case 22:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[0, 14]]);
      }));

      function isAccountValid() {
        return _isAccountValid.apply(this, arguments);
      }

      return isAccountValid;
    }()
  }, {
    key: "extractAccountKeys",
    value: function extractAccountKeys(account) {
      var keySubsets = account.permissions.map(function (permission) {
        return permission.required_auth.keys.map(function (key) {
          return key.key;
        });
      });
      var keys = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = keySubsets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var keySubset = _step.value;
          keys = keys.concat(keySubset);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return keys;
    }
  }]);

  return LedgerUser;
}(_universalAuthenticatorLibrary.User);

exports.LedgerUser = LedgerUser;