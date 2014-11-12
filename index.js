// Import self, even though we don't use it, because otherwise our pageshow
// event handler doesn't get called.
var self = require('sdk/self');

var { ActionButton } = require("sdk/ui/button/action");
var tabs = require("sdk/tabs");
var { Cu } = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");

// dom.mozTCPSocket.enabled is not set by default, but it's observed.
// dom.mozBrowserFramesEnabled is also not set by default but observed.
// dom.mozContacts.enabled is set by default but ignored!  Which is why
// we have to import ContactService.jsm below.  So it actually doesn't
// do anything now, but it'll do something in the future, when the bug
// is fixed.
// XXX File the bug!
Services.prefs.setBoolPref("dom.mozTCPSocket.enabled", true);
Services.prefs.setBoolPref("dom.mozBrowserFramesEnabled", true);
Services.prefs.setBoolPref("dom.mozContacts.enabled", true);

// We don't use this directly (which is why we import it into an object literal
// that we then discard), but nothing in the browser imports it, and it
// needs to be imported in order for mozContacts to work, so we do it ourselves.
Cu.import("resource://gre/modules/ContactService.jsm", {});

const TCP_SOCKET_PERM = "tcp-socket";
const CONTACTS_READ_PERM = "contacts-read";
const CONTACTS_WRITE_PERM = "contacts-write";
const CONTACTS_CREATE_PERM = "contacts-create";
const BROWSER_PERM = "browser";
const DESKTOP_NOTIFICATION_PERM = "desktop-notification";
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
      Services.perms.addFromPrincipal(getPrincipal(tabs.activeTab), CONTACTS_WRITE_PERM, Services.perms.ALLOW_ACTION);
      Services.perms.addFromPrincipal(getPrincipal(tabs.activeTab), CONTACTS_CREATE_PERM, Services.perms.ALLOW_ACTION);
      Services.perms.addFromPrincipal(getPrincipal(tabs.activeTab), BROWSER_PERM, Services.perms.ALLOW_ACTION);
      Services.perms.addFromPrincipal(getPrincipal(tabs.activeTab), DESKTOP_NOTIFICATION_PERM, Services.perms.ALLOW_ACTION);
      button.state("tab", STATE_ENABLED);
    }
    else {
      Services.perms.removeFromPrincipal(getPrincipal(tabs.activeTab), TCP_SOCKET_PERM);
      Services.perms.removeFromPrincipal(getPrincipal(tabs.activeTab), CONTACTS_READ_PERM);
      Services.perms.removeFromPrincipal(getPrincipal(tabs.activeTab), CONTACTS_WRITE_PERM);
      Services.perms.removeFromPrincipal(getPrincipal(tabs.activeTab), CONTACTS_CREATE_PERM);
      Services.perms.removeFromPrincipal(getPrincipal(tabs.activeTab), BROWSER_PERM);
      Services.perms.removeFromPrincipal(getPrincipal(tabs.activeTab), DESKTOP_NOTIFICATION_PERM);
      button.state("tab", STATE_DISABLED);
    }
  },

});

tabs.on("pageshow", function(tab) {
  if (Services.perms.testPermissionFromPrincipal(getPrincipal(tab), TCP_SOCKET_PERM) == Services.perms.ALLOW_ACTION &&
      Services.perms.testPermissionFromPrincipal(getPrincipal(tab), CONTACTS_READ_PERM) == Services.perms.ALLOW_ACTION &&
      Services.perms.testPermissionFromPrincipal(getPrincipal(tab), CONTACTS_WRITE_PERM) == Services.perms.ALLOW_ACTION &&
      Services.perms.testPermissionFromPrincipal(getPrincipal(tab), CONTACTS_CREATE_PERM) == Services.perms.ALLOW_ACTION &&
      Services.perms.testPermissionFromPrincipal(getPrincipal(tab), BROWSER_PERM) == Services.perms.ALLOW_ACTION &&
      Services.perms.testPermissionFromPrincipal(getPrincipal(tab), DESKTOP_NOTIFICATION_PERM) == Services.perms.ALLOW_ACTION) {
    button.state(tab, STATE_ENABLED);
  }
  else {
    button.state(tab, STATE_DISABLED);
  }
});
