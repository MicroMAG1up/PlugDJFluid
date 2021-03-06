var PlugDJFluidApp,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PlugDJFluidApp = (function() {

  function PlugDJFluidApp() {
    this.trackChange = __bind(this.trackChange, this);

    this.friendJoin = __bind(this.friendJoin, this);

    this.newFan = __bind(this.newFan, this);

    this.showWindow = __bind(this.showWindow, this);

    this.sendPresentMessage = __bind(this.sendPresentMessage, this);

    this.tryToDJ = __bind(this.tryToDJ, this);

    this.toggleMute = __bind(this.toggleMute, this);

    this.chatMessageHappened = __bind(this.chatMessageHappened, this);

    this.djBoothChange = __bind(this.djBoothChange, this);
    this.muted = false;
    this.autowoot = true;
    this.setEvents();
    window.fluid.addDockMenuItem("Mute", this.toggleMute);
  }

  PlugDJFluidApp.prototype.setEvents = function() {
    API.addEventListener(API.USER_FAN, this.newFan);
    API.addEventListener(API.FRIEND_JOIN, this.friendJoin);
    API.addEventListener(API.DJ_ADVANCE, this.trackChange);
    API.addEventListener(API.DJ_UPDATE, this.djBoothChange);
    return API.addEventListener(API.CHAT, this.chatMessageHappened);
  };

  PlugDJFluidApp.prototype.djBoothChange = function(djs) {
    var growlOptions,
      _this = this;
    if (djs.length < 5) {
      if (!(this.muted || this.isInDJBooth())) {
        growlOptions = {
          title: "DJ Spot available",
          description: "Click to try and grab it",
          sticky: true,
          onclick: function() {
            return _this.tryToDJ();
          }
        };
        return window.fluid.showGrowlNotification(growlOptions);
      }
    }
  };

  PlugDJFluidApp.prototype.chatMessageHappened = function(data) {
    var growlOptions,
      _this = this;
    if (this.isInDJBooth()) {
      if (data.type === "message") {
        if (data.message.match(/^\/djs/)) {
          growlOptions = {
            title: "DJ Status Ping",
            description: "Click to chime in",
            sticky: true,
            onclick: function() {
              return _this.sendPresentMessage();
            }
          };
          return window.fluid.showGrowlNotification(growlOptions);
        }
      }
    }
  };

  PlugDJFluidApp.prototype.isInDJBooth = function() {
    var dj, username, _i, _len, _ref;
    username = API.getSelf().username;
    _ref = API.getDJs();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dj = _ref[_i];
      if (dj.username === username) {
        return true;
      }
    }
    return false;
  };

  PlugDJFluidApp.prototype.isActiveDJ = function() {
    var username;
    username = API.getSelf().username;
    return API.getDJs()[0].username === username;
  };

  PlugDJFluidApp.prototype.toggleMute = function() {
    if (this.muted) {
      window.fluid.removeDockMenuItem("Unmute");
      window.fluid.addDockMenuItem("Mute", this.toggleMute);
    } else {
      window.fluid.removeDockMenuItem("Mute");
      window.fluid.addDockMenuItem("Unmute", this.toggleMute);
    }
    $('#button-sound').click();
    return this.muted = !this.muted;
  };

  PlugDJFluidApp.prototype.durationToString = function(duration) {
    var hours, minutes, seconds;
    hours = Math.floor(duration / 3600);
    minutes = Math.floor((duration / 60) % 60);
    seconds = duration % 60;
    if (hours > 0) {
      return "" + hours + ":" + minutes + ":" + seconds;
    } else {
      return "" + minutes + ":" + seconds;
    }
  };

  PlugDJFluidApp.prototype.tryToDJ = function() {
    return $('#button-dj-play').click();
  };

  PlugDJFluidApp.prototype.sendPresentMessage = function() {
    var messages;
    messages = ["I'm here", "present", "here", "yup"];
    return API.sendChat(messages[Math.floor(Math.random() * messages.length)]);
  };

  PlugDJFluidApp.prototype.showWindow = function() {
    window.fluid.unhide();
    return window.fluid.active();
  };

  PlugDJFluidApp.prototype.newFan = function(user) {
    var growlOptions;
    if (!this.muted) {
      growlOptions = {
        title: "New fan",
        description: "" + user.username + " is now your fan!",
        sticky: false
      };
      return window.fluid.showGrowlNotification(growlOptions);
    }
  };

  PlugDJFluidApp.prototype.friendJoin = function(user) {
    var growlOptions;
    if (!this.muted) {
      growlOptions = {
        title: "Friend joined",
        description: "" + user.username + " has joined the room",
        sticky: false
      };
      return window.fluid.showGrowlNotification(growlOptions);
    }
  };

  PlugDJFluidApp.prototype.trackChange = function(obj) {
    var growlOptions, media;
    if (!this.muted) {
      media = API.getMedia();
      growlOptions = {
        title: media.title,
        description: "" + media.author + " - " + (this.durationToString(media.duration)),
        sticky: false
      };
      window.fluid.showGrowlNotification(growlOptions);
    }
    if (this.autowoot) {
      return $('#button-vote-positive').click();
    }
  };

  return PlugDJFluidApp;

})();

$(function() {
  return window.PlugDJFluidApp = new PlugDJFluidApp();
});
