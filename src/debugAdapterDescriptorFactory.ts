import * as vscode from 'vscode';
import { ClojureScriptDebugSession } from './debugAdapter';

export class DebugAdapterDescriptorFactory implements vscode.DebugAdapterDescriptorFactory {
    createDebugAdapterDescriptor(
        session: vscode.DebugSession
    ): vscode.DebugAdapterDescriptor {
        console.log("DebugAdapterDescriptorFactory called");
        return new vscode.DebugAdapterInlineImplementation(new ClojureScriptDebugSession());
    }
}
