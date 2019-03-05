"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ledger = void 0;

var _universalAuthenticatorLibrary = require("@blockone/universal-authenticator-library");

var _LedgerUser = require("./LedgerUser");

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

var Ledger =
/*#__PURE__*/
function (_Authenticator) {
  _inherits(Ledger, _Authenticator);

  function Ledger(chains, options) {
    var _this;

    _classCallCheck(this, Ledger);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Ledger).call(this, chains, options));

    _defineProperty(_assertThisInitialized(_this), "onBoardingLink", 'https://www.ledger.com/pages/ledger-live');

    _defineProperty(_assertThisInitialized(_this), "users", []);

    _defineProperty(_assertThisInitialized(_this), "error", null);

    _defineProperty(_assertThisInitialized(_this), "chains", void 0);

    _defineProperty(_assertThisInitialized(_this), "options", void 0);

    _this.chains = chains;
    return _this;
  }

  _createClass(Ledger, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.info('Initialized!');

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "reset",
    value: function reset() {
      return;
    }
  }, {
    key: "isErrored",
    value: function isErrored() {
      return false;
    }
  }, {
    key: "getOnboardingLink",
    value: function getOnboardingLink() {
      return this.onBoardingLink;
    }
  }, {
    key: "getError",
    value: function getError() {
      return null;
    }
  }, {
    key: "isLoading",
    value: function isLoading() {
      return false;
    }
  }, {
    key: "getStyle",
    value: function getStyle() {
      return {
        icon: 'TODO',
        text: 'Ledger',
        textColor: '#FFFFFF',
        background: '#44bdbd'
      };
    }
  }, {
    key: "shouldRender",
    value: function shouldRender() {
      if (window.location.protocol !== 'https:') {
        return false;
      }

      return true;
    }
  }, {
    key: "shouldAutoLogin",
    value: function shouldAutoLogin() {
      return false;
    }
  }, {
    key: "shouldRequestAccountName",
    value: function () {
      var _shouldRequestAccountName = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", true);

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function shouldRequestAccountName() {
        return _shouldRequestAccountName.apply(this, arguments);
      }

      return shouldRequestAccountName;
    }()
  }, {
    key: "login",
    value: function () {
      var _login = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(accountName) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, chain, user, isValid, message, type, cause;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 3;
                _iterator = this.chains[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 22;
                  break;
                }

                chain = _step.value;
                user = new _LedgerUser.LedgerUser(chain, accountName, this.requiresGetKeyConfirmation(accountName));
                _context3.next = 10;
                return user.init();

              case 10:
                _context3.next = 12;
                return user.isAccountValid();

              case 12:
                isValid = _context3.sent;

                if (isValid) {
                  _context3.next = 18;
                  break;
                }

                message = "Error logging into account \"".concat(accountName, "\"");
                type = UALErrorType.Login;
                cause = null;
                throw new UALLedgerError(message, type, cause);

              case 18:
                this.users.push(user);

              case 19:
                _iteratorNormalCompletion = true;
                _context3.next = 5;
                break;

              case 22:
                _context3.next = 28;
                break;

              case 24:
                _context3.prev = 24;
                _context3.t0 = _context3["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 28:
                _context3.prev = 28;
                _context3.prev = 29;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 31:
                _context3.prev = 31;

                if (!_didIteratorError) {
                  _context3.next = 34;
                  break;
                }

                throw _iteratorError;

              case 34:
                return _context3.finish(31);

              case 35:
                return _context3.finish(28);

              case 36:
                return _context3.abrupt("return", this.users);

              case 37:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 24, 28, 36], [29,, 31, 35]]);
      }));

      function login(_x) {
        return _login.apply(this, arguments);
      }

      return login;
    }()
  }, {
    key: "logout",
    value: function () {
      var _logout = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, user, message, type, cause;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context4.prev = 4;

                for (_iterator2 = this.users[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  user = _step2.value;
                  user.signatureProvider.cleanUp();
                  user.signatureProvider.clearCachedKeys();
                }

                _context4.next = 12;
                break;

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](4);
                _didIteratorError2 = true;
                _iteratorError2 = _context4.t0;

              case 12:
                _context4.prev = 12;
                _context4.prev = 13;

                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }

              case 15:
                _context4.prev = 15;

                if (!_didIteratorError2) {
                  _context4.next = 18;
                  break;
                }

                throw _iteratorError2;

              case 18:
                return _context4.finish(15);

              case 19:
                return _context4.finish(12);

              case 20:
                this.users = [];
                _context4.next = 29;
                break;

              case 23:
                _context4.prev = 23;
                _context4.t1 = _context4["catch"](0);
                message = CONSTANTS.logoutMessage;
                type = UALErrorType.Logout;
                cause = _context4.t1;
                throw new UALLedgerError(message, type, cause);

              case 29:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 23], [4, 8, 12, 20], [13,, 15, 19]]);
      }));

      function logout() {
        return _logout.apply(this, arguments);
      }

      return logout;
    }()
  }, {
    key: "requiresGetKeyConfirmation",
    value: function requiresGetKeyConfirmation() {
      if (!accountName) {
        return true;
      }

      var type = window.localStorage.getItem(UALLoggedInAuthType);
      var account = window.localStorage.getItem(UALAccountName);

      if (account === accountName && type === Name) {
        return false;
      }

      return true;
    }
  }]);

  return Ledger;
}(_universalAuthenticatorLibrary.Authenticator);

exports.Ledger = Ledger;