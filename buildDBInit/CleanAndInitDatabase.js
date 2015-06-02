var LoggerLevel;
(function (LoggerLevel) {
    LoggerLevel[LoggerLevel["Error"] = 0] = "Error";
    LoggerLevel[LoggerLevel["Warning"] = 1] = "Warning";
    LoggerLevel[LoggerLevel["Info"] = 2] = "Info";
    LoggerLevel[LoggerLevel["Debug"] = 3] = "Debug";
})(LoggerLevel || (LoggerLevel = {}));
var Logger = (function () {
    function Logger() {
    }
    Logger.useColor = function (status) {
        Logger.color = status;
    };

    Logger.setLevel = function (level) {
        Logger.level = level;
    };

    Logger.debug = function (msg) {
        if (Logger.level === 3 /* Debug */) {
            if (Logger.color && msg != null && msg != undefined && (typeof (msg) == "string" || msg instanceof String)) {
                console.log(msg.green);
            } else {
                console.log(msg);
            }
        }
    };

    Logger.info = function (msg) {
        if (Logger.level === 3 /* Debug */ || Logger.level === 2 /* Info */) {
            if (Logger.color && msg != null && msg != undefined && (typeof (msg) == "string" || msg instanceof String)) {
                console.log(msg.blue);
            } else {
                console.log(msg);
            }
        }
    };

    Logger.warn = function (msg) {
        if (Logger.level === 3 /* Debug */ || Logger.level === 2 /* Info */ || Logger.level === 1 /* Warning */) {
            if (Logger.color && msg != null && msg != undefined && (typeof (msg) == "string" || msg instanceof String)) {
                console.log(msg.orange);
            } else {
                console.log(msg);
            }
        }
    };

    Logger.error = function (msg) {
        if (Logger.color && msg != null && msg != undefined && (typeof (msg) == "string" || msg instanceof String)) {
            console.error(msg.red);
        } else {
            console.error(msg);
        }
    };
    Logger.color = true;

    Logger.level = 0 /* Error */;
    return Logger;
})();
var FulfillItf = (function () {
    function FulfillItf() {
    }
    FulfillItf.prototype.fulfill = function (successCallback, failCallback) {
        if (typeof successCallback === "undefined") { successCallback = null; }
        if (typeof failCallback === "undefined") { failCallback = null; }
        Logger.error("FulfillItf - fulfill : Method need to be implemented.");
    };
    return FulfillItf;
})();
var ModelException = (function () {
    function ModelException(message) {
        this.name = "ModelException";
        this.message = message;
    }
    return ModelException;
})();
var ModelItf = (function () {
    function ModelItf(id, createdAt, updatedAt) {
        if (typeof id === "undefined") { id = null; }
        if (typeof createdAt === "undefined") { createdAt = null; }
        if (typeof updatedAt === "undefined") { updatedAt = null; }
        if (!id && id !== null) {
            throw new ModelException("The ID cannot be undefined");
        }
        this._id = id;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }
    ModelItf.prototype.getId = function () {
        return this._id;
    };

    ModelItf.prototype.getCreatedAt = function () {
        return this._createdAt;
    };

    ModelItf.prototype.getUpdatedAt = function () {
        return this._updatedAt;
    };

    ModelItf.prototype.create = function (successCallback, failCallback) {
        Logger.error("ModelItf - create : Method need to be implemented.");
    };

    ModelItf.read = function (id, successCallback, failCallback) {
        Logger.error("ModelItf - read : Method need to be implemented.");
    };

    ModelItf.prototype.update = function (successCallback, failCallback) {
        Logger.error("ModelItf - update : Method need to be implemented.");
    };

    ModelItf.prototype.delete = function (successCallback, failCallback) {
        Logger.error("ModelItf - delete : Method need to be implemented.");
    };

    ModelItf.all = function (successCallback, failCallback) {
        Logger.error("ModelItf - all : Method need to be implemented.");
    };

    ModelItf.prototype.toJSONObject = function () {
        var data = {
            "id": this.getId(),
            "createdAt": this.getCreatedAt(),
            "updatedAt": this.getUpdatedAt()
        };
        return data;
    };
    return ModelItf;
})();
var fs = require('fs');

var BackendConfig = (function () {
    function BackendConfig() {
    }
    BackendConfig.retrieveConfigurationInformation = function () {
        if (BackendConfig.jwtSecret == "") {
            var file = __dirname + '/backend_config.json';

            if (process.env.JWT_SECRET) {
                BackendConfig.jwtSecret = process.env.JWT_SECRET;
            } else {
                try  {
                    var configInfos = JSON.parse(fs.readFileSync(file, 'utf8'));
                    BackendConfig.jwtSecret = configInfos.jwtSecret;
                } catch (e) {
                    Logger.error("Backend configuration file can't be read.");
                    Logger.debug(e);
                }
            }
        }
    };

    BackendConfig.getJWTSecret = function () {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.jwtSecret;
    };
    BackendConfig.jwtSecret = "";
    return BackendConfig;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UserSchema = require('./database/models/user.js').schema;

var crypto = require('crypto');

var User = (function (_super) {
    __extends(User, _super);
    function User(username, email, id, createdAt, updatedAt) {
        if (typeof username === "undefined") { username = ""; }
        if (typeof email === "undefined") { email = ""; }
        if (typeof id === "undefined") { id = null; }
        if (typeof createdAt === "undefined") { createdAt = null; }
        if (typeof updatedAt === "undefined") { updatedAt = null; }
        _super.call(this, id, createdAt, updatedAt);

        this.setUsername(username);
        this.setEmail(email);

        this._token = null;
        this._lastIp = null;
    }
    User.prototype.setUsername = function (username) {
        this._username = username;
    };

    User.prototype.username = function () {
        return this._username;
    };

    User.prototype.setEmail = function (email) {
        this._email = email;
    };

    User.prototype.email = function () {
        return this._email;
    };

    User.prototype.setToken = function (token) {
        this._token = token;
    };

    User.prototype.token = function () {
        return this._token;
    };

    User.prototype.setLastIp = function (lastIp) {
        this._lastIp = lastIp;
    };

    User.prototype.lastIp = function () {
        return this._lastIp;
    };

    User.prototype.toJSONObject = function () {
        var data = {
            "id": this.getId(),
            "createdAt": this.getCreatedAt(),
            "updatedAt": this.getUpdatedAt(),
            "username": this.username(),
            "email": this.email(),
            "token": this.token(),
            "lastIp": this.lastIp()
        };
        return data;
    };

    User.prototype.toJSONObjectWithPwd = function (password) {
        var data = this.toJSONObject();
        data["password"] = password;
        return data;
    };

    User.prototype.setPassword = function (password, successCallback, failCallback) {
        if (!(!!password)) {
            failCallback(new ModelException("The password must not be null or undefined or an empty string."));
            return;
        }

        if (!this.getId()) {
            failCallback(new ModelException("The object does not exist yet. It can't be update. Datas: " + JSON.stringify(this.toJSONObject())));
            return;
        }

        var self = this;

        UserSchema.findById(this.getId()).then(function (user) {
            var encryptedPwd = crypto.createHash('sha256').update(BackendConfig.getJWTSecret() + password).digest("hex");

            user.updateAttributes({ "password": encryptedPwd }).then(function () {
                user.save().then(function () {
                    successCallback(self);
                }).error(function (error) {
                    failCallback(error);
                });
            }).error(function (error) {
                failCallback(error);
            });
        });
    };

    User.prototype.checkPassword = function (password, successCallback, failCallback) {
        if (!(!!password)) {
            failCallback(new ModelException("The password must not be null or undefined or an empty string."));
            return;
        }

        if (!this.getId()) {
            failCallback(new ModelException("The object does not exist yet. It can't be update. Datas: " + JSON.stringify(this.toJSONObject())));
            return;
        }

        var self = this;

        UserSchema.findById(this.getId()).then(function (user) {
            var encryptedGivenPwd = crypto.createHash('sha256').update(BackendConfig.getJWTSecret() + password).digest("hex");

            if (!!user.dataValues.password) {
                if (encryptedGivenPwd == user.dataValues.password) {
                    var uObject = User.fromJSONObject(user.dataValues);
                    successCallback(uObject);
                } else {
                    failCallback(new ModelException("Given password is not correct."));
                }
            } else {
                failCallback(new ModelException("The response is a success but the data appears to be erroneous when reading an object \nResponse data: " + JSON.stringify(user.dataValues)));
            }
        }).error(function (error) {
            failCallback(error);
        });
    };

    User.prototype.create = function (successCallback, failCallback) {
        var self = this;

        if (this.getId() == null) {
            UserSchema.create(this.toJSONObject()).then(function (user) {
                var uObject = User.fromJSONObject(user.dataValues);
                self._id = uObject.getId();

                successCallback(uObject);
            }).error(function (error) {
                failCallback(error);
            });
        } else {
            failCallback(new ModelException("User already exists."));
        }
    };

    User.read = function (id, successCallback, failCallback) {
        UserSchema.findById(id).then(function (user) {
            var uObject = User.fromJSONObject(user.dataValues);
            successCallback(uObject);
        }).error(function (error) {
            failCallback(error);
        });
    };

    User.prototype.update = function (successCallback, failCallback) {
        var self = this;

        if (this.getId() != null) {
            UserSchema.findById(this.getId()).then(function (user) {
                user.updateAttributes(self.toJSONObject()).then(function () {
                    user.save().then(function () {
                        successCallback(self);
                    }).error(function (error) {
                        failCallback(error);
                    });
                }).error(function (error) {
                    failCallback(error);
                });
            });
        } else {
            failCallback(new ModelException("You need to create User before to update it."));
        }
    };

    User.prototype.delete = function (successCallback, failCallback) {
        var self = this;

        if (this.getId() != null) {
            UserSchema.findById(this.getId()).then(function (user) {
                user.destroy().then(function () {
                    var destroyId = self.getId();
                    self._id = null;

                    successCallback({ "id": destroyId });
                }).error(function (error) {
                    failCallback(error);
                });
            });
        } else {
            failCallback(new ModelException("You need to create User before to delete it..."));
        }
    };

    User.all = function (successCallback, failCallback) {
        UserSchema.all().then(function (users) {
            var allUsers = new Array();

            users.forEach(function (user) {
                allUsers.push(User.fromJSONObject(user.dataValues));
            });

            successCallback(allUsers);
        }).error(function (e) {
            failCallback(e);
        });
    };

    User.findOneByUsername = function (username, successCallback, failCallback) {
        UserSchema.findOne({ where: { "username": username } }).then(function (user) {
            var uObject = User.fromJSONObject(user.dataValues);
            successCallback(uObject);
        }).error(function (e) {
            failCallback(e);
        });
    };

    User.findOneByEmail = function (email, successCallback, failCallback) {
        UserSchema.findOne({ where: { "email": email } }).then(function (user) {
            var uObject = User.fromJSONObject(user.dataValues);
            successCallback(uObject);
        }).error(function (e) {
            failCallback(e);
        });
    };

    User.findOneByToken = function (token, successCallback, failCallback) {
        UserSchema.findOne({ where: { "token": token } }).then(function (user) {
            var uObject = User.fromJSONObject(user.dataValues);
            successCallback(uObject);
        }).error(function (e) {
            failCallback(e);
        });
    };

    User.parseJSON = function (jsonString) {
        return User.fromJSONObject(JSON.parse(jsonString));
    };

    User.fromJSONObject = function (jsonObject) {
        var user = new User(jsonObject.username, jsonObject.email, jsonObject.id, jsonObject.createdAt, jsonObject.updatedAt);

        if (!!jsonObject.token) {
            user.setToken(jsonObject.token);
        }

        if (!!jsonObject.lastIp) {
            user.setLastIp(jsonObject.lastIp);
        }

        return user;
    };
    return User;
})(ModelItf);
var crypto = require('crypto');

var FulfillUsers = (function (_super) {
    __extends(FulfillUsers, _super);
    function FulfillUsers() {
        _super.apply(this, arguments);
    }
    FulfillUsers.prototype.fulfill = function (successCallback, failCallback) {
        if (typeof successCallback === "undefined") { successCallback = null; }
        if (typeof failCallback === "undefined") { failCallback = null; }
        var self = this;

        var usersNb = 0;

        var users = require("./dbInitFiles/users.json");

        if (users.length == 0) {
            Logger.info("No users to create.");
            successCallback();
            return;
        }

        users.forEach(function (userDesc) {
            var user = new User(userDesc.username, userDesc.email);

            var successSetPassword = function () {
                Logger.info("User  '" + user.username() + "' : set password successfully.");
                usersNb = usersNb + 1;

                if (usersNb == users.length) {
                    successCallback();
                }
            };

            var successUserCreate = function () {
                Logger.info("User '" + user.username() + "' : create successfully. Id : " + user.getId());

                var encryptedPwd = crypto.createHash('sha256').update(userDesc.password).digest("hex");

                user.setPassword(encryptedPwd, successSetPassword, failCallback);
            };

            user.create(successUserCreate, failCallback);
        });
    };
    return FulfillUsers;
})(FulfillItf);
var colors;

try  {
    colors = require('colors');
} catch (e) {
    var returnFunc = function (str) {
        return str;
    };

    String.prototype["green"] = returnFunc;
    String.prototype["blue"] = returnFunc;
    String.prototype["orange"] = returnFunc;
    String.prototype["red"] = returnFunc;
}

var connection = require('./database/connection.js');
var relations = require('./database/relations.js');

var CleanAndInitDatabase = (function () {
    function CleanAndInitDatabase() {
        this._currentFulfillClassIndex = null;
    }
    CleanAndInitDatabase.prototype._cleanDatabase = function () {
        var self = this;

        relations.init();

        connection.sequelize.drop().then(function () {
            Logger.info("All tables dropped !");

            connection.sequelize.sync({ force: true }).then(function () {
                Logger.info("Base created !");

                self._fulfillDatabase();
            });
        });
    };

    CleanAndInitDatabase.prototype._fulfillDatabase = function () {
        var self = this;

        if (CleanAndInitDatabase.fulfillClasses.length > 0) {
            self._iterate();
        } else {
            Logger.error("Error during CleanAndInitDatabase :");
            Logger.error("Nothing to fulfill...");
        }
    };

    CleanAndInitDatabase.prototype._iterate = function () {
        var self = this;

        if (this._currentFulfillClassIndex == null) {
            this._currentFulfillClassIndex = 0;
        } else {
            this._currentFulfillClassIndex++;
        }

        if (this._currentFulfillClassIndex < CleanAndInitDatabase.fulfillClasses.length) {
            var fulfillClass = CleanAndInitDatabase.fulfillClasses[this._currentFulfillClassIndex];

            var fail = function (err) {
                Logger.error("Error during CleanAndInitDatabase :");

                if (err) {
                    Logger.error(err);
                }

                process.exit(0);
            };

            var success = function () {
                self._iterate();
            };

            var fulfillClassInstance = new fulfillClass();
            fulfillClassInstance.fulfill(success, fail);
        } else {
            Logger.info("Good job Rogue group!");

            process.exit(0);
        }
    };

    CleanAndInitDatabase.prototype.run = function () {
        this._cleanDatabase();
    };
    CleanAndInitDatabase.fulfillClasses = [FulfillUsers];
    return CleanAndInitDatabase;
})();

try  {
    var logLevel = 3 /* Debug */;

    if (process.argv.length > 2) {
        for (var i = 2; i < process.argv.length; i++) {
            var param = process.argv[i];
            var keyVal = param.split("=");
            if (keyVal.length > 1) {
                if (keyVal[0] == "loglevel") {
                    switch (keyVal[1]) {
                        case "error":
                            logLevel = 0 /* Error */;
                            break;
                        case "warning":
                            logLevel = 1 /* Warning */;
                            break;
                        case "info":
                            logLevel = 2 /* Info */;
                            break;
                        case "debug":
                            logLevel = 3 /* Debug */;
                            break;
                        default:
                            logLevel = 0 /* Error */;
                    }
                }
            }
        }
    }

    Logger.setLevel(logLevel);

    var caid = new CleanAndInitDatabase();
    caid.run();
} catch (e) {
    console.log(e);
    throw e;
}
