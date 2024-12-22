## CLJS debugger

##### 12/21
- vscode communicates to the debug adapter that a breakpoint has been set and where
- a chrome debugging client passes the request to chrome after some source map stuff
- uses the `yo code` extension skeleton setup

things to do to get it to work:
- close all chrome windows/tabs so you can start a session in debug mode
- in a terminal run `chrome --remote-debugging-port=9222`
	- if you connect, you'll some readout in the terminal or check `localhost:9222/json`
- set the URL you want to debug in `debugAdapter.ts`
- `npm run watch` in a terminal in vscode
- in the debug panel, select `Run Extension`
- in the extension host window, open a project w/ cljs
- in `launch.json` , add this to launch configurations :

```
{
	"type": "clojurescript",
	"request": "launch",
	"name": "Launch CLJS Debugger"
}
```
- `type` must match the type specified in your extension's `package.json` `contributes.debuggers`
- go to a `.cljs` file (this activates the extension)
- set a breakpoint
- in the extension host, run the "Launch CLJS debugger"
- your chrome session should be at the URL specified
- you may have to reload the page; check the debug console; the page should trip on your breakpoint at some point