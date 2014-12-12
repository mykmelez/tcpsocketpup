Introduction
============

This Firefox extension toggles the mozTCPSocket, mozContacts, mozbrowser,
Notification APIs and systemXHR for web pages in Firefox, so you can test
Open Web Apps that need access to those APIs in the browser.

Install it, then press the "Plug-In" button in your toolbar while the page
in question is loaded into the active tab, and the extension will enable
those APIs for that page.  Press the button again to disable those APIs.

The APIs will remain enabled across page reloads, browser sessions, and even
after you uninstall the extension! So make sure you disable them once you
no longer need to test the page. And *be careful about the pages for which
you enable the APIs*, since you're escalating their privileges!

<a href="https://github.com/mykmelez/tcpsocketpup/releases/latest">Latest Release</a>

Credits
=======

"Plug-In" icon designed by
<a href="http://www.thenounproject.com/itshorty">Florian Huber</a>
from the <a href="http://www.thenounproject.com">Noun Project</a>.
