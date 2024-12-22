import * as vscode from 'vscode';
import { DebugAdapterDescriptorFactory } from './debugAdapterDescriptorFactory';

console.log("hello! at startup");

export function activate(context: vscode.ExtensionContext) {
    console.log("ClojureScript Debugger extension activated");

    context.subscriptions.push(
        vscode.debug.registerDebugAdapterDescriptorFactory(
            'clojurescript',
            new DebugAdapterDescriptorFactory()
        )
    );
}

export function deactivate() {
    console.log("ClojureScript Debugger extension deactivated");
}
