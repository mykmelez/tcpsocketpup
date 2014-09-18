// Import self, even though we don't use it, because otherwise our pageshow
// event handler doesn't get called.
var self = require('sdk/self');

var { ActionButton } = require("sdk/ui/button/action");
var tabs = require("sdk/tabs");
var { Cu } = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");

const TCP_SOCKET_PERM = "tcp-socket";
const CONTACTS_READ_PERM = "contacts-read";
const LABEL_DISABLED = "mozTCPSocket/mozContacts APIs disabled";
const LABEL_ENABLED = "mozTCPSocket/mozContacts APIs enabled";
const ICON_DISABLED = "./unplugged.svg";
const ICON_ENABLED = "./plugged.svg";
const STATE_DISABLED = {
  label: LABEL_DISABLED,
  icon: ICON_DISABLED,
};
const STATE_ENABLED = {
  label: LABEL_ENABLED,
  icon: ICON_ENABLED,
};

function getPrincipal(tab) {
  var uri = Services.io.newURI(tab.url, null, null);
  var principal = Services.scriptSecurityManager.getNoAppCodebasePrincipal(uri);
  return principal;
}

var button = ActionButton({
  id: "action-button",
  label: LABEL_DISABLED,
  icon: ICON_DISABLED,
  onClick: function(state) {
    if (state.label == LABEL_DISABLED) {
      Services.perms.addFromPrincipal(getPrincipal(tabs.activeTab), TCP_SOCKET_PERM, Services.perms.ALLOW_ACTION);
      Services.perms.addFromPrincipal(getPrincipal(tabs.activeTab), CONTACTS_READ_PERM, Services.perms.ALLOW_ACTION);
      button.state("tab", STATE_ENABLED);
    }
    else {
      Services.perms.removeFromPrincipal(getPrincipal(tabs.activeTab), TCP_SOCKET_PERM);
      Services.perms.removeFromPrincipal(getPrincipal(tabs.activeTab), CONTACTS_READ_PERM);
      button.state("tab", STATE_DISABLED);
    }
  },

});

tabs.on("pageshow", function(tab) {
  if (Services.perms.testPermissionFromPrincipal(getPrincipal(tab), TCP_SOCKET_PERM) == Services.perms.ALLOW_ACTION &&
      Services.perms.testPermissionFromPrincipal(getPrincipal(tab), CONTACTS_READ_PERM) == Services.perms.ALLOW_ACTION) {
    button.state(tab, STATE_ENABLED);
  }
  else {
    button.state(tab, STATE_DISABLED);
  }
});
