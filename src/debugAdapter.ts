import {
    DebugSession,
    InitializedEvent,
    LoggingDebugSession,
} from 'vscode-debugadapter';
import { DebugProtocol } from 'vscode-debugprotocol';
import { DebuggerUtils } from './debuggerUtils';

const URL = "";

export class ClojureScriptDebugSession extends DebugSession {
    private debuggerUtil: DebuggerUtils; // Declare the property

    constructor() {
        super();
        console.log("ClojureScript DebugSession initialized");
        this.debuggerUtil = new DebuggerUtils();
    }

    protected async initializeRequest(
        response: DebugProtocol.InitializeResponse,
        args: DebugProtocol.InitializeRequestArguments
    ): Promise<void> {
        await this.debuggerUtil.initialize(URL);
        this.sendEvent(new InitializedEvent());
        response.body = {
            supportsConfigurationDoneRequest: true,
        };
        this.sendResponse(response);
    }

    protected launchRequest(
        response: DebugProtocol.LaunchResponse,
        args: DebugProtocol.LaunchRequestArguments
    ): void {
        console.log("launchRequest received");
        this.sendResponse(response);
    }

    protected setBreakPointsRequest(
        response: DebugProtocol.SetBreakpointsResponse,
        args: DebugProtocol.SetBreakpointsArguments
    ): void {
        const sourcePath = args.source.path;
        const breakpoints = args.breakpoints || [];

        const ext = sourcePath?.slice(-4);
        if (ext !== "cljs") { return; };

        // TODO
        const extractedPath = sourcePath?.split("cljs/")[1];
        const convertedPath = extractedPath?.replace(/\//g, ".").replace(".cljs", ".js");

        if (!convertedPath) {
            console.error("Error: Unable to convert path:", sourcePath);
            return;
        }

        for (const bp of breakpoints) {
            this.debuggerUtil.setBreakpoint(convertedPath, bp.line);
        }

        const verifiedBreakpoints = breakpoints.map(bp => ({
            verified: true,
            line: bp.line,
            column: bp.column || 0,
        }));

        response.body = {
            breakpoints: verifiedBreakpoints
        };

        console.log(`Breakpoints request seen in ${sourcePath}:`, verifiedBreakpoints);
        this.sendResponse(response);
    }
}

DebugSession.run(ClojureScriptDebugSession);