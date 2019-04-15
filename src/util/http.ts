import { parse } from 'url';
import { IncomingMessage } from 'http';
import * as fs from 'fs';

const getProxyVar = () => {
    return process.env.HTTPS_PROXY ||
        process.env.https_proxy ||
        process.env.HTTP_PROXY ||
        process.env.http_proxy;
};

export const getProxy = () => {
    const parsedUrl = new URL(getProxyVar());
    return {
        port: parsedUrl.port,
        host: parsedUrl.hostname,
        username: parsedUrl.username,
        password: parsedUrl.password
    };
};

export const getRequestOptions = (url: string) => {
    const parsedUrl = new URL(url);

    const options = {
        host: parsedUrl.hostname,
        path: parsedUrl.pathname,
        port: parsedUrl.port,
        headers: { Host: '' }
    };

    if (getProxyVar() && options.host !== 'localhost' && options.host.substring(0, 3) !== '127') {
        const proxy = getProxy();
        options.host = proxy.host;
        options.port = proxy.port;
        options.path = url;
        options.headers.Host = parsedUrl.hostname;
        if (proxy.username && proxy.password) {
            const auth = 'Basic ' + Buffer.from(proxy.username + ':' + proxy.password).toString('base64');
            Object.assign(options.headers, { 'Proxy-Authorization': auth });
        }
    }

    return options;
};

export const fetch = async (url: string): Promise<string> => {
    const requestUrl = getProxyVar() ? getProxyVar() : url;
    const proto = (parse(requestUrl).protocol.slice(0, -1)) === 'http' ? 'http' : 'https';
    const fetcher = await import(proto);
    return new Promise<string>((resolve, reject) => {
        const options = getRequestOptions(url);
        const request = fetcher.get(options, (response: IncomingMessage) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error(`Failed to load url: ${url}, status code:${response.statusCode}`));
            }
            const body: string[] = [];
            response.on('data', (chunk: string): void => {
                body.push(chunk);
            });
            response.on('end', (): void => resolve(body.join('')));
        });
        request.on('error', (err: any) => {
            reject(err);
        });
    });
};

export const downloadFile = async (url: string, writeLocation: string) => {
    const requestUrl = getProxyVar() ? getProxyVar() : url;
    const proto = (parse(requestUrl).protocol.slice(0, -1)) === 'http' ? 'http' : 'https';
    const fetcher = await import(proto);
    return new Promise((resolve, reject) => {
        try {
            const options = getRequestOptions(url);
            fetcher.get(options, (response: IncomingMessage) => {
                const file = fs.createWriteStream(writeLocation);
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            });
        } catch (e) {
            reject(e);
        }
    });
};

export const fetchJson = async (url: string): Promise<any> => {
    const res = await fetch(url);
    return JSON.parse(res);
};
