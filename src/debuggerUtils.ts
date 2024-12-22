import CDP from 'chrome-remote-interface';
import fetch from "node-fetch-commonjs";
import { SourceMapConsumer, RawSourceMap } from 'source-map';


export class DebuggerUtils {
    private client: any;
    private Debugger: any;
    private Page: any;
    private Runtime: any;

    constructor() {}

    async initialize(url: String): Promise<void> {
        this.client = await CDP();
        this.Debugger = this.client.Debugger;
        this.Page = this.client.Page;
        this.Runtime = this.client.Runtime;

        await this.Page.enable();
        await this.Debugger.enable();
        await this.Runtime.enable();

        this.Page.navigate({url: url});
        await this.Page.loadEventFired();

        console.log('Page loaded');
    }

    async setBreakpoint(file: string, line: number): Promise<void> {
        if (!this.Debugger || !this.Page) {
            throw new Error('DebuggerUtils is not initialized. Call initialize() first.');
        }

        this.Debugger.scriptParsed(async (params: any) => {

            if (params.url.includes(file)) {
                console.log(`Script URL: ${params.url}`);

                try {
                    const sourceMapUrl = `${params.url}.map`;
                    const response = await fetch(sourceMapUrl);

                    const sourceMapData = (await response.json()) as RawSourceMap;
                    const sourceMapConsumer = await new SourceMapConsumer(sourceMapData);

                    const generatedPosition = sourceMapConsumer.generatedPositionFor({
                        source: sourceMapConsumer.sources[0],
                        line,
                        column: 0,
                    });

                    const breakpointResult = await this.Debugger.setBreakpointByUrl({
                        url: params.url,
                        lineNumber: generatedPosition.line,
                        columnNumber: generatedPosition.column,
                    });

                    console.log('Breakpoint set:', breakpointResult);
                } catch (error) {
                    console.error(`Error setting breakpoint for ${params.url}:`, error);
                }
            }
        });
    }
}

